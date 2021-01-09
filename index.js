require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { PROTO_PATH } = require('./config');
const { UserService } = require('./services');

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

// INIT DATABASE
require('./config/db');

// LOAD PACKAGE
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const { userPackage } = grpc.loadPackageDefinition(packageDefinition);

// INIT SERVER
const server = new grpc.Server();

// ADD SERVICE
server.addService(userPackage.User.service, {
  login: UserService.login,
  register: UserService.register
});

// RUN SERVER
server.bindAsync(`0.0.0.0:${process.env.PORT || 1308}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Server start PORT:${process.env.PORT || 1308}`);
  server.start();
});