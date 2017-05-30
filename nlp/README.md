# Negative/positive sentences classifier

Create a `./data` folder and clone ( [Sentiment_Analysis_Dataset.csv](http://thinknook.com/wp-content/uploads/2012/09/Sentiment-Analysis-Dataset.zip) ) file inside of it.
Then run `node parser.js` to convert a dataset into JSON file 
`node index.js` - to start nlp module

You should get something like this:

<pre>
Parsing JSON dataset

Finished parsing JSON in 5.7 seconds

Start adding 50000 training records to model

Finish adding records it took 6.1 seconds

Start training model

Training Finished with 1263.1 seconds

Model has been trained with 50000 training records, trying to predict 500 test examples

Model's precision: 75.40 %

Ready for work in: 1280.2 seconds

Enter the phrase you'd like to analyze: ...
</pre>