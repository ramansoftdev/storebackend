const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./db/connectDB");
const productRouter = require("./routes/Product")

const app = new express();
const port = process.env.PORT || 3000;
const mongoConnectionString = process.env.MONGO_DB_URI;

app.use(express.json());
app.use(morgan("common"));


app.use('/v1/api/products',productRouter)

app.get("/", (req, res, next) => {
  res.send({msg:"home page"});
});

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(mongoConnectionString);
    app.listen(port, () => {
      console.log("server listening on port " + port);
    });
  } catch (err) {
    console.log("error starting server " + err);
  }
};


start()