require('dotenv').config();
const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  //Validar que el token sea valido
  const bearerToken = req.headers.authorization;
  if (bearerToken) {
    const token = bearerToken.split('Bearer ')[1];
    //console.log(token);
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      //console.log(decoded);
      //utilizamos req porque una vez que se valide el token los datos del usuario van a pasar al siguiente middleware que es getAllUsers a través de next(). Si el token es incorrecto no pasa al middleware getAllUsers
      req.user = decoded;
      next();
    } catch (error) {
      next(error.message);
    }
  }
};

module.exports = {
  validateToken,
};
