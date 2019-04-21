const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PostSchema = new Schema({
	id: {
		type: String,
		unique: true
	},
	user: {
		username: String,
		reputation: Number
	},
	title: String,
	body: String,
	score: {
		type: Number,
		default: 0
	},
	view_count: {
		type: Number,
		default: 0
	},
	answer_count: {
		type: Number,
		default: 0
	},
	timestamp: String,
	tags: [ String ],
	media: [ String ],
	accepted_answer_id: String,
	viewed_ips: [ String ],
	viewed_users: [ String ]
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
