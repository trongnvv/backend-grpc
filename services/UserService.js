const grpc = require('@grpc/grpc-js');
const { UserModel } = require('../models');
const { jwtHandle, bcryptHandle } = require('../utils');

const login = async (call, callback) => {
  try {
    const { username, password } = call.request;
    const user = await UserModel.findOne({ username });
    if (!user) return callback({
      code: grpc.status.UNAUTHENTICATED,
      message: `Account wasn't existed`
    });

    const checkPass = await bcryptHandle.compare(password, user.password);
    if (!checkPass)
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        message: `Password wrong!`
      });

    const accessToken = jwtHandle.sign({
      userID: user._id,
      username: user.username,
    });

    return callback(null, {
      accessToken: 'Bearer ' + accessToken,
      id: user._id,
      username: user.username,
    });
  } catch (error) {
    console.log(error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    })
  }
}

const register = async (call, callback) => {
  try {
    const { username, password, confirmPassword } = call.request;
    if (password !== confirmPassword)
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Confirm password wrong'
      });
    const userExisted = await UserModel.findOne({ username });
    if (userExisted)
      return callback({
        code: grpc.status.ALREADY_EXISTS,
        message: 'Account existed'
      });
    const user = await UserModel.create({
      username,
      password: await bcryptHandle.encrypt(password),
    });

    const accessToken = jwtHandle.sign({
      userID: user._id,
      username
    });

    return callback(null, {
      id: user._id,
      username,
      accessToken: 'Bearer ' + accessToken,
    });

  } catch (error) {
    console.log(error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    })
  }
}

module.exports = {
  login,
  register
}