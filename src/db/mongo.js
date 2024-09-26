const mongoose = require("mongoose")
const reconnectTimeout = 5000;

async function connectdatabase(){
   await mongoose.connect(process.env.MONGO_URL,{
    serverSelectionTimeoutMS: 10000
   }).then((data)=>{
    console.log(`Mongodb is connected with the server :${data.connection.host}`)
    }).catch((err)=>{
        console.log(err)
    })
}
const mongodb = mongoose.connection;
mongodb.on('connecting', () => {
    console.info('Connecting to Mongodb...');
  });
  
  mongodb.on('error', (error) => {
    console.error(`Mongodb connection error: ${error}`);
    mongoose.disconnect();
  });
  
  mongodb.on('connected', () => {
    console.info('Connected to Mongodb!');
  });
  
  mongodb.on('error', (error) => {
    console.error(`Mongodb connection error: ${error}`);
    mongoose.disconnect();
  });
  
  
  mongodb.on('reconnected', () => {
    console.info('Mongomongodb reconnected!');
  });
  
  mongodb.on('disconnected', () => {
    console.error(`Mongomongodb disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`);
    setTimeout(() => connectdatabase(), reconnectTimeout);
  });

  const MongoDB = {
    connect : connectdatabase,
    mongoose : mongodb    
}

module.exports = MongoDB