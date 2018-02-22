import * as mongoose from 'mongoose';
import {config} from './configServer';

let dbURI;

switch (process.env.NODE_ENV) {
    case "test":
        dbURI = config.mongodb.mongoURI.dev;
        break;
    case "production":
        dbURI = config.mongodb.mongoURI.dev;
        break;
    default:
        dbURI = config.mongodb.mongoURI.dev;
}

mongoose.connect(dbURI).then(()=>{
  console.log('MongoDB è connesso');
}).catch( e => {
  console.error(`Errore connessione MongoDB: ${e.message}`);
});

mongoose.connection.on("error", (err) => {
  if (err.message.indexOf("ECONNREFUSED") !== -1) {
      console.error("Error: The server was not able to reach MongoDB.\nMaybe it's not running?");
      process.exit(1);
  } else {
      throw err;
  }
});