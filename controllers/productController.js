const Product = require('../models/Product');
const Carrito = require('../models/Carrito');
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, msg: 'Lista de productos', info: products });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Producto no encontrado' });
        }
        res.json({ success: true, msg: 'Producto encontrado', info: product });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

const createProduct = async (req, res) => {
    console.log("desde crear producto", req.body)
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json({ success: true, msg: 'Producto creado exitosamente', info: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ success: false, msg: 'Producto no encontrado' });
        }
        res.json({ success: true, msg: 'Producto actualizado', info: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, msg: 'Producto no encontrado' });
        }
        res.json({ success: true, msg: 'Producto eliminado', info: deletedProduct });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};
const verCarrito = async (req, res) => {
    try{
        const carrito = await Carrito.find()
        res.json(carrito)
    } catch (error){
        res.status(500).json({ success: false, msg: error.message });
    }
}

const reduceStock = async (req,res) => {
    const productPurchased = req.body.cartItems;

    try {
        productPurchased.map(async(product)=>{
            await Product.findByIdAndUpdate(product._id, {stock:product.stock - product.quantity})
        })
        res.status(201).json({success:true, msg: "se ha reducido el stock de los productos"})
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message})
        
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    reduceStock,
    verCarrito
};
