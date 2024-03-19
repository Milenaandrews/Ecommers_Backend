const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController.js');
const {getAllUsers,getUserById,createUser,updateUser,deleteUser, loginUser, getProfile, getVerifyUser} = require("../controllers/userController.js")

const userRouter = express.Router();

// Rutas para CRUD de usuarios
userRouter.route('/users')
    .get(auth,getAllUsers) // Obtener todos los usuarios
    .post(createUser); // Crear un nuevo usuario

userRouter.route('/users/:id')
    .get(getUserById) // Obtener un usuario por su ID
    .put( updateUser) // Actualizar un usuario por su ID
    .delete( deleteUser) // Eliminar un usuario por su ID
    .get(auth, getProfile)

userRouter.route('/login')
    .post(loginUser)

userRouter.route('/verifyUser')
    .get(auth,getVerifyUser)

module.exports = userRouter;
