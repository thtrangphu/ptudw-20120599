// "use strict"; sử dụng strict mode -> môi trường an toàn hơn.
"use strict";
// doc cau hinh all bien mt trong localhost
require("dotenv").config();
//Import thư viện Express,  framework phổ biến trong Node.js
const express = require("express");
const path = require("path"); // Thêm dòng này để định nghĩa biến path
const app = express();
const expressHandlebars = require("express-handlebars");
const { createStarList } = require("./controllers/handlebarsHelper");
const { createPagination } = require("express-handlebars-paginate");
const session = require("express-session");
const redisStore = require("connect-redis").default;
const { createClient } = require("redis");
const redisClient = createClient({
  url: process.env.REDIS_URL,
  // url: "redis://red-chsck6bhp8u4o31fjic0:6379",
});

redisClient.connect().catch(console.error);

// cau hinh public static folder
app.use(express.static(path.join(__dirname + "/public")));

// cau hinh su dung express handlebars
app.engine(
  "hbs",
  expressHandlebars.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layouts",
    runtimeOptions: {
      // cho phep truy xuat den thuoc tinh cua mang mac dinh
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      createStarList,
      createPagination,
    },
  })
);
app.set("view engine", "hbs");

// xây dựng port number
const port = process.env.port || 5000;

// cau hinh doc du lieu post tu body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cau hinh sd session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new redisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 20 * 60 * 1000, //20phut
    },
  })
);

// middleware khoi tao gio hang
app.use(function (req, res, next) {
  let Cart = require("./controllers/cart");
  req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
  res.locals.quantity = req.session.cart.quantity;

  next();
});

// routes
app.use("/", require("./routes/indexRouter"));
app.use("/products", require("./routes/productsRouter"));
app.use((req, res, next) => {
  res.status(404).render("error", { message: "File Not Found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("error", { message: "Internal Server Error" });
});

// khoi dong server
app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
