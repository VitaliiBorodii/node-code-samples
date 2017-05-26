const os = require('os');
let startTime = Date.now();
console.log('Parsing JSON dataset');
const dataset = require('./data/Sentiment_Analysis_Dataset.json');
console.log('Finished parsing JSON', `it took ${((Date.now() - startTime) / 1000).toFixed(1)} seconds`);

const natural = require('natural');
const classifier = new natural.BayesClassifier();

const MAX_BATCH_SUCCESS = 1000;

/*
 * For 100000 records:
 * adding took `20.9 seconds`
 * training model took `4787.6 seconds`
 * */


const testData = [
  'Very good',
  'Awesome!!!',
  'Not bad))',
  'Very bad',
  'I Love it',
  'It Sucks',
  'NOOOOO!!!!'
];

module.exports = (batchSize, parallel) => {
  return new Promise((resolve, reject) => {

    startTime = Date.now();
    console.log(`Start adding ${batchSize} test records to model`);
    batchSize = batchSize || undefined;
    const data = dataset.slice(0, batchSize);
    data.forEach((record) => {
      classifier.addDocument(record.SentimentText, record.Sentiment);
    });

    console.log('Finish adding records', `it took ${((Date.now() - startTime) / 1000).toFixed(1)} seconds`);

    const singleThreadTraining = () => {
      try {
        classifier.train();
        resolve(classifier);
        console.log(`Training Finished with ${((Date.now() - startTime) / 1000).toFixed(1)} seconds`);
      } catch (err) {
        reject(err);
      }
    };

    const multiThreadTraining = () => {
      console.log('Try to do parallel training within', os.cpus().length, 'CPUs');
      classifier.trainParallelBatches({
        numThreads: os.cpus().length,
        batchSize: 1000
      });

      classifier.events.on('doneTraining', (result) => {
        if (result !== true) {
          return reject(result);
        }
        console.log(`Training Finished with ${((Date.now() - startTime) / 1000).toFixed(1)} seconds`);
        resolve(classifier);
      });
    };

    console.log('Start training model');
    startTime = Date.now();

    parallel ? multiThreadTraining() : singleThreadTraining()

  });
};