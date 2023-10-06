const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.port || 5000 ;

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Toys-Kingdom:aBlvDos75WTOlUch@cluster0.iono61s.mongodb.net/?retryWrites=true&w=majority";

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}


const allToysCollection = client.db("Toys-kingDom").collection("All-toys")






run().catch(console.dir);

app.get("/",(req,res)=>{
    res.send("server is working ")
})
app.get("/alltoys",async(req,res)=>{
    const allToys = await allToysCollection.find().toArray()
    res.send(allToys)
})


app.get("/mytoys/:email",async(req,res)=>{
const getParams = req.params.email;
console.log(getParams);
  const query = { user_email:getParams};
  const options = {};
  const allToys = await allToysCollection.find(query,options).toArray()
  res.send(allToys)
})



app.post("/addtoy",async(req,res)=>{
 const toyData =req.body;
  // console.log(toyData);
  const result = await allToysCollection.insertOne(toyData);
  res.send(result)
})

app.delete("/delete/:id",async(req,res)=>{
const getId =req.params.id;

 const query = { _id:new ObjectId(getId) }
//  console.log(query);
 const result = await allToysCollection.deleteOne(query);
 res.send(result)
})




app.listen(port,()=>{
    console.log(`this site load on ${port}`);
})