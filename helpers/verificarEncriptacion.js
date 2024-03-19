const crypto = require('crypto');

const verificarEncriptacion = (password, salt, passwordDB) => {
    const encriptar = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha-512').toString('hex');
    return encriptar === passwordDB; // true o un false
};

module.exports = {verificarEncriptacion} 