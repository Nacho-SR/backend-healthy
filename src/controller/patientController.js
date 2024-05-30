const Patient = require('../models/Patient')
const { messaging } = require('firebase-admin')

const registerPatient = async (req, res) => {
  try {
    const { nombre, edad, sexo, telefono, email, direccion } = req.body
    const existingPatient = await Patient.findByName(nombre)
    if (existingPatient) {
      return res.status(400).json({
        message: 'Patient already exists'
      })
    }

    const newPatient = await Patient.createPatient(nombre, edad, sexo, telefono, email, direccion)

    res.status(201).json({
      message: 'Patient registered successfully',
      patient: newPatient
    })
  } catch {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.getAllPatients()
    res.json({
      patients,
      message: 'success'
    })
  } catch {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

const deletePatient = async (req, res) => {
  const patientNombre = req.params.nombre
  try {
    await Patient.deletePatient(patientNombre)
    res.status(204).send()
  } catch {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

const updatePatient = async (req, res) => {
  const patientNombre = req.params.nombre
  const patientData = req.body
  try {
    const updatePatient = await Patient.updatePatient(patientNombre, patientData)
    res.json({
      updatePatient,
      message: 'success'
    })
  } catch {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

module.exports = {
  registerPatient,
  getAllPatients,
  deletePatient,
  updatePatient
}