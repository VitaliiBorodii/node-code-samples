const nlp = require('./nlp');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let startTime = Date.now();

nlp.run(10000)
  .then((model) => {
    console.log(`Ready for work in: ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
    console.log(`Model has ${model.docs.length} docs`);
    enterPhrase(model);

  })
  .catch(err => {
    console.error(err);
  });

const enterPhrase = (model) => {
  rl.question('Enter the phrase you\'d like to analyze: ', (answer) => {
    console.log(`Result: ${model.classify(answer)}`);
    console.log(model.getClassifications(answer));
    enterPhrase(model);
  });
};

