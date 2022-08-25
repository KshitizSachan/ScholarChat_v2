const express=require("express");
const bodyParser=require("body-parser");

const app= express();
app.set('view engine', 'ejs');

app.get("/",function(req,res){
    let today=new Date();
    let day=today.getDay();
    let Day;
    switch(day){
        case 0: 
        Day="Sunday";
        break;

        case 1: 
        Day="Monday";
        break;

        case 2: 
        Day="Tuesday";
        break;

        case 3: 
        Day="Wednesday";
        break;

        case 4: 
        Day="Thursday";
        break;

        case 5: 
        Day="Friday";
        break;

        case 6: 
        Day="Saturday";
        break;
    }
    res.render("list",{key_day:Day})
});


app.listen(3000, function(){
    console.log("Server Running on port 3000");
});




