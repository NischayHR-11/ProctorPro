const mongoose=require("mongoose");
const passportlocalmongoose=require("passport-local-mongoose");


const userschema=new mongoose.Schema({

    email:{
        type:String,
        require
    }
});

userschema.plugin(passportlocalmongoose);          // Automatically Adds Username & password, it automatically Hashing(pbkf2 Hashing Alg) And Salting Is done Through this, and Also USed For Authentication (Where This User Is Present In Data Base Or Not).

const user= mongoose.model("user",userschema);

module.exports=user;