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

/////////////////////////     SERVER        ///////////////////////////
app.use(express.json());
app.use(cors());
app.listen(3000, () => console.log("server ok.."));


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////                 PRODUCTS                     //////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//crud products // create, list, get by id, delete by id
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
app.get("/products", async function (req, res) {
  var product = Product.findAll({ raw: true }).then((productList) =>
    res.json(productList)
  );
});
app.get("/products/:product_id", function (req, res) {
  Product.findAll({
    raw: true,
    where: { product_id: req.params.product_id },
  }).then((productFound) => {
    console.log(productFound);
    res.send(productFound);
  });
});
app.delete("/products/:product_id", async function (req, res) {
  Product.update({ where: { product_id: req.params.product_id } }).then(
    (eliminados) => {
      if (eliminados > 0) {
        res.status(200, "product deleted");
      } else {
        res.status(404, "product not found");
      }
    }
  );
});

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////                 USERS                     /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//crud users // register, login, list, get by id, delete by id
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
// get userlist not required
app.get("/users", async function (req, res) {
  User.findAll({ raw: true }).then((userList) => {
    res.send(userList);
  });
});
app.get("/users/:id", function (req, res) {
  User.findAll({
    raw: true,
    where: { id: req.params.id },
  }).then((userFound) => {
    console.log(userFound);
    res.send(userFound);
  });
});
app.delete("/users/:id", async function (req, res) {
  User.update({ where: { id: req.params.id } }).then(
    (eliminados) => {
      if (eliminados > 0) {
        res.status(200, "user deleted");
      } else {
        res.status(404, "user not found");
      }
    }
  );
});

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////                 ORDERS                     ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//crud orders // create, list, get by id, delete by id
app.post("/orders", async function (req, res) {
  var productList = await Product.findAll({
    raw: true,
  });
  console.log(productList);
  var totalPrice = 0;
  req.body.products.forEach((orderedProduct) => {
    let selectedProducts = productList.find(
      (product) => product.product_id == orderedProduct.product_id
    );
    console.log(selectedProducts);
    totalPrice += selectedProducts.price * orderedProduct.quantity;
    console.log(totalPrice);
  });

  var newOrder = await Order.create({
    user_id: req.body.user_id,
    payment_method: req.body.payment_method,
    delivery_address: req.body.delivery_address,
    total: totalPrice,
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
app.get("/orders", async function (req, res) {
  var orderList = await Order.findAll({
    raw: true,
  }).then(async (orderListed) => {
    var listOfOrderProducts = await OrderProduct.findAll({ raw: true });
    console.log(listOfOrderProducts);
    orderListed.forEach((order) => {
      order.products = listOfOrderProducts.filter(
        (products) => products.order_id == order.order_id
      );
    });
    console.log(orderListed);
    res.json(orderListed);
  });
});