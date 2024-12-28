const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const murojaatSchema = new Schema({
	chatID: {
		type: Number,
		required: true
	},
	full_name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	murojaat: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = model('Murojaat', murojaatSchema);