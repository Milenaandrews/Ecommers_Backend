const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Nombre no especificado",
        trim: true,
        lowercase: true,
        minLength: 2
    },
    email: {
        type: String,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g],
        required: true
    },
    
    phone:{
        type: Number,
        min:911111111,
        max:999999999
    },
    adress: {
        type: String,
        trim: true,
        required:true
    },
    comune:{
        type: String,
        trim: true,
        required:true
    },

    region:{
        type: String,
        enum: ["Región de Arica y Parinacota", "Región de Tarapacá", "Región de Antofagasta", "Región de Atacama", "Región de Coquimbo", "Región de Valparaíso","Región Metropolitana", "Región de O’Higgins", "Región del Maule", "Región del Ñuble", "Región del Biobío", "Región de La Araucanía", "Región de Los Ríos", "Región de Los Lagos", "Región de Aysén", "Región de Magallanes"],
        default: "Región Metropolitana"

    },

    password: {
        type: String,
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/gm],
        required: true
    },
    salt: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps:true});

userSchema.methods.encriptarPassword = function(password){
    this.salt = crypto.randomBytes(10).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 10, 'sha-512').toString('hex');
};

userSchema.methods.verificarEncriptacion = function(password, salt, passwordDB){
    const encriptar = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha-512').toString('hex');
    return encriptar === passwordDB; // true o un false
};

userSchema.methods.generateToken = function(){
    const payload = {
        id: this._id,
        name: this.name,
        isAdmin: this.isAdmin
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 900 });
    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
