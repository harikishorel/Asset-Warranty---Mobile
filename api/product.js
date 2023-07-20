const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();
// mongoose
//   .connect(process.env.API_KEY)
//   .then(() => {
//     console.log("mongodb connected");
//   })
//   .catch(() => {
//     console.log("failed");
//   });

const newSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  warranty: {
    type: String,
    required: true,
  },
  serialNum: {
    type: String,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  },
});

const product = mongoose.model("product", newSchema);

module.exports = product;
