var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Question = require('./models/question');

var { MONGO_DEV, MONGO_PROD } = require('./config/data');
mongoose.connect(MONGO_DEV, { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function() {
	console.log('Database connected...');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('Hello from microservice app!');
});

app.post('/search', async (req, res, next) => {
	var limit = 25;
	if (req.body.limit) {
		console.log('Limit provided: ' + limit);
		limit = req.body.limit;
		if (req.body.limit > 100) {
			limit = 100;
		} else if (req.body.limit < 25) {
			limit = 25;
		} else {
			limit = req.body.limit;
		}
	}

	if (req.body.q && req.body.q !== '') {
		console.log('query provided ' + req.body.q);
		var wordsToMatch = req.body.q.split(' ');
		var qRespArr = [];
		for (var x = 0; x < wordsToMatch.length; x++) {
			console.log(wordsToMatch[x]);
			var regex_ = new RegExp('\\b' + wordsToMatch[x] + '\\b');

			var query = {
				$or: [ { title: { $regex: regex_, $options: 'i' } }, { body: { $regex: regex_, $options: 'i' } } ]
			};
			const questions = await Question.find(query);

			console.log('IM HERE 1 ');
			for (var i = 0; i < questions.length; i++) {
				qRespArr.push({
					id: questions[i]._id,
					user: questions[i].user,
					title: questions[i].title,
					body: questions[i].body,
					score: questions[i].score,
					view_count: questions[i].view_count,
					answer_count: questions[i].answer_count,
					timestamp: parseFloat(questions[i].timestamp),
					media: questions[i].media,
					tags: questions[i].tags,
					accepted_answer_id: null
				});
			}
		}

		console.log('IM HERE 2');
		return res.send({ status: 'OK', questions: qRespArr });
	} else if (req.body.timestamp) {
		console.log(req.body.timestamp);
		Question.find({ timestamp: { $lte: req.body.timestamp.toString() } })
			.sort('-timestamp')
			.limit(limit)
			.exec(function(err, question) {
				if (err) {
					console.log('There was an error');
					console.log(err);
					return res.status(400).send({ status: 'error', error: 'error' });
				} else {
					var retArr = [];
					console.log(question);
					for (var i = 0; i < question.length; i++) {
						retArr.push({
							id: question[i]._id,
							user: question[i].user,
							title: question[i].title,
							body: question[i].body,
							score: question[i].score,
							view_count: question[i].view_count,
							answer_count: question[i].answer_count,
							timestamp: parseFloat(question[i].timestamp),
							media: question[i].media,
							tags: question[i].tags,
							accepted_answer_id: null
						});
					}
					console.log('records returned' + retArr.length);
					return res.send({ status: 'OK', questions: retArr });
				}
			});
	} else {
		Question.find().limit(limit).exec(function(err, question) {
			if (err) {
				console.log('There was an error');
				console.log(err);
				return res.status(400).send({ status: 'error', error: 'error' });
			} else {
				var retArr = [];
				console.log(question);
				for (var i = 0; i < question.length; i++) {
					retArr.push({
						id: question[i]._id,
						user: question[i].user,
						title: question[i].title,
						body: question[i].body,
						score: question[i].score,
						view_count: question[i].view_count,
						answer_count: question[i].answer_count,
						timestamp: parseFloat(question[i].timestamp),
						media: question[i].media,
						tags: question[i].tags,
						accepted_answer_id: null
					});
				}
				console.log('records returned' + retArr.length);
				return res.send({ status: 'OK', questions: retArr });
			}
		});
	}
});

app.listen(3000, () => {
	console.log('Server started...');
});
