const { users } = require('../models');

class UserService {
  static async getAll() {
    try {
      let results = await users.findAll({
        attributes: { exclude: ['password'] },
      });
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      let result = await users.findByPk(id);
      if (result) {
        return result;
      }
      return {};
    } catch (error) {
      throw error;
    }
  }

  static async create(newUser) {
    try {
      let result = await users.create(newUser);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(updatedUser, id) {
    try {
      let result = await users.update(updatedUser, { where: { id } });
      if (result[0] === 0) {
        return false;
      }
      return true; // --> [0] ó [1]
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      let result = await users.destroy({ where: { id } });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
