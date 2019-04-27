var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Question = require('./models/question');

var { MONGO_CONN } = require('./config/data');
mongoose.connect(MONGO_CONN, { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function () {
	console.log('Database connected...');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('Hello from microservice app!');
});

app.post('/search', async (req, res, next) => {
	console.log("Search routee..........")
	console.log("parameters given !!!!!!!")
	var limit = 25; //default
	var q = req.body.q ? req.body.q : null //optiona;
	// var timeStamp = now(); //default
	var sortBy = { score: -1 }; //default
	var has_media = req.body.has_media ? req.body.has_media : false; //default
	var accepted = req.body.accepted ? req.body.accepted : false; // 
	var tags = req.body.tags ? req.body.tags : undefined; //optional
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

	if (req.body.timeStamp) {
		timeStamp = now();
	}

	if (req.body.sort_by === "timestamp") {
		sortBy = { timestamp: -1 }
	}

	if ((q && q != '') && tags && has_media === true && accepted === true) {
		console.log("matched this condidion optionals q and tags and media were given all defaults are applied")
		var resReturn = [];

		for (var i = 0; i < q.split(" ").length; i++) {
			var regex_ = new RegExp('\\b' + q.split(" ")[i] + '\\b');

			var resultSet = await Question.find({ $and: [{ $or: [{ title: { $regex: regex_, $options: 'i' } }, { body: { $regex: regex_, $options: 'i' } }] }, { tags: { $in: tags } }, { "media.0": { "$exists": true } }, { accepted_answer_id: { $ne: null } }] }, '')
				.limit(limit)
				.sort(sortBy)

			for (var i = 0; i < resultSet.length; i++) {
				resReturn.push(resultSet[i].transform());
			}

			return res.send(resReturn);
		}
	}
	else if ((q && q != '') && !tags && has_media === true && accepted === true) {
		console.log("matched this condidion optionals q and (tags===undefined) and (media===true) and (accepted === true) were given all defaults are applied")
		var resReturn = [];

		for (var i = 0; i < q.split(" ").length; i++) {
			var regex_ = new RegExp('\\b' + q.split(" ")[i] + '\\b');

			var resultSet = await Question.find({ $and: [{ $or: [{ title: { $regex: regex_, $options: 'i' } }, { body: { $regex: regex_, $options: 'i' } }] }, { "media.0": { "$exists": true } }] }, '')
				.limit(limit)
				.sort(sortBy)

			for (var i = 0; i < resultSet.length; i++) {
				resReturn.push(resultSet[i].transform());
			}

			return res.send(resReturn);
		}

	}
	else if (!q && tags && has_media === true && accepted === true) {

		var resReturn = [];
		var resultSet = await Question.find({ $and: [{ tags: { $in: tags } }, { "media.0": { "$exists": true } }, { accepted_answer_id: { $ne: null } }] }, '')
			.limit(limit)
			.sort(sortBy)

		for (var i = 0; i < resultSet.length; i++) {
			resReturn.push(resultSet[i].transform());
		}

		return res.send(resReturn);

	}
	else if ((q && q != '') && accepted === true && tags && has_media === false) {
		console.log("q accepted===true; tags given; media===false")
		var resReturn = [];

		for (var i = 0; i < q.split(" ").length; i++) {
			var regex_ = new RegExp('\\b' + q.split(" ")[i] + '\\b');

			var resultSet = await Question.find({ $and: [{ $or: [{ title: { $regex: regex_, $options: 'i' } }, { body: { $regex: regex_, $options: 'i' } }] }] }, '')
				.limit(limit)
				.sort(sortBy)

			for (var i = 0; i < resultSet.length; i++) {
				resReturn.push(resultSet[i].transform());
			}

			return res.send(resReturn);
		}
	}
	else if ((q && q != '') && tags && accepted === false && has_media === false) {

		var resReturn = [];

		for (var i = 0; i < q.split(" ").length; i++) {
			var regex_ = new RegExp('\\b' + q.split(" ")[i] + '\\b');

			var resultSet = await Question.find({ $and: [{ $or: [{ title: { $regex: regex_, $options: 'i' } }, { body: { $regex: regex_, $options: 'i' } }] }, { tags: { $in: tags } }] }, '')
				.limit(limit)
				.sort(sortBy)

			for (var i = 0; i < resultSet.length; i++) {
				resReturn.push(resultSet[i].transform());
			}

			return res.send(resReturn);
		}
	}
	else if ((q && q != '') && !tags && accepted === false && has_media === true) {

		var resReturn = [];

		for (var i = 0; i < q.split(" ").length; i++) {
			var regex_ = new RegExp('\\b' + q.split(" ")[i] + '\\b');

			var resultSet = await Question.find({ $and: [{ $or: [{ title: { $regex: regex_, $options: 'i' } }, { body: { $regex: regex_, $options: 'i' } }] }, { "media.0": { "$exists": true } }] }, '')
				.limit(limit)
				.sort(sortBy)

			for (var i = 0; i < resultSet.length; i++) {
				resReturn.push(resultSet[i].transform());
			}

			return res.send(resReturn);
		}

	}
	else if ((q && q != '') && !tags && accepted === true && has_media === false) {

		var resReturn = [];

		for (var i = 0; i < q.split(" ").length; i++) {
			var regex_ = new RegExp('\\b' + q.split(" ")[i] + '\\b');

			var resultSet = await Question.find({ $and: [{ $or: [{ title: { $regex: regex_, $options: 'i' } }, { body: { $regex: regex_, $options: 'i' } }] }, { accepted_answer_id: { $ne: null } }] }, '')
				.limit(limit)
				.sort(sortBy)

			for (var i = 0; i < resultSet.length; i++) {
				resReturn.push(resultSet[i].transform());
			}

			return res.send(resReturn);
		}

	}
	else if (!q && tags && accepted === false && has_media === true) {
		var resReturn = [];


		var resultSet = await Question.find({ $and: [{ tags: { $in: tags } }, { "media.0": { "$exists": true } }] }, '')
			.limit(limit)
			.sort(sortBy)

		for (var i = 0; i < resultSet.length; i++) {
			resReturn.push(resultSet[i].transform());
		}

		return res.send(resReturn);
	}
	else if (!q && tags && accepted === true && has_media === false) {
		var resReturn = [];


		var resultSet = await Question.find({ $and: [{ tags: { $in: tags } }, { accepted_answer_id: { $ne: null } }] }, '')
			.limit(limit)
			.sort(sortBy)

		for (var i = 0; i < resultSet.length; i++) {
			resReturn.push(resultSet[i].transform());
		}

		return res.send(resReturn);

	}
	else if (!q && !tags && accepted === true && has_media === true) {

		var resReturn = [];


		var resultSet = await Question.find({ $and: [ { "media.0": { "$exists": true } }, { accepted_answer_id: { $ne: null } }] }, '')
			.limit(limit)
			.sort(sortBy)

		for (var i = 0; i < resultSet.length; i++) {
			resReturn.push(resultSet[i].transform());
		}

		return res.send(resReturn);
	}
	else if (q && q != '') {
		console.log("matched this condidion optionals q  were given all defaults are applied")
		var resReturn = [];

		for (var i = 0; i < q.split(" ").length; i++) {
			var regex_ = new RegExp('\\b' + q.split(" ")[i] + '\\b');

			var resultSet = await Question.find({ $or: [{ title: { $regex: regex_, $options: 'i' } }, { body: { $regex: regex_, $options: 'i' } }] }, '')
				.limit(limit)
				.sort(sortBy)

			for (var i = 0; i < resultSet.length; i++) {
				resReturn.push(resultSet[i].transform());
			}

			return res.send(resReturn);
		}

	} else if (tags) {

		console.log("matched this condidion optionals tags  were given all defaults are applied")
		var resReturn = [];

		var resultSet = await Question.find({ tags: { $in: tags } }, '')
			.limit(limit)
			.sort(sortBy)

		for (var i = 0; i < resultSet.length; i++) {
			resReturn.push(resultSet[i].transform());
		}

		return res.send(resReturn);


	} else if (has_media === true) {
		var resReturn = [];

		var resultSet = await Question.find({ "media.0": { "$exists": true } }, '')
			.limit(limit)
			.sort(sortBy)

		for (var i = 0; i < resultSet.length; i++) {
			resReturn.push(resultSet[i].transform());
		}

		return res.send(resReturn);
	}
	else if (accepted === true) {
		console.log("Only accepted flag was given")
		var resReturn = [];

		var resultSet = await Question.find({ accepted_answer_id: { $ne: null } }, '')
			.limit(limit)
			.sort(sortBy)

		for (var i = 0; i < resultSet.length; i++) {
			resReturn.push(resultSet[i].transform());
		}

		return res.send(resReturn);
	}else{
        if(!req.body){
			console.log("no paramaters given" + req.body);
		}
		var resReturn = [];
		var resultSet = await Question.find({ }, '')
			.limit(limit)
			.sort(sortBy)

		for (var i = 0; i < resultSet.length; i++) {
			resReturn.push(resultSet[i].transform());
		}
        console.log(resReturn.length)
		return res.send(resReturn);

	}



	//

	// if (req.body.q && req.body.q !== '') {
	// 	console.log('query provided ' + req.body.q);
	// 	var wordsToMatch = req.body.q.split(' ');
	// 	var qRespArr = [];
	// 	for (var x = 0; x < wordsToMatch.length; x++) {
	// 		console.log(wordsToMatch[x]);
	// 		var regex_ = new RegExp('\\b' + wordsToMatch[x] + '\\b');

	// 		var query = {
	// 			$or: [ { title: { $regex: regex_, $options: 'i' } }, { body: { $regex: regex_, $options: 'i' } } ]
	// 		};
	// 		const questions = await Question.find(query);

	// 		console.log('IM HERE 1 ');
	// 		for (var i = 0; i < questions.length; i++) {
	// 			qRespArr.push({
	// 				id: questions[i]._id,
	// 				user: questions[i].user,
	// 				title: questions[i].title,
	// 				body: questions[i].body,
	// 				score: questions[i].score,
	// 				view_count: questions[i].view_count,
	// 				answer_count: questions[i].answer_count,
	// 				timestamp: parseFloat(questions[i].timestamp),
	// 				media: questions[i].media,
	// 				tags: questions[i].tags,
	// 				accepted_answer_id: null
	// 			});
	// 		}
	// 	}

	// 	console.log('IM HERE 2');
	// 	return res.send({ status: 'OK', questions: qRespArr });
	// } else if (req.body.timestamp) {
	// 	console.log(req.body.timestamp);
	// 	Question.find({ timestamp: { $lte: req.body.timestamp.toString() } })
	// 		.sort('-timestamp')
	// 		.limit(limit)
	// 		.exec(function(err, question) {
	// 			if (err) {
	// 				console.log('There was an error');
	// 				console.log(err);
	// 				return res.status(400).send({ status: 'error', error: 'error' });
	// 			} else {
	// 				var retArr = [];
	// 				console.log(question);
	// 				for (var i = 0; i < question.length; i++) {
	// 					retArr.push({
	// 						id: question[i]._id,
	// 						user: question[i].user,
	// 						title: question[i].title,
	// 						body: question[i].body,
	// 						score: question[i].score,
	// 						view_count: question[i].view_count,
	// 						answer_count: question[i].answer_count,
	// 						timestamp: parseFloat(question[i].timestamp),
	// 						media: question[i].media,
	// 						tags: question[i].tags,
	// 						accepted_answer_id: null
	// 					});
	// 				}
	// 				console.log('records returned' + retArr.length);
	// 				return res.send({ status: 'OK', questions: retArr });
	// 			}
	// 		});
	// } else {
	// 	Question.find().limit(limit).exec(function(err, question) {
	// 		if (err) {
	// 			console.log('There was an error');
	// 			console.log(err);
	// 			return res.status(400).send({ status: 'error', error: 'error' });
	// 		} else {
	// 			var retArr = [];
	// 			console.log(question);
	// 			for (var i = 0; i < question.length; i++) {
	// 				retArr.push({
	// 					id: question[i]._id,
	// 					user: question[i].user,
	// 					title: question[i].title,
	// 					body: question[i].body,
	// 					score: question[i].score,
	// 					view_count: question[i].view_count,
	// 					answer_count: question[i].answer_count,
	// 					timestamp: parseFloat(question[i].timestamp),
	// 					media: question[i].media,
	// 					tags: question[i].tags,
	// 					accepted_answer_id: null
	// 				});
	// 			}
	// 			console.log('records returned' + retArr.length);
	// 			return res.send({ status: 'OK', questions: retArr });
	// 		}
	// 	});
	// }
});

app.listen(3000, () => {
	console.log('Server started...');
});
