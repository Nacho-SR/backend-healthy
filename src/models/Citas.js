const admin = require('../config/firebase')
const ICita = require('../interfaces/ICita')
const firestore = admin.firestore()

class Citas extends ICita {

  constructor ( pacienteId, doctorId, fecha ) {
    super()
    this.pacienteId = pacienteId
    this.doctorId = doctorId
    this.fecha = fecha
  }

  static async createCita ( pacienteId, doctorId, fecha ) {
    const counterRef = firestore.collection('counters').doc('citas');
    let newId;

    try {
      await firestore.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        if (!counterDoc.exists) {
          throw new Error('Counter document does not exist!');
        }

        const lastId = counterDoc.data().lastId;
        newId = lastId + 1;
        transaction.update(counterRef, { lastId: newId });
      })

      const cita = firestore.collection('citas').doc(newId.toString())
      await cita.set({
        pacienteId,
        doctorId,
        fecha
      })
      return new Citas(pacienteId, doctorId, fecha)
    } catch (error) {
      console.log('Error => ', error)
      throw new Error ('Error creating cita')
    }
  }

  static async isCitaDisponible (pacienteId, doctorId, fecha) {
    try {

      // Verificar citas del doctor
      const citasDoctorEncontradas = await firestore.collection('citas')
        .where('doctorId', '==', doctorId)
        .where('fecha', '==', fecha)
        .get();

      // Verificar citas del paciente
      const citasPacienteEncontradas = await firestore.collection('citas')
        .where('pacienteId', '==', pacienteId)
        .where('fecha', '==', fecha)
        .get();

      const isDoctorAvailable = citasDoctorEncontradas.empty;
      const isPacienteAvailable = citasPacienteEncontradas.empty;

      return isDoctorAvailable && isPacienteAvailable;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  static async getDoctorCitas(doctorId) {
    try {
      const citasSnapshot = await firestore.collection('citas').where('doctorId', '==', doctorId).get();
      const citas = [];
      citasSnapshot.forEach(doc => {
        citas.push({ id: doc.id, ...doc.data() });
      });
      return citas;
    } catch (error) {
      throw error;
    }
  }

  static async getCitasByPaciente(doctorId,pacienteId) {
    try {
      const citasSnapshot = await firestore.collection('citas').where('doctorId', '==', doctorId).where('pacienteId', '==', pacienteId).get();
      const citas = [];
      citasSnapshot.forEach(doc => {
        citas.push({ id: doc.id, ...doc.data() });
      });
      return citas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Citas;
