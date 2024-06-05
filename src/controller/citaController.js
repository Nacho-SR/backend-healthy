const Citas = require('../models/Citas')
const { messaging } = require('firebase-admin')

const crearCita = async (req, res) => {
  try {
    const { doctorId, pacienteId, fecha } = req.body
    const isDisponible = await Citas.isCitaDisponible(pacienteId, doctorId, fecha)
    if (!isDisponible) {
      return res.status(201).json({
        message: 'Ya existe una cita programada a esa hora.'
      })
    }

    const newCita = await Citas.createCita(pacienteId, doctorId, fecha)

    res.status(201).json({
      message: 'Cita agendada successfully',
      cita: newCita
    })
  } catch {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

const getAllDoctorCitas = async (req, res) => {
  const { doctorId } = req.body
  try {
    const citas = await Citas.getDoctorCitas(doctorId)
    res.json({
      citas,
      message: 'success'
    })
  } catch {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

const getAllPatientCitas = async (req, res) => {
  const doctorId = req.params.doctorId
  const pacienteId = req.params.pacienteId
  try {
    const citas = await Citas.getCitasByPaciente(doctorId,pacienteId)
    res.json({
      citas,
      message: 'success'
    })
  } catch {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

/* const deletePatient = async (req, res) => {
  const patientNombre = req.params.nombre
  try {
    await Patient.deletePatient(patientNombre)
    res.status(204).send()
  } catch {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
} */

module.exports = {
  crearCita,
  getAllDoctorCitas,
  getAllPatientCitas
}