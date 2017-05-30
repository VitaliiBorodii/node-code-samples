const fs = require('fs');
const parse = require('csv-parse');

const encoding = 'utf-8';

const saveToJSON = (dataset) => {
  const writeStream = fs.createWriteStream('./data/dataset.json', {flags: 'w'});

  const startTime = Date.now();
  console.log('Start writing file');
  let i = 0;

  const writeData = (data, cb) => {
    if (!writeStream.write(data, encoding)) {
      writeStream.once('drain', cb);
    } else {
      process.nextTick(cb);
    }
  };

  const write = () => {
    console.log(' rows left', dataset.length - i);
    if (i === 0) {
      writeData('[' + '\r\n', write); //first row - open array, skip field names
    } else if (i === (dataset.length - 1)) {
      writeData(JSON.stringify(dataset[i]) + '\r\n' + ']', () => { //last row - close array
        writeStream.end(() => {
          console.log(`Finish writing file in ${((Date.now() - startTime)/1000).toFixed(2)} seconds`);
        });
      });
    } else {
      writeData(JSON.stringify(dataset[i]) + ',\r\n', write);
    }
    i++;
  };

  write();
};

const mapper = (a) => {
  let SentimentText = '';
  for (let i = 3; i < a.length; i++) {
    SentimentText += a[i];
  }
  return {
    id: a[0],
    Sentiment: a[1],
    SentimentText: SentimentText.trim()
  }
};

const getData = (path) => {
  return new Promise((resolve, reject) => {

    const parser = parse({
      delimiter: ',',
      auto_parse: true,
      quote: '',
      relax_column_count: true
    }, (err, dataset) => {
      if (err) {
        reject(err);
        return console.error(err);
      }
      const endTime = Date.now();
      console.log(`Finish extracting data, it took: ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
      const data = dataset.map(mapper);
      saveToJSON(data);
      resolve(data);
    });

    console.log('Start reading file');
    const startTime = Date.now();
    fs.createReadStream(path).pipe(parser);
  });
};

getData('./data/Sentiment Analysis Dataset.csv');
