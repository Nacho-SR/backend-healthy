const admin = require('../config/firebase')
const IPatient = require('../interfaces/IPatient')
const firestore = admin.firestore()

class Patient extends IPatient {
  constructor (nombre, edad, sexo, telefono, email, direccion) {
    super()
    this.nombre = nombre
    this.edad = edad
    this.sexo = sexo
    this.telefono = telefono
    this.email = email
    this.direccion = direccion
  }

  static async createPatient (nombre, edad, sexo, telefono, email, direccion) {
    try {
      const patient = firestore.collection('patients').doc(nombre)
      await patient.set({
        nombre,
        edad,
        sexo,
        telefono,
        email,
        direccion
      })
      return new Patient(nombre, edad, sexo, telefono, email, direccion)
    } catch (error) {
      console.log('Error => ', error)
      throw new Error ('Error creating patient')
    }
  }

  static async findByName (nombre) {
    try {
      const patient = firestore.collection('patients').doc(nombre)
      const patientDoc = await patient.get()
      if (patientDoc.exists) {
        const patientData = patientDoc.data()
        return new Patient(patientData.nombre, patientData.email)
      }
      return null
    } catch (error) {
      console.log('Error => ', error)
      throw new Error ('Error finding patient')
    }
  }

  static async getAllPatients () {
    try {
      const patients = await firestore.collection('patients').get()
      const foundPatients = []

      for (const doc of patients.docs) {
        const patientData = {
          id: doc.id, // Agrega el id del documento
          ...doc.data()
        }

        // Obtener las recetas del paciente
        const consultas = await firestore.collection('patients').doc(doc.id).collection('consultas').get();
        const foundConsultas = [];

        consultas.forEach(consultasDoc => {
          foundConsultas.push({
            id: consultasDoc.id,
            ...consultasDoc.data()
          })
        })

        patientData.consultas = foundConsultas;
        foundPatients.push(patientData);

      }
      return foundPatients
    } catch (error) {
      throw error
    }
  }

  static async deletePatient (patientNombre) {
    try {
      await firestore.collection('patients').doc(patientNombre).delete()
    } catch (error) {
      throw error
    }
  }

  static async updatePatient (patientNombre, patientData) {
    try {
      await firestore.collection('patients').doc(patientNombre).update(patientData)
      const patientUpdated = await firestore.collection('patient').doc(patientNombre).get()
      return {
        patientUpdated: patientUpdated.data()
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = Patient