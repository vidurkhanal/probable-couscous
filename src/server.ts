import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
require("dotenv").config();
import morgan from 'morgan';
import mongoData, { ITextSchema } from './mongoData';


// SETTING UP APP
const app = express();
const port = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.json())

// ROUTES
app.get('/', (req, res) => {
  res.status(200).json(
   { msg:"hello World"}
  );
});

app.post('/new/channel',(req,res)=>{
  const dbData = req.body
  mongoData.create(dbData,(err:any,data:ITextSchema[])=>{
    if(err){
      res.status(500).send(err)
    }else{
      res.status(201).send(data)
    }
  })
})

app.get('/get/channelList',(req,res)=>{
  mongoData.find((err,data)=>{
    if(err){
      res.status(500).send(err)
    }else{
      let channels =[]
      data.forEach((channelInfo)=>{
      const channelData ={
          id:channelInfo._id,
          name:channelInfo.channelName,
      }
      channels.push(channelData)
      })
      res.status(200).send(channels)
    }
  })
})

app.post('/new/message',(req,res)=>{
  const id = req.query.id
  const reqMessage = req.body
  mongoData.update({_id:id},{$push:{conversation:reqMessage}},(err,data)=>{
    if(err){
      res.status(500).send(err)
    }else{
      res.status(201).send(data)
    }
  })
})

app.get('/get/conversation',(req,res)=>{
  const id = req.query.id
  mongoData.find({_id:id},(err,data)=>{
    if(err){
      res.status(500).send(err)
    }else{
      res.status(201).send(data)
    }
  })
})
// SETTING UP DB AND INITAILIZING APP
mongoose.connect(process.env.MONGO_DB_URI,{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true}).then((conn)=>{
  console.log("DB CONNECTED via. "+conn.connection.host)
}).then(()=>{
  app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
}).catch((err)=>{
  console.log(err.message)
})


