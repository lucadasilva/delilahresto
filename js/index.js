const express = require("express");
const app = express();
const cors = require("cors");
const conn = require("./connection");
const User = require("./user");
const Product = require("./product")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")

app.use(express.json());
app.use(cors());
app.listen(3000, ()=>console.log("server ok.."));


app.post("/register", async function(req, res){
    var user = await User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        delivery_address: req.body.delivery_address,
        full_name: req.body.full_name,
        phone: req.body.phone
    })
    .then(function(createdUser) {res.send(createdUser)
    console.log(createdUser);
    })
    .catch((error)=>console.error(error))
});
app.post("/login", async function (req, res) {
    var newAttempt = {
        username: req.body.username,
        password: req.body.password
    }
    var usuarios = 
    await User.findAll({raw: true})
    console.log(usuarios);
        console.log(newAttempt);
        if(!newAttempt.username.search("@")){
            usuarios.forEach(user => {
            if(newAttempt.username == user.username){
                if(newAttempt.password == user.password){
                    var token = jwt.sign(
                        {username: user.username, admin: user.id_admin}, key, {expiresIn: "5m"}
                    )
                    console.log(token)
                    res.json(token)
                }else{
                    console.log("contraseña incorrecta");
                    res.send("wrong password")
                }
            }else{
                console.log("usuario incorrecto");
                res.send("user not found")
            }
        });
        }else {
            usuarios.forEach(user => {
            if(newAttempt.email == user.email){
                if(newAttempt.password == user.password){
                    var token = jwt.sign(
                        {username: user.username, admin: user.id_admin}, key, {expiresIn: "5m"}
                    )
                    console.log(token)
                    res.json(token)
                }else{
                    console.log("contraseña incorrecta");
                    res.send("wrong password")
                }
            }else{
                console.log("usuario incorrecto");
                res.send("user not found")
            }
        })
        }
})

app.get("/users", async function (req, res) {
    User.findAll({raw: true})
    .then((respuesta)=>{console.log(respuesta);
    res.send(respuesta)
})
});

app.post("/products", async function(req, res){
    var products = await Product.create({
        name: req.body.name,
        price: req.body.price,
        img_url: req.body.img_url,
        description: req.body.description,
        is_disabled: req.body.is_disabled,
    })
    .then(function(createdUser) {res.send(createdUser)
    console.log(createdUser);
    })
    .catch((error)=>console.error(error))
});

app.get("/menu", async function (req, res) {
    Product.findAll({raw: true})
    .then((respuesta)=>{console.log(respuesta);
    res.send(respuesta)
})
});