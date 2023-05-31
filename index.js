// "use strict"; sử dụng strict mode -> môi trường an toàn hơn.
"use strict";

//Import thư viện Express,  framework phổ biến trong Node.js
const express = require("express");
const path = require("path"); // Thêm dòng này để định nghĩa biến path
const app = express();
const expressHandlebars = require("express-handlebars");
const { createStarList } = require("./controllers/handlebarsHelper");
const { createPagination } = require("express-handlebars-paginate");
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
