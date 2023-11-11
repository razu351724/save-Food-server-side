const express = require('express');
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q1yeyxk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('safeFood').collection('myitems');
    const itemsCollection = client.db('safeFood').collection('bookitem');

    app.get('/myitems', async (req, res) => {
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

      app.get('/myitems/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
  
        const options = {
          // Include only the `title` and `imdb` fields in the returned document
          projection: { title: 1, price: 1, id: 1, img: 1, name:1 },
        };
  
        const result = await serviceCollection.findOne(query, options);
        res.send(result);
      })

      app.get('/bookitem', async(req, res) => {
        console.log(req.query.email);
        let query = {};
        if(req.query?.email){
          query = {email: req.query.email}
        }
  
        // দুই লাইনের কোড এক লাইন করছি
        const result = await itemsCollection.find(query).toArray();
        res.send(result);
      })

      app.post('/bookitem', async(req, res) => {
          const body= req.body
          console.log(body)
          const result = await itemsCollection.insertOne(body)
          res.send(result)
      })

      app.patch('/bookitem/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const updatedBooking = req.body;
        console.log(updatedBooking);
        const updateDoc = {
          $set: {
            status: updatedBooking.status
          },
        };
        const result = await itemsCollection.updateOne(filter, updateDoc);
        res.send(result);
      })

      app.delete('/bookitem/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await itemsCollection.deleteOne(query);
        res.send(result);
      })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("SAVE Food ITEM STATED")
  })
  
  app.listen(port, () => {
    console.log(`Save Food  is items on port ${port}`)
  })