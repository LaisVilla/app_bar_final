const mongoose = require("mongoose");

const produtoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    preco: { type: String, required: true },
    quantidade: { type: Number, required: true },
});

const compraSchema = new mongoose.Schema({
    produtos: [produtoSchema],
    total: { type: Number, required: true },
});

const Compra = mongoose.model("Compra", compraSchema);

module.exports = Compra;
