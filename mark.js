var mongoose = require('mongoose');
var schema = mongoose.Schema({
  word1: 'string',
  word2: 'string',
  word3: 'string'
});

module.exports = function(mongoUri){
  var db = mongoose.createConnection(mongoUri);
  var Chain = db.model('Chain', schema);
  
  this.addWords = function(string, callback) {
    if (!(string.substr(string.length-1).match(/(\.|\!|\?)/i))){
      string += '.';
    }
  
    var words = string.split(/\s+/g);
  
    if (words[0] === undefined || words.length < 3){
      return;
    }
  
    var len = words.length-2;
  
    function findOrInsert(z) {
      Chain.findOne({
        word1: words[z],
        word2: words[z+1],
        word3: words[z+2]
      }, function(err, result){
        if (err){} //todo: err handlll
        if (result === null){
          var newChain = new Chain({
            word1: words[z],
            word2: words[z+1],
            word3: words[z+2]
          });
          newChain.save(function(err) {
            if (err){
              callback(err);
            } else {
              callback(true);
            }
          });
        }
      });
    }
  
    for (var i = 0; i < len; i++){
      findOrInsert(i);
    }
  };

  this.buildChain = function(param, callback) {

    function getWords(i, words){
      if (words === undefined || i > length || words.word3 === undefined || words.length === 0) {
        callback(total);
      } else {
        if (i != length-1) {
          Chain.count({word1: words.word2, word2: words.word3}, function(err, result){
            if (err){
              //TODO: handle this
            }
            if (result > 0) {
              var z = Math.floor(Math.random()*result);
              Chain.find({word1: words.word2, word2: words.word3}, null, { skip: z, limit: 1 }, function(err, result){
                if(err){
                  //TODO: handle this
                }
                if(result[0] !== undefined && result[0].word3 !== undefined){
                  total += ' ' + result[0].word3;
                  i++;
                }
                getWords(i, result[0]);
              });
            } else {
              getWords(i, undefined);
            }
          });
        } else {
          Chain.count({word1: words.word2, word2: words.word3, word3: /(.*!||.*?||.*\.)$/}, function(err, result) {
            if (err){
              //TODO: handle this
            }
            if (result > 0){
              var z = Math.floor(Math.random()*result);
              Chain.find({word1: words.word2, word2: words.word3, word3: /(.*!||.*?||.*\.)$/}, null, { skip: z, limit: 1 }, function(err, result) {
                if (err) {
                  //TODO: handle this
                }
                if (result[0] !== undefined && result[0].word3 !== undefined) {
                  total += ' ' + result[0].word3;
                  i++;
                }
                getWords(i, result[0]);
              });
            } else {
              getWords(i, undefined);
            }
          });
        }
      }
    }
    
    if(typeof param == "string"){
      var words = param.split(/\s+/g);
  
      if(words.length > 2){
        var len = words.length-1;
        var pos = Math.floor(Math.random()*len);
        var length = Math.floor(Math.random()*10);
        var total = '';
        Chain.count({word1: words[pos], word2: words[pos+1]}, function(err, result) {
          if(result > 0){
            var z = Math.floor(Math.random()*result);
            Chain.find({word1: words[pos], word2: words[pos+1]}, null, { skip: z, limit: 1 }, function(err, result) {
              if(err){
                //TODO: handle this
              }
              total = result[0].word1;
              if (result[0].word2 !== undefined) {
                total += ' ' + result[0].word2;
                if (result[0].word3 !== undefined) {
                  total += ' ' + result[0].word3;
                }
              }
              
              var length = param;
              getWords(1, result[0]);
            });
          }
        });
      }
    } else {
      if(param === 1){
        Chain.count({word3: /(.*!||.*?||.*\.)$/}, function(err, result){
          if(result > 0){
            var z = Math.floor(Math.random()*result);
            Chain.find({word3: /(.*!||.*?||.*\.)$/}, null, { skip: z, limit: 1 }, function(err, result){
              if(err){
                callback(err);
              } else {
                var total = result[0].word1 + ' ' + result[0].word2 + ' ' + result[0].word3;
                callback(total);
              }
            });
          }
        });
      } else {
        Chain.count({}, function(err, result){
          if(result > 0){
            var z = Math.floor(Math.random()*result);
            Chain.find({}, null, { skip: z, limit: 1 }, function(err, result){
              if(err){
                //TODO: handle this
              }
              var total = result[0].word1;
              if(result[0].word2 !== undefined){
                total += ' ' + result[0].word2;
                if(result[0].word3 !== undefined){
                  total += ' ' + result[0].word3;
                }
              }
              var length = param;
              getWords(1, result[0]);
            });
          }
        });
      }
    }
  };
};