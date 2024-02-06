import userModel from "../../models/user.model.js";

export default class Users {
  get = async () => {
    try {
      const users = await userModel.find();
      return users;
    } catch (err) {
      return err;
    }
  };
  getUserById = async (uid) => {
    try {
      const user = await userModel.findOne({ _id: uid });
      return user;
    } catch (err) {
      return err;
    }
  };
  getUserByEmail = async (email) => {
    try {
      const user = await userModel.findOne({ email: email });
      return user;
    } catch (err) {
      return err;
    }
  };
  create = async (userInfo) => {
    try {
      const user = await userModel.create(userInfo);
      return user;
    } catch (err) {
      return err;
    }
  };
  update = async (email, userInfo) => {
    try {
      const updatedUser = await userModel.updateOne({ email: email }, {password: userInfo});
      return updatedUser;
    } catch (err) {
      return err;
    }
  };
}