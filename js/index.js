const express = require("express");
const app = express();
const cors = require("cors");
const conn = require("./connection");
const User = require("./user");
const Product = require("./product")
const Order = require("./order")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")
const key = "clave"

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

// usar el where
app.post("/login", async function (req, res) {
    var newAttempt = {
        username: req.body.username,
        password: req.body.password
    }
    var userfound = false
    var passwordfound = false
    var usuarios = 
    await User.findAll({raw: true})
        console.log(newAttempt);
        if(!newAttempt.username.includes("@")){
            usuarios.forEach(user => {
            if(newAttempt.username == user.username){
                userfound = true
                if(newAttempt.password == user.password){
                    passwordfound = true
                    newAttempt.is_admin = user.is_admin
                }
            }
        });
        }else {
            usuarios.forEach(user => {
            if(newAttempt.username == user.email){
                userfound = true
                if(newAttempt.password == user.password){
                    passwordfound = true
                    return
                }
            }
        })
        }
        if(userfound == true && passwordfound==true){
            var token = jwt.sign(
                        {username: newAttempt.username, admin: newAttempt.is_admin}, key, {expiresIn: "5m"}
                    )
                    console.log(token)
                    res.status(200).json(token)
        }else if(userfound==true && passwordfound==false){
            res.status(401).json("wrong password")
        }else{
            res.status(401).json("user not found")
        }
})

// no necesario
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
    .then((productList)=>{
    res.json(productList)
})
});
app.post("/orders", async function (req, res){

    var totalPrice; 
    req.body.products.forEach(product=>{
            totalPrice += product.price
        })
    var newOrder = await Order.create({
        products_description: req.body.products_description,  //hacer parecido al totalprice para agregar varios prodc
        payment_method: req.body.payment_method,
        user_id: req.body.user_id,
        delivery_address: req.body.delivery_address,
        products: req.body.products,
        total: totalPrice
    })
})