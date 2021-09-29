const { Router } = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users.controller');
const { validateToken } = require('../middlewares/auth.middleware');

const router = Router();

//GET -> obtener todos los registros
router.get('/users', validateToken, getAllUsers);
//GET -> obtener un registro por id
router.get('/users/:id', getUserById);
//POST -> Agregar un registro
router.post('/users', createUser);
//UPDATE -> Actualizar un registro
router.put('/users/:id', updateUser);
//DELETE -> Borrar un registro
router.delete('/users/:id', deleteUser);

//Completar la siguiente ruta
router.get('/users/:id/conversations');

module.exports = router;
