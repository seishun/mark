Mark
====

A basic Markov chain implementation for text generation for Node.js

Markov.py port (part of the Talho project https://github.com/eurekafag/Talho/blob/master/modules/markov.py)

## How to use



```js
var markov = new (require('mark'))('mongodb://user:password@alex.mongohq.com:port/db');
```


Adding words:

```js
markov.addWords(string, callback);

markov.addWords('The quick brown fox jumps over the lazy dog', function(result){
  //callback function for error handling
});
```
You must feed it full sentences for best results.

Building chain:

```js
markov.buildChain(length, callback);

markov.buildChain(10, function(result){
  //callback function that will display or handle result
});
```

