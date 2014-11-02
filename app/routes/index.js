var express = require('express');
var router = express.Router();


/* retreive data from db and send */
router.get('/data', function(req,res) {
	var dummyData = {
		'entities' : {'is':{},'mp':{'contains':['Hristo','Pe6o']},'Hristo':{'is':['mp'],'knows':['Pe6o']},'knows':{},'Pe6o':{'is':['mp']}},
		'relations' : {'is':{'transitive':true,'opposite':'contains'},'contains':{'transitive':true,'opposite':'is'},'knows':{'transitive':true,'opposite':false}}
	};
	res.send(JSON.stringify(dummyData));
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'mic' });
});

module.exports = router;
