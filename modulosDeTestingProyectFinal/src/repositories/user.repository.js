export default class SessionRepository {
    constructor(dao) {
      this.dao = dao;
    }
    findUser = async (email) => {
      try {
        const data = await this.dao.getUserByEmail(email);
        return data;
      } catch (err) {
        return err;
      }
    };
    findUserById = async (uid) => {
      try {
        const data = await this.dao.getUserById(uid);
        return data;
      } catch (err) {
        return err;
      }
    };
    createUser = async (userInfo) => {
      try {
        const data = await this.dao.create(userInfo);
        return data;
      } catch (err) {
        return err;
      }
    };
    updateUser = async (email, userInfo) => {
      try {
        const data = await this.dao.update(email, userInfo);
        return data;
      } catch (err) {
        return err;
      }
    };
  }