const express =require("express");
const app = express();
const port=8080;
const mongoose =require("mongoose");
const method=require("method-override");                                // Form Contains Only two methods(get,post) ,but to make it convertable this package is reuired.
const Expresserror=require("./ExpressUserDefinedError")
const path=require("path");                                             // For Setting Deafult Paths
const ejsmate=require("ejs-mate");
const session = require("express-session");                             // To create seesion id for every user who browses our website (stores some imp inf in temprorary storage {ex:amazon cart})
const flash =require("connect-flash");                                  // To flash The Message Only once.
const passport=require("passport");                                     // Used For Authentication And Authorization.
const LocalStrategy=require("passport-local");                          // Startegy In Passport Used For Authentication. 

app.set("view engine","ejs");                                    // When The Response Is 'Rendered' default path to access.
app.set("views",path.join(__dirname,"/views"));               
app.use(express.static(path.join(__dirname,"/public")));         // Default middleware : for default paths.
app.use(express.urlencoded({extended:true}));                    // Default middleware : for get data sent from the request.
app.use(express.json());
app.use(method('_method'));
app.engine("ejs",ejsmate); 

app.listen(port,(req,res)=>{

    console.log("server Started..");
});

app.get("/",(req,res)=>{

    res.render("./Test/index.ejs");
});

app.post("/test",(req,res)=>{

    res.render("./Test/createTest.ejs");
});

app.get("/addquestions",(req,res)=>{

    res.render("./Test/addquestion.ejs");
});

app.get("/description",(req,res)=>{

    res.render("./Test/description.ejs")
});

app.get("/register",(req,res)=>{

    res.render("./user/register.ejs");
});

app.get("/startTest",(req,res)=>{

    const number=1;
    res.render("./TestStart/index.ejs",{number});
});

app.post("/startTest",(req,res)=>{

     // Parse the number from the form
     console.log(req.body)
     let number = parseInt(req.body.number, 10);

     // If number is NaN (undefined or invalid), start from 1
     if (isNaN(number)) {
         number = 1;  // Default to question 1 if there's an issue with the number
     } else {
         number += 1;  // Increment the number for the next question
     }

     if(number===10){

        res.render("TestStart/testend.ejs", { number });

     }else{

        // Render the template with the new question number
        res.render('TestStart/index.ejs', { number });
     }

});

app.get("/login",(req,res)=>{

    res.render("./user/login.ejs");
});

app.all("*",(req,res,next)=>{

    next(new Expresserror(404,"Page Not Found !!"));
});

app.use((err,req,res,next)=>{                                   // Error Handling MiddleWare.

    let{status=500,message="Something went wrong"}=err;
    res.status(status).send(message);
});



