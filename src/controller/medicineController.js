const Medicine = require('../models/Medicine')
const { messaging } = require('firebase-admin')

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.getMedicines()
    res.json({
      medicines,
      message: 'success'
    })
  } catch {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

const comprarCarrito = async (req, res) => {
  const { userId, carrito } = req.body;

  try {
    const compra = await Medicine.buyCart(userId, carrito)
    res.status(201).json({
      message: 'Compra procesada exitosamente.',
      myMedicine: compra
    })
  } catch (error) {
    res.status(500).send({ message: 'Error procesando la compra', error: error.message });
  }
}

const getMyMedicines = async (req, res) => {
  const { doctorId } = req.body;
  try {
    const medicinas = await Medicine.getMyMedicines(doctorId)
    res.status(201).json({
      message: 'Medicina obtenida exitosamente.',
      myMedicine: medicinas
    })
  } catch (error) {
    res.status(500).send({ message: 'Error obteniendo la medicina', error: error.message });
  }
}

module.exports = {
  getAllMedicines,
  comprarCarrito,
  getMyMedicines
}