const mongoose = require('mongoose');

//creating student schema
const StudentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required : true
    },
    phone: {
      type: String,
      required : true
    },
    photo: {
      type: String,
      required : true
    },
    degree:{
      type:String,
      required : true
    }
  });

const Student = new mongoose.model('Student', StudentSchema);
module.exports = Student;