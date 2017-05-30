const fs = require('fs');
const parse = require('csv-parse');

const saveToJSON = (dataset) => {
  const writeStream = fs.createWriteStream('./data/dataset.json', {flags: 'w'});

  console.log('Start writing file');
  let i = 0;

  const writeData = (data, cb) => {
    if (!writeStream.write(data)) {
      writeStream.once('drain', cb)
    } else {
      process.nextTick(cb)
    }
  };

  const write = () => {
    console.log(' rows left', dataset.length - i);
    if (i === 0) {
      writeData('['+ ',\r\n'  + JSON.stringify(dataset[i]) + ',\r\n', 'utf-8', write);
    } else if (i === (dataset.length - 1)) {
      writeData(JSON.stringify(dataset[i]) + ',\r\n' + ']', 'utf-8', () => {
        writeStream.end(() => {
          console.log('Finish writing file');
        });
      });
    } else {
      writeData(JSON.stringify(dataset[i]) + ',\r\n', 'utf-8', write);
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

getData();
