const express = require('express')
const path = require('path')
const app = express()
var exphbs = require("express-handlebars");
require("./db/conn");
const Student = require('./models/Student');
app.use(express.json())
app.use(express.urlencoded({extended:false}))
var multer  = require('multer')
//var upload = multer({ dest: 'uploads/' })


const port  = process.env.PORT || 8000;

const static_path = path.join(__dirname,"../public")
const views_path = path.join(__dirname,"../views")

app.use(express.static(static_path))

app.set("views",views_path)
app.engine('handlebars', exphbs({ defaultLayout: false }));
app.set("view engine","handlebars");

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/filldetails",(req,res)=>{
    res.render("studentdetails");
})

var storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename: (req, file, cb) => {
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
  });
   
  var upload = multer({ storage: storage }).single('file')

//Storing Student information in db
app.post("/students/register",upload,async(req,res)=>{
    try{
          const Student1 = new Student({
            name :req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            photo : req.file.filename,
            degree : req.body.degree
          })
          const result =await Student1.save();
          console.log(result)
          res.status(201).render("result");
       }
       catch(error){
        res.status(400).send(error);
       }
})
//We will get the lis of students and also search field asking for email to search the specific user
app.get("/listofstudents",async(req,res,next)=>{
    try{
        const {page =1,limit=10} = req.query;
       //console.log(req.query)
     let studentresults = await Student.find()
     .limit(limit*1)
     .skip((page-1)*limit);//start index ,=>from that index then we need to print
          
    // res.json({total:studentresults.length,studentresults});
      res.render('search', {
          data: studentresults,
        });
     
         }catch(e){
         res.status(400).send(e);
     }
})

//fetch the details of user with the email
app.post("/singlestudentpage",async(req,res)=>{
    try{
        let email = req.body.email;
        
    let studentresults = await Student.find({email:email});

    res.render("edit",{
        data:studentresults,
    })
  

    }catch(e){
        res.status(400).send(e);
    }
})

//edit name and phone (for example)
app.post('/update',async(req,res)=>{
    var _id = req.body.id;
    try{
     const result = await Student.updateOne({_id},{
       $set : {
           name: req.body.name,
           phone: req.body.phone
       }
     });
     console.log(result);
     res.send("Updated Successfully")
    }catch(e)
    {
     res.status(500).send(e);
    }
  })

app.listen(port,()=>{
    console.log(`server is running at port no ${port}!!`);
})

