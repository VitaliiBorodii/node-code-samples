# Negative/positive sentences classifier

Create a `./data` folder and clone ( [Sentiment Analysis Dataset.csv](http://thinknook.com/wp-content/uploads/2012/09/Sentiment-Analysis-Dataset.zip) ) file inside of it.

Then run `node parser.js` to convert a dataset into JSON file

`node index.js` - to start nlp module

You should get something like this:

<pre>
Parsing JSON dataset
Finished parsing JSON in 5.96 seconds
Start adding 10000 training records to model
Finished adding records in 1.45 seconds
Training Finished within 53.02 seconds
Model has been trained, trying to predict 500 test examples
Model's precision: 69.20 %
Ready for work in: 48.85 seconds
Model has 9981 docs
Enter the phrase you'd like to analyze:...
</pre>