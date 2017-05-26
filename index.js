const nlp = require('./nlp/nlp');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let startTime = Date.now();
nlp(10000, false)
  .then((model) => {
    console.log(`Ready for work in: ${((Date.now() - startTime) / 1000).toFixed(1)} seconds`);
    enterPhrase(model);
  })
  .catch(err => {
    console.error(err);
  });

const enterPhrase = (model) => {
  rl.question('Enter the phrase you\'d like to analyze: ', (phrase) => {
    console.log(`Result: ${model.classify(phrase)}`);
    console.log(model.getClassifications(phrase));
    enterPhrase(model);
  });
};

