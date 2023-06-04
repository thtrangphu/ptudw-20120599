"use strict";
require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.port || 5000;
const expressHandleBars = require("express-handlebars");
const { createStarList } = require("./controllers/handlebarsHelper");
const { createPagination } = require("express-handlebars-paginate");
const redisStore = require("connect-redis").default;
const { createClient } = require("redis");
const session = require("express-session");
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch(console.error);

const passport = require("./controllers/passport");
const flash = require("connect-flash");
//cau hinh public static
app.use(express.static(__dirname + "/public"));

//cau hinh su dung express handle bar
app.engine(
  "hbs",
  expressHandleBars.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      createStarList,
      createPagination,
    },
  })
);
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cau hinh su dung session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new redisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 20 * 60 * 1000, // 20 mins
    },
  })
);
//cau hinh su dung passport
app.use(passport.initialize());
app.use(passport.session());

//cau hinh su dung connect-flash
app.use(flash());

//midleware khoi tao gio hang
app.use((req, res, next) => {
  let Cart = require("./controllers/cart");
  req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
  res.locals.quantity = req.session.cart.quantity;
  res.locals.isLoggedIn = req.isAuthenticated();
  next();
});

//cau hinh route
app.use("/", require("./routes/indexRouter"));
app.use("/products", require("./routes/productsRouter"));
app.use("/users", require("./routes/authRouter"));
app.use("/users", require("./routes/usersRouter"));

//khoi dong web server
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
