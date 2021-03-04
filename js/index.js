const express = require("express");
const app = express();
const cors = require("cors");
const conn = require("./connection");
const User = require("./user");
const Product = require("./product");
const Order = require("./order");
const OrderProduct = require("./order-product");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const key = "clave";

app.use(express.json());
app.use(cors());
app.listen(3000, () => console.log("server ok.."));

//get patch y delete de las 4 tablas para admin.
app.post("/register", async function (req, res) {
  var user = await User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    delivery_address: req.body.delivery_address,
    full_name: req.body.full_name,
    phone: req.body.phone,
  })
    .then(function (createdUser) {
      res.json(createdUser);
    })
    .catch((error) => console.error(error));
});

app.post("/login", async function (req, res) {
  var newAttempt = {
    username: req.body.username,
    password: req.body.password,
  };
  var userfound = false;
  var passwordfound = false;
  var usuarios = await User.findAll({
    raw: true,
    where: {
      [Op.or]: [
        { username: newAttempt.username },
        { email: newAttempt.username },
      ],
    },
  });
  if (usuarios.length < 1) {
    res.status(401).json("user not found");
  } else {
    if (newAttempt.password == usuarios[0].password) {
      var token = jwt.sign(
        { username: newAttempt.username, admin: newAttempt.is_admin },
        key,
        { expiresIn: "5m" }
      );
      res.status(200).json(token);
    } else {
      res.status(401).json("wrong password");
    }
  }

  /*
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
                    res.status(200).json(token)
        }else if(userfound==true && passwordfound==false){
            res.status(401).json("wrong password")
        }else{
            res.status(401).json("user not found")
        }*/
});

// no necesario
app.get("/users", async function (req, res) {
  User.findAll({ raw: true }).then((userList) => {
    res.send(userList);
  });
});

app.post("/products", async function (req, res) {
  var products = await Product.create({
    name: req.body.name,
    price: req.body.price,
    img_url: req.body.img_url,
    description: req.body.description,
    is_disabled: req.body.is_disabled,
  })
    .then((createdProduct) => {
      res.json(createdProduct);
    })
    .catch((error) => console.error(error));
});

app.get("/menu", async function (req, res) {
  Product.findAll({ raw: true }).then((productList) => {
    res.json(productList);
  });
});

app.post("/orders", async function (req, res) {
  /*var totalPrice; 
    req.body.products.forEach(product=>{
            totalPrice += product.price
        })*/

  var newOrder = await Order.create({
    user_id: req.body.user_id,
    payment_method: req.body.payment_method,
    delivery_address: req.body.delivery_address,
  }).then((createdOrder) => {
    agregarProductosOrden(req.body.products, createdOrder.order_id);
    res.json(createdOrder);
  });

  async function agregarProductosOrden(productos, orderId) {
    await productos.forEach((product) => {
      var orderProducts = OrderProduct.create({
        order_id: orderId,
        product_id: product.product_id,
        quantity: product.quantity,
      });
    });
  }
});

// hacer get de orders
app.get("/orders", async function (req, res) {
  Order.findAll({ raw: true }).then((orderList) => {
    res.json(getOrderProducts(orderList));
  });

  async function getOrderProducts(orderList) {
    var findOrderList = await orderList.forEach((order) => {
      OrderProduct.findAll({
        raw: true,
        where: {
          order_id: order.order_id,
        },
      }).then((orderProductList) => {
        order.products = orderProductList;
        console.log(order);
      });
    });
    console.log(orderList);
    Promise.all([findOrderList]).then(console.log(orderList));
  }
});
// hacer get de orderId
//crud de prod
//crud de users
//crud de orders
