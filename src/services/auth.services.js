require('dotenv').config();
const { users } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  static async login(email, password) {
    try {
      let result = await users.findOne({ where: { email } });
      //Comparar la contraseña de la DB -> contraseña que me envía el cliente
      const valid = bcrypt.compareSync(password, result.password);

      result = JSON.parse(JSON.stringify(result));

      if (valid) {
        return {
          valid: true,
          ...result,
        };
      }
      return {
        valid: false,
      };
    } catch (error) {
      throw error;
    }
  }

  static genToken(user) {
    try {
      //SECRET_KEY es una clave secreta que deberemos guardar en las variables de entorno para que solo nosotros podamos firmar nuestros tokens. Es un valor muy importante que no debemos dejar de forma pública
      const token = jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: '2h',
        algorithm: 'HS256',
      });
      return token;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
