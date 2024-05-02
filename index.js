const express = require("express");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pasword = "deoshZiT4IqNK1QQ";
const userName = "tssabbirhosen";
const dbName = "sabbir";
const dbCollection = "products";

const uri = `mongodb+srv://${userName}:${pasword}@cluster0.gzvnczl.mongodb.net`;

const client = new MongoClient(uri);
const database = client.db(dbName);
const collection = database.collection(dbCollection);

client
  .connect()
  .then(() => {
    app.post("/addUser", (req, res) => {
      const user = req.body;
      collection.insertOne(user);
      res.send("susses");
    });
  })
  .catch((err) => {
    console.error("MongoDB connecting to mongoDB :", err);
    process.exit(1);
  });

app.get("/users", (req, res) => {
  client.connect()
    .then(() => {
      const cursor = collection.find();
        cursor.toArray()
        .then(doc => {
          res.send(doc)
        })
    })

})

app.get("/", (req, res) => {
  fs.readFile(__dirname + "/index.html", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

app.delete("/delete", (req,res) => {
  console.log(req.props)
})

app.listen(PORT, () =>
  console.log(`server is running at  http://localhost:${PORT}`)
);
