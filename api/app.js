const Web3 = require("xdc3");
const express = require("express");
const product = require("./product");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const multer = require("multer");
const crypto = require("crypto");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const contractAbi =
  require("../app/artifacts/contracts/StockContract.sol/StockContract.json").abi;

const app = express();
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require("path");
const customer = require("./customer");

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: "ap-south-1",
});
const bucketName = process.env.BUCKET_NAME;

// const storage = multer.memoryStorage({
//   bucket: process.env.BUCKET_NAME,
//   Key: function (req, file, cb) {
//     cb(null, "AssetWarranty/" + file.originalname); // use AssetWarranty folder + original filename as the key
//   },
// });
// const upload = multer({ storage: storage }).array("warrantyFile");

app.use(cors({ origin: ["http://192.168.26.219:19000"], credentials: true }));
// app.use(cors({ origin: ["*"], credentials: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://192.168.26.219:19000");
  // res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Credentials", true);

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.header(
    "Access-Control-Allow-Methods",

    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.get("/", cors(), (req, res) => {});

app.get("/", (req, res) => {
  res.send("hi");
});

app.use(
  session({
    secret: "secret@123",
    resave: true,
    saveUninitialized: false,
  })
);

app.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    console.log(email);
    const newCustomer = new customer({ email, password, name, phone });
    await newCustomer.save();
    res.status(201).send("Customer registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const check = await customer.findOne({
      email: email,
      password: password,
    });
    if (check) {
      const token = jwt.sign(
        {
          name: check.name,
          email: check.email,
          password: check.password,
          phone: check.phone,
        },
        "secret@123"
      );
      res.setHeader("Set-Cookie", `customer_sessionId=${token}`);

      res.cookie("customer_sessionId", token, {
        expires: new Date(Date.now() + 600000),
        httponly: false,
        maxAge: 24 * 60 * 60 * 365,
      });

      res.status(201).send(token);
    } else {
      res.json("notexist");
    }
  } catch (e) {
    res.status(500).send("Internal server error");
  }
});

//profile

// app.put("/profile", async (req, res) => {
//   const token = req.headers.authorization; // Assuming the token is sent in the authorization header

//   if (!token) {
//     return res.status(401).json({ error: "Token not provided" });
//   }

//   try {
//     const decodedToken = jwt.verify(token, "secret@123"); // Replace 'your-secret-key' with your actual secret key used for token signing
//     console.log(decodedToken);
//     const { name, phone, email, password } = decodedToken;

//     const updatedProfile = {
//       name: req.body.name,
//       phone: req.body.phone,
//       email: req.body.email,
//       password: req.body.password,
//     };
//     const user = await customer.findOneAndUpdate(
//       { name, phone, email, password },
//       updatedProfile,
//       { new: true }
//     );
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json({ user });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

app.get("/profile", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }
  try {
    const decodedToken = jwt.verify(token, "secret@123");
    const { email, phone } = decodedToken;
    const user = await customer.findOne({ email, phone });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/profile/edit", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }
  try {
    const decodedToken = jwt.verify(token, "secret@123");
    const { email, phone } = decodedToken;

    const user = await customer.findOne({ email, phone });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user fields
    // user.name = req.body.name;
    user.password = req.body.password;
    const updatedUser = await user.save();

    res.send(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//profile end

app.post("/Homescreen/:serialNumber", async (req, res) => {
  const contractAddress = "0x78b60b155D3B5c3b34Cb56e8d084422a922385EE";
  const provider = "http://13.234.98.154:8546";
  const web3 = new Web3(new Web3.providers.HttpProvider(provider));

  const contract = new web3.eth.Contract(contractAbi, contractAddress);
  const serial = req.params.serialNumber;
  contract.methods
    .getProductBySerialNumber(serial)
    .call()
    .then((result) => {
      res.send(result);
      console.log(result);
    })
    .catch((error) => {
      console.error("Error calling getproductBySerialNumber:", error);
      res.status(500).send("Error calling getproductBySerialNumber"); // send an error response back to the frontend
    });
});

app.post("/warrantyView/:warranty", async (req, res) => {
  try {
    const hash = req.params.warranty;
    const fileName = hash.substring(65);
    const fileHash = hash.substring(0, 64);
    // console.log(fileHash);
    // console.log(fileName);

    const params = {
      Bucket: bucketName,
      Prefix: "AssetWarranty/",
    };
    const data = await client.send(new ListObjectsCommand(params));
    // console.log(data);

    const matchingObject = data.Contents.find((object) => {
      const objectKey = object.Key;
      const objectFileName = objectKey.substring(
        objectKey.lastIndexOf("/") + 1
      );
      return objectFileName === fileName;
    });
    // console.log("matchingobject", matchingObject);

    if (!matchingObject) {
      res.status(404).send("Warranty not found");
      return;
    }

    const warrantyParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: matchingObject.Key,
    };

    const fileContents = await client.send(
      new GetObjectCommand(warrantyParams)
    );
    const fileContentsBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      fileContents.Body.on("data", (chunk) => {
        chunks.push(chunk);
      });
      fileContents.Body.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      fileContents.Body.on("error", reject);
    });

    const secondHash = crypto
      .createHash("sha256")
      .update(fileContentsBuffer)
      .digest("hex");

    // console.log(secondHash);

    if (secondHash === fileHash) {
      const url = await getSignedUrl(
        client,
        new GetObjectCommand(warrantyParams),
        { expiresIn: 3600 }
      );

      // console.log(url);

      res.set("Content-Type", "application/pdf");

      res.send(url);
    } else {
      res.status(403).send("File has been changed!!!!");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.post("/Addproduct", async (req, res) => {
  const { productName, model, date, warranty, serialNum, name } = req.body;
  try {
    if (!name) {
      throw new Error("Token is missing");
    }

    const customerName = name;

    const Customer = await customer.findOne({ name: customerName });
    if (!Customer) {
      throw new Error("Customer not found");
    }
    const existingProduct = await product.findOne({
      productName,
      model,
      date,
      warranty,
      serialNum,
      customer: Customer._id,
    });

    if (existingProduct) {
      return res.status(400).json({
        status: 400,
        message: "Product already exists for this customer",
      });
    }
    const newProduct = new product({
      productName,
      model,
      date,
      warranty,
      serialNum,
      customer: Customer._id,
    });

    await newProduct.save();
    res.json({ status: 200, message: "success" });
  } catch (e) {
    console.error(e);
    res.status(500).json("Failed to add product");
  }
});

// app.get("/product", async (req, res) => {
//   const { name } = req.body;

//   // console.log(name);
//   try {
//     if (!name) {
//       throw new Error("Token is missing");
//     }

//     const customerName = name;

//     const Customer = await customer.findOne({ name: customerName });
//     if (!Customer) {
//       throw new Error("Customer not found");
//     }
//     const products = await product.find({ customer: Customer._id });
//     if (!products) {
//       throw new Error("No product found");
//     }
//     res.json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// });

app.get("/products/:name/:phone", async (req, res) => {
  const { name, phone } = req.params;

  try {
    // Find the customer based on name and phone
    const Customer = await customer.findOne({ name, phone });

    if (!Customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Find products associated with the customer
    const products = await product.find({ customer: Customer._id });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

app.listen(4000, () => {
  console.log("port connected");
});
