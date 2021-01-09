require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const { PROTO_PATH } = require('./config');

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const { userPackage } = grpc.loadPackageDefinition(packageDefinition);

const client = new userPackage.User(`localhost:${process.env.PORT || 1308}`, grpc.credentials.createInsecure());

client.register({ username: "trongnv", password: "pass", confirmPassword: "pass" }, function (err, response) {
  console.log(err);
  console.log('User:', response);
});