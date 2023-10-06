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

    const allToysCollection = client.db("Toys-kingDom").collection("All-toys")


    app.get("/",(req,res)=>{
      res.send("server is working")
  })
  app.get("/alltoys",async(req,res)=>{
      const allToys = await allToysCollection.find().toArray()
      res.send(allToys)
  })
  app.get("/alltoys/:id",async(req,res)=>{
    const id = req.params.id;
    const find = {_id:new ObjectId(id)}
    const result =await allToysCollection.findOne(find)
    res.send(result)
})
  
  app.get("/mytoys/:email",async(req,res)=>{
  const getParams = req.params.email;
  console.log(getParams);
    const query = { user_email:getParams};
    const options = {};
    const allToys = await allToysCollection.find(query,options).toArray()
    res.send(allToys)
  })
  
app.get("/filter/:category",async(req,res)=>{
  const category = req.params.category;
  console.log(category);
  const query = { sub_category:category };
  const options = {}
  const cursor = await allToysCollection.find(query, options).toArray();
  res.send(cursor)
})










app.get("/search/:text",async(req,res)=>{
  const serchText = req.params.text;
  const result =await allToysCollection.find({ toy_name: { $regex: serchText , $options: "i" } }).toArray()
  res.send(result)
})








  
  
  app.post("/addtoy",async(req,res)=>{
   const toyData =req.body;
    // console.log(toyData);
    const result = await allToysCollection.insertOne(toyData);
    res.send(result)
  })
  

app.put("/edit/:id",async(req,res)=>{
  const getId = req.params.id;
  const getData = req.body;
  // console.log(getId,getData);
  const filter = { _id: new ObjectId(getId) };
  const options = { upsert: true };
  // toy_name,
  // toy_img,
  // price,
  // sub_category,
  // quantity,
  // seller_name,
  // user_email,
  // user_img,
  // ratting,
  // description
  const updateDoc = {
    $set: {
      toy_name:req.body.toy_name,
      toy_img:req.body.toy_img,
      price:req.body.price,
      sub_category:req.body.sub_category,
      quantity:req.body.quantity,
      seller_name:req.body.seller_name,
      ratting:req.body.ratting,
      description:req.body.description
     
    },
  };
  const result = await allToysCollection.updateOne(filter, updateDoc, options);
 res.send(result)

})







  app.delete("/delete/:id",async(req,res)=>{
  const getId =req.params.id;
  
   const query = { _id:new ObjectId(getId) }
  //  console.log(query);
   const result = await allToysCollection.deleteOne(query);
   res.send(result)
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






app.listen(port,()=>{
    console.log(`this site load on ${port}`);
})