const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `"mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nf3pc.mongodb.net/travel?retryWrites=true&w=majority"`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('travel');
        const collection = database.collection("services");
        app.get('/services', async (req, res) => {
            const cursor = collection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services', async (req, res) => {
            const cursor = collection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await collection.insertOne(service);
            res.json(result);

        });
        //get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await collection.findOne(query);
            res.json(service);
        });
        //delete api 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Runnig travel server currently')
});
app.listen(port, () => {
    console.log('hiting the data ', port);
});