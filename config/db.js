require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI;
mongoose.connect(MONGODB_URI, {
  socketTimeoutMS: 10000,
  keepAlive: true,
  poolSize: 50,
  useNewUrlParser: true,
  autoIndex: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error.');
  console.error(err);
  process.exit();
});

mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB: ok`);
});
