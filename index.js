const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://assignment-11:vDXhGIezrgow9pVB@cluster0.faszq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json())

async function run() {
    try {
        await client.connect();
        const database = client.db("fitmeal");
        const foodCollection = database.collection("food");
        const orderCollection = database.collection("orders");

        // get data for home----------------------------------------
        app.get("/foods", async (req, res) => {
            const cursor = foodCollection.find({});
            const result = await cursor.toArray()
            res.send(result)
        })
        // post data for  home -------------------------------------------
        app.post('/foods', async (req, res) => {
            const food = req.body;
            console.log(food);
            const result = await foodCollection.insertOne(food)
            res.json(result)
        })
        // post data ----------------------------------------------------------
        app.post("/orders", async (req, res) => {
            const food = req.body;
            const result = await orderCollection.insertOne(food)
            console.log(food);
            res.json(result)
        })
        // get data by email 
        app.get("/orders/:email", async (req, res) => {
            const emails = req.params.email;
            const query = { email: { $regex: emails } }
            const result = await orderCollection.find(query).toArray();
            res.json(result)
        })
        // get orders----------------------------------------------
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })
        // get a single data ----------------------------------------
        app.get("/foods/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.findOne(query);
            res.json(result)
            console.log(result);
        })
        // delete data -------------------------------------------
        app.delete("/foods/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.deleteOne(query);
            res.json(result)
        })
        // delete my order--------------------------------
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
            console.log(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("the server is runing")
})
app.listen(port, () => {
    console.log("the server is runig with locahost 5000", port);
})