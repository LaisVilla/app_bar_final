const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
  data: {
    type: Date,
    required: true,
  },
  numeroDeConvidados: {
    type: Number,
    required: true,
  },
  observacoes: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Reserva", reservaSchema);
