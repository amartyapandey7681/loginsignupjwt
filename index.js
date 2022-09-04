let express = require("express");
let app = express();
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

let global ={

};

let port = 3000;


app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use((req,res,next)=>{
    console.log("---->1",req.headers.authorization);

    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0]=='jwt'){


        jwt.verify(req.headers.authorization.split(' ')[1] , '123',(err,decode)=>{

            console.log("---->2",decode);

            if(decode.id == global["password"]){

                next();
            }

        })
    }else{

        next();
    }


});

app.post('/signup',(req,res)=>{

    let incomingdata = req.body;

    let name = incomingdata.name;
    let password = bcrypt.hashSync(req.body.password, 8);

    global["name"] = name;
    global["password"]=password;


    res.status(200).send({"global":global});


})

app.post("/login",(req,res)=>{

    let body  = req.body;

    if(body.password == global["password"]){

        global["token"] = jwt.sign({
            id: body.password
          }, "123", {
            expiresIn: 86400
          });

        res.status(200).send({ "logged in":200,"token": global["token"]});
    }

    else{

        res.status(401).send({"wrong password":1});
    }
})



app.get('/',(request,response)=>{

    response.status(200).send({"status":1});
})

app.listen(port,()=>{

    console.log("port 3000");
})