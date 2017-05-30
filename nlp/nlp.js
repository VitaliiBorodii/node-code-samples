const os = require('os');
const fs = require('fs');
let startTime = Date.now();
console.log('Parsing JSON dataset');
const dataset = require('./data/dataset.json');
console.log(`Finished parsing JSON in ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);

const natural = require('natural');
const fileToSave = './data/model.json';
const MAX_BATCH_SUCCESS = 1000;
const TEST_BATCH_SIZE = 500;
/*
 * For 100000 records:
 * adding took `20.9 seconds`
 * training model took `4787.6 seconds`
 * */

const getRandomIndexes = (num, max) => {
  let map = {};

  for (let i = 0; i < num; i++) {
    let index = Math.floor(Math.random() * max);
    while (map.hasOwnProperty(index)) {
      index = Math.floor(Math.random() * max)
    }
    map[index] = 1;
  }
  return Object.keys(map)
};

const shuffle = (a) => a.sort(() => (0.5 - Math.random()));

let classifier;

const test = () => {
  const testIndexes = getRandomIndexes(TEST_BATCH_SIZE, dataset.length);

  console.log(`Model has been trained, trying to predict ${TEST_BATCH_SIZE} test examples`);
  const data = testIndexes.map(idx => dataset[idx]);
  const correctQuesses = data.reduce((acc, record) => {
    const guess = classifier.classify(record.SentimentText);
    const correct = guess == record.Sentiment;
    //console.log(`"${record.SentimentText}": guess: ${guess} / actual: ${record.Sentiment}`, `matched: ${correct}`);
    return correct ? acc + 1 : acc;
  }, 0);

  console.log(`Model's precision: ${((100 * correctQuesses) / TEST_BATCH_SIZE).toFixed(2)} %`);
};

const singleThreadTraining = (callback) => {
  try {
    classifier.train();
    console.log(`Training Finished within ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
    callback(null, classifier);
  } catch (err) {
    callback(err);
  }
};

const multiThreadTraining = (callback) => {
  console.log('Try to do parallel training within', os.cpus().length, 'CPUs');
  classifier.trainParallelBatches({
    numThreads: os.cpus().length,
    batchSize: 1000
  });

  classifier.events.on('doneTraining', (result) => {
    if (result !== true) {
      return callback(result);
    }
    console.log(`Training Finished within ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
    callback(null, classifier);
  });
};

const train = (dataset) => {
  let startTime = Date.now();
  console.log(`Start adding ${dataset.length} training records to model`);
  dataset.forEach(record => classifier.addDocument(record.SentimentText, record.Sentiment));
  console.log(`Finished adding records in ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);

  return new Promise((resolve, reject) => {
    singleThreadTraining((err, classifier) => {
      if (err) {
        return reject(err);
      }
      test();
      resolve(classifier);
    });
  });

};

const create = (batchSize) => {
  classifier = new natural.BayesClassifier();
  const data = dataset.slice(0, batchSize);
  return train(data);
};

const save = () => {
  startTime = Date.now();
  console.log(`Saving model`);
  return new Promise((resolve, reject) => {
    classifier.save(fileToSave, (err) => {
      if (err) {
        return reject(err);
      }
      console.log(`Model has been saved in ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
      resolve(classifier);
    });
  });
};

const restore = (batchSize) => {
  startTime = Date.now();
  console.log(`Start restoring model`);
  const restoredModel = require(fileToSave);
  classifier = natural.BayesClassifier.restore(restoredModel);
  const offset = classifier.docs.length;
  console.log(`Model has been restored in ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
  const data = dataset.slice(offset, offset + batchSize);
  return train(data);
};

module.exports.run = (batchSize) => {
  const promise = fs.existsSync(fileToSave) ? restore(batchSize) : create(batchSize);
  return promise
    .then(save);
};