const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");


const dbURI = "mongodb://127.0.0.1:27017/Wave"
console.log(dbURI)
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(5000, () => {
    console.log("Backend server is running!");
  }))
  .catch((err) => {
    console.log(err);
  });

//middlewares
app.use(cors({credentials: true, origin: true}))

app.use(cookieParser())
app.use(express.json());


app.use("/api", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});


