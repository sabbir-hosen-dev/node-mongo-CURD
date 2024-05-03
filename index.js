const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
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


  app.patch("/update",(req,res) => {
    console.log(req.body)
    client.connect()
      .then(() => {
        collection.updateOne({_id : new ObjectId(req.body.id)},
        { $set: {name: req.body.name, class: req.body.clas, gpa:req.body.gpa}}, 
      )
      .then(res => {
        console.log(res)
      })
      .catch(err => console.log(err))
      })
  })

  app.get("/user/:id",(req,res) => {
    const userId = req.params
    client.connect()
    .then(() => {
      collection.find({_id : new ObjectId(userId)})
      .toArray()
      .then(doc => {
        res.send(doc[0])
      })
    })
  })

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

app.delete("/delete/:id", (req, res) => {
  // Connect to MongoDB and perform delete operation
  client.connect()
      .then(() => {

          // Perform delete operation
          return collection.deleteOne({ _id: new ObjectId(req.params.id) });
      })
      .then(result => {
          console.log("Deleted document:", result);
          res.status(200).send("Document deleted successfully");
      })
      .catch(error => {
          console.error("Error deleting document:", error);
          res.status(500).send("Error deleting document");
      });
});

app.get("/", (req, res) => {
  fs.readFile(__dirname + "/index.html", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});


app.listen(PORT, () =>
  console.log(`server is running at  http://localhost:${PORT}`)
);
