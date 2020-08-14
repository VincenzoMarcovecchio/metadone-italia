var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const requiredString = {
  type: String,
  required: true,
};

const requiredNumber = {
  type: Number,
  required: true,
};

var logEntrySchema = new Schema(
  {
    title: String,
    description: String,
    comments: String,
    latitude: {
      ...requiredNumber,
      min: -90,
      max: 90,
    },
    longitude: { ...requiredNumber, min: -180, max: 180 },
    visitDate: { required: true, type: Date },
    img: { data: Buffer, contentType: String },
  },
  { timestamps: true }
);

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;
