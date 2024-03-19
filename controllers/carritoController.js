const {Cart} = require('../models/Carrito');
const { param } = require('../routes/ProductRoutes');
const {jwtDecode} = require("jwt-decode")
const crearCarritoNuevo = async (req, res) => {
    const {authorization} = req.headers
    let userToken;
    if(!authorization){
        return res.status(422).json({
            mensaje: "Se necesita authorization (token)",
            status: "No ok"
        })
    }

    if(authorization) {
        const [type,token] = authorization.split(" ")
        userToken = token
    }
    const userId = jwtDecode(userToken).id
    const carrito = {
        userId: userId,
        items: []
    }
    try {
        const carritoCreado = new Cart (carrito)
    await carritoCreado.save()
    return res.status(200).json({
        mensaje: "Carrito creado con éxito",
        status: "ok",
        data: carritoCreado //se muestra el carrito con su contenido(chaleco listo)
    })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            mensaje: "conectarse con el administrador",
            status: "no ok"
        })
    }
}

//controlador para obtener todos los carritos
const obtenerCarritos = async (req, res) => {
    try {
        const carritos = await Cart.find()
        return res.status(200).json({
            mensaje: "Todos los carritos solicitados",
            status: "ok",
            data: carritos
        })
    } catch (error) {
        
    }
}


//controlador para ver el carrito
const getCarritoId = async (req, res) => {
    const id = req.params.id
    try {
        const carrito = await Cart.findById (id)
        if(!carrito) {
            return res.status(404).json({
                mensaje: "no se encontró carrito según id ingresado",
                status: "no ok"
            })
        }
        return res.status(200).json({
            mensaje: "carrito encontrado",
            status:"ok",
            data: carrito
        })
    } catch (error) {
        console.error(error)
        return res.status (500).json ({
            mensaje: "revisar logs",
            status: "no ok"
        })
    }
}

//controlador para agregar producto al carrito

const agregarProductoCarrito = async (req, res) => {
    const carritoId =req.params.id
    const {productId, quantity} = req.body
    if(!productId||!quantity){
        return res.status(422).json({
            mensaje: "Ingrese productId y quantity",
            status: "no ok"
        })

    }
    try {
        const carritoActualizado = await Cart.findByIdAndUpdate (carritoId,{
            $push:{
                items: {
                    productId, quantity
                }
            }
        }, {
            new: true
        })

        return res.status(201).json(carritoActualizado)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            mensaje: "Algo salió mal, revisar los logs",
            status:"no ok"
        })
    }
  
}

//ruta para adicionar producto al carrito

const cantidadProductoCarrito = async (req, res) => {
    const id =req.params.id
    res.send(`adicionar o sustraer de a un producto al carrito: ${id}`)
}

//ruta para eliminar productos del carrito

const eliminarProductoCarrito = async (req, res) => {
    const carritoId =req.params.id
    const id = req.params.id
    try {
        const carrito = await Cart.findByIdAndDelete (id)
        if(!carrito){
            return res.status(404).json({
                mensaje: "no se logra eliminar, carrito no encontrado",
                status: "no ok"
            })
        }
        return res.status(200).json({
            mensaje: "carrito eliminado",
            status: "ok"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            mensaje: "algo salió mal, revisar logs",
            status: "no ok"
        })
    }
}

module.exports = {
    getCarritoId,
    agregarProductoCarrito,
    cantidadProductoCarrito,
    eliminarProductoCarrito,
    crearCarritoNuevo,
    obtenerCarritos,
}