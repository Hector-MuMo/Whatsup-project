const AuthService = require('../services/auth.services');

const authenticate = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    if (result.valid) {
      let userObj = {
        id: result.id,
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
      };

      const token = AuthService.genToken(userObj);

      return res.json({
        message: 'Has iniciado sesión',
        token,
      });
    }
    return res.json({
      message: 'Las crendenciales son incorrectas',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
};
