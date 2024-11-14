const mongoose = require("mongoose");

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    preco: {
        type: String,
        required: true,
    },
    quantidade: {
        type: Number,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
});

const Produto = mongoose.model("Produto", produtoSchema);

module.exports = Produto;
