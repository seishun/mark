var mongoose = require('mongoose');
var schema = mongoose.Schema({
  word1: 'string',
  word2: 'string',
  word3: 'string',
  first: 'boolean',
  last: 'boolean'
});

module.exports = function(mongoUri){
  var db = mongoose.createConnection(mongoUri);
  var Chain = db.model('Chain', schema);
  
  this.addWords = function(string, callback) {
    var words = string.split(/\s+/g);
    
    if (words.length < 3) {
      return;
    }
    
    var len = words.length-2;
    
    for (var i = 0; i < len; i++) {
      var newChain = new Chain({
        word1: words[i],
        word2: words[i+1],
        word3: words[i+2],
        first: i === 0,
        last: i == len-1
      });
      newChain.save(callback);
    }
  };

  this.buildChain = function(string, callback) {
//    console.log(string);
    
    function step(left) {
      var query = left ? {word2: response[0], word3: response[1]} : {word1: response[response.length-2], word2: response[response.length-1]};
      Chain.count(query, function(err, result) {
        if (err) {
          callback(err);
        }
        
        if (result === 0) {
          failed = true;
          callback('');
        }
        
        if (failed) {
          return;
        }
        
        Chain.findOne(query, null, { skip: Math.floor(Math.random() * result) }, function(err, result) {
          if (err) {
            callback(err);
          }
          
          if (failed) {
            return;
          }
          
          left ? response.unshift(result.word1) : response.push(result.word3);
          if (left ? result.first : result.last) {
            if (halfDone) {
              callback(response.join(' '));
            } else {
              halfDone = true;
            }
          } else {
            step(left);
          }
        });
      });
    }
    
    var words = string.split(/\s+/);

    if (words.length < 2) {
      return;
    }
    
    var firstIndex = Math.floor(Math.random() * (words.length - 1));
    var response = words.slice(firstIndex, firstIndex + 2);
    
    var halfDone = false;
    var failed = false;
    step(true);
    step(false);
    
  };
};