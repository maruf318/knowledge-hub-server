const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ox9wd7x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const bookCollection = client.db("bookDB").collection("books");
    const categoriesCollection = client.db("bookDB").collection("categories");
    const cartCollection = client.db("bookDB").collection("cart");
    app.post("/addbooks", async (req, res) => {
      const newBook = req.body;
      const result = await bookCollection.insertOne(newBook);
      res.send(result);
    });
    app.post("/cart", async (req, res) => {
      const cartBook = req.body;
      const result = await cartCollection.insertOne(cartBook);
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/allbooks", async (req, res) => {
      const result = await bookCollection.find().toArray();
      res.send(result);
    });
    //getting the categories for homepage
    app.get("/categories", async (req, res) => {
      const result = await categoriesCollection.find().toArray();
      res.send(result);
    });
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(query);
      res.send(result);
    });
    app.get("/category/:name", async (req, res) => {
      const name = req.params.name;
      console.log(name);
      // const query = { _id: new ObjectId(id) };
      // const result = await bookCollection.find(query);
      // res.send(result);
      const query = { category: name };

      const cursor = bookCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //getting some data of a certain user
    app.get("/cart", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });
    app.put("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBook = req.body;
      const book = {
        $set: {
          name: updatedBook.name,
          category: updatedBook.category,
          image: updatedBook.image,
          quantity: updatedBook.quantity,
          rating: updatedBook.rating,
          description: updatedBook.description,
          author: updatedBook.author,
        },
      };
      const result = await bookCollection.updateOne(filter, book, options);
      res.send(result);
    });
    app.patch("/borrow/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBook = req.body;
      const book = {
        $set: {
          // name: updatedBook.name,
          // category: updatedBook.category,
          // image: updatedBook.image,
          quantity: updatedBook.quantity,
          // rating: updatedBook.rating,
          // description: updatedBook.description,
          // author: updatedBook.author,
        },
      };
      const result = await bookCollection.updateOne(filter, book, options);
      res.send(result);
    });
    app.patch("/cart/:name", async (req, res) => {
      const name = req.params.name;
      console.log(name);
      const filter = { name: name };
      const options = { upsert: true };
      const updatedBook = req.body;
      console.log(updatedBook);
      const book = {
        $set: {
          // name: updatedBook.name,
          // category: updatedBook.category,
          // image: updatedBook.image,
          quantity: updatedBook.quantity,
          // rating: updatedBook.rating,
          // description: updatedBook.description,
          // author: updatedBook.author,
        },
      };
      const result = await bookCollection.updateOne(filter, book, options);
      res.send(result);
      // console.log(bookcoll);
      // if (bookcoll) {
      //   const updatedQuantity = (parseInt(bookcoll.quantity) || 0) + 1;
      //   const update = {
      //     $set: {
      //       quantity: updatedQuantity,
      //     },
      //   };

      //   const result = await bookCollection.updateOne(filter, update);
      //   res.send(result);
      // }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Library server is running ");
});

app.listen(port, () => {
  console.log(`library server is running on port, ${port}`);
});
