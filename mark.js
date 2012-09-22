function Mark(mongo_uri){
	this.mongoose = require('mongoose');
	this.db = this.mongoose.createConnection(mongo_uri);

	this.schema = this.mongoose.Schema({
		word1: 'string',
		word2: 'string',
		word3: 'string'
	});

	this.Chain = this.db.model('Chain', this.schema);
}

Mark.prototype.addWords = function(string, callback){
	var Chain = this.Chain;
	if(!(string.substr(string.length-1).match(/(\.|\!|\?)/i))){
		string += '.';
	}

	var words = string.split(/[\n\r\s]+/g);

	if(words[0] === undefined){
		return;
	}

	while(words.length < 3){
		words[words.length] = "";
	}

	var len = words.length-2;

	function find_or_insert(z){
		Chain.findOne({
			word1: words[z],
			word2: words[z+1],
			word3: words[z+2]
		}, function(err, result){
			if (err){} //todo: err handlll
			if (result === null){
				var new_chain = new Chain({
					word1: words[z],
					word2: words[z+1],
					word3: words[z+2]
				});
				new_chain.save(function(err){
					if(err){
						callback(err);
					} else {
						callback(true);
					}
				});
			}
		});
	}

	for(i = 0; i < len; i++){
		find_or_insert(i);
	}
};

Mark.prototype.buildChain = function(length, callback){
	var Chain = this.Chain;
	if(length === 1){
		Chain.count({word3: /(.*!||.*?||.*\.)$/}, function(err, result){
			var z = Math.floor(Math.random()*result);
			Chain.find({word3: /(.*!||.*?||.*\.)$/}, null, { skip: z, limit: 1 }, function(err, result){
				if(err){
					callback(err);
				} else {
					var total = result[0].word1 + ' ' + result[0].word2 + ' ' + result[0].word3;
					callback(total);
				}
			});
		});
	} else {
		Chain.count({}, function(err, result){
			var z = Math.floor(Math.random()*result);
			Chain.find({}, null, { skip: z, limit: 1 }, function(err, result){
				if(err){
					//TODO: handle this
				}
				total = result[0].word1;
				if(result[0].word2 !== undefined){
					total += ' ' + result[0].word2;
					if(result[0].word3 !== undefined){
						total += ' ' + result[0].word3;
					}
				}
				function get_words(i, words){
					if(i>length || words.word3 === undefined || words.length === 0){
						callback(total);
					} else {
						if(i != length-1){
							Chain.count({word1: words.word3}, function(err, result){
								if(err){
									//TODO: handle this
								}
								var z = Math.floor(Math.random()*result);
								Chain.find({word1: words.word3}, null, { skip: z, limit: 1 }, function(err, result){
									if(err){
										//TODO: handle this
									}
									total += ' ' + result[0].word2;
									if(result[0].word2 !== undefined){
										if(result[0].word3 !== undefined){
											total += ' ' + result[0].word3;
										}
										i++;
									}
									get_words(i, result[0]);
								});
							});
						} else {
							Chain.count({word1: words.word3, word3: /(.*!||.*?||.*\.)$/}, function(err, result){
								if(err){
									//TODO: handle this
								}
								var z = Math.floor(Math.random()*result);
								Chain.find({word1: words.word3, word3: /(.*!||.*?||.*\.)$/}, null, { skip: z, limit: 1 }, function(err, result){
									if(err){
										//TODO: handle this
									}
									if(result[0].word2 !== undefined){
										total += ' ' + result[0].word2;
										if(result[0].word3 !== undefined){
											total += ' ' + result[0].word3;
										}
										i++;
									}
									get_words(i, result[0]);
								});
							});
						}
					}
				}
				get_words(1, result[0]);
			});
		});
	}
};

module.exports = Mark;