const express = require('express');
const auth = require('../middleware/auth');
const { cantidadProductoCarrito, eliminarProductoCarrito, getCarritoId, agregarProductoCarrito, crearCarritoNuevo, obtenerCarritos } = require('../controllers/carritoController');

const carritoRoute = express.Router();

carritoRoute.route('/carrito')
    .post(crearCarritoNuevo)//ruta para crear carrito
    .get(obtenerCarritos)//ruta para traer todos los carritos y su información

carritoRoute.route('/carrito/:id')
    .post(agregarProductoCarrito)//ruta para agregar producto al carrito
    .patch(cantidadProductoCarrito)//ruta para modificar la ctdad de producto existente al carrito
    .delete(eliminarProductoCarrito)//ruta para eliminar producto existente del carrito
    .get(getCarritoId)//ruta para visualizar productos existentes al carrito




    module.exports = {carritoRoute}