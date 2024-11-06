const express =require("express");
const app = express();
const port=8080;
const mongoose =require("mongoose");
const method=require("method-override");                                // Form Contains Only two methods(get,post) ,but to make it convertable this package is reuired.
const Expresserror=require("./ExpressUserDefinedError")
const path=require("path");                                             // For Setting Deafult Paths
const ejsmate=require("ejs-mate"); 

app.set("view engine","ejs");                                    // When The Response Is 'Rendered' default path to access.
app.set("views",path.join(__dirname,"/views"));               
app.use(express.static(path.join(__dirname,"/public")));         // Default middleware : for default paths.
app.use(express.urlencoded({extended:true}));                    // Default middleware : for get data sent from the request.
app.use(method('_method'));
app.engine("ejs",ejsmate); 

app.listen(port,(req,res)=>{

    console.log("server Started..");
});

app.get("/",(req,res)=>{

    res.render("./index.ejs");
});

app.post("/test",(req,res)=>{

    res.render("./createTest.ejs");
});

app.all("*",(req,res,next)=>{

    next(new Expresserror(404,"Page Not Found !!"));
});

app.use((err,req,res,next)=>{                                   // Error Handling MiddleWare.

    let{status=500,message="Something went wrong"}=err;
    res.status(status).send(message);
});



