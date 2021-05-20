const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/StudentProfile",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('connection is established');
}).catch((err)=>{
    console.log(err)
})