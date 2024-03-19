
const { verificarEncriptacion } = require('../helpers/verificarEncriptacion');

const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, msg: 'Lista de usuarios', info: users });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });
        }
        res.json({ success: true, msg: 'Usuario encontrado', info: user });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const userEmail = await User.findOne({email: req.body.email})
        if(userEmail){
            throw new Error("Email en uso!")
        }
        const newUser = new User(req.body);
        newUser.encriptarPassword(req.body.password);
        await newUser.save();
        res.json({success: true, message: "Usuario Creado", info: newUser._id, token: newUser.generateToken()})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });
        }
        res.json({ success: true, msg: 'Usuario actualizado', info: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });
        }
        res.json({ success: true, msg: 'Usuario eliminado', info: deletedUser });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

const loginUser = async(req, res) => {
    try {
        console.log("LOGINPASO1")
        const {email, password} = req.body;
        const user = await User.findOne({email}); // buscando email en mongo atlas
        console.log("LOGINPASO2:VERIFICOCORREO")
        if(!user){
            console.log("PASO3:NOENCONTROUSUARIO")
            throw new Error("Usuario no existe!") // no encontro el usuario
        } 

        const validarPassword = verificarEncriptacion(password, user.salt, user.password)
        console.log("PASO4:VERIFICAR CONTRASEÑA")
        if(!validarPassword){
            console.log("PASO5:CONTRASEÑAINVALIDA")
            throw new Error('Email o contraseña incorrecta!')
        }
        console.log("INICIO DE SESIÓN EXITOSA")
        res.json({success: true, msg: "Has iniciado sesion correctamente!", token: user.generateToken()})


    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }
}

//! EXTRAS!!!!!

const getProfile = async(req, res) => {
    try {
        const {id} = req.params;
        const getInfoUser = await User.findById(id).select("-password -salt")

        res.json({success: true, info: getInfoUser })
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const getVerifyUser = async(req, res) => {
    try {
        const {id} = req.auth;
        console.log(id)
        const getInfoUser = await User.findById(id).select("-password -salt")
        console.log(getInfoUser)

        res.json({success: true, msg: `Informacion de: ${getInfoUser.email}`, info: getInfoUser })
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
        
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    getProfile,
    getVerifyUser
};
