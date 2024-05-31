const admin = require('../config/firebase')
const ICita = require('../interfaces/ICita')
const firestore = admin.firestore()

class Cita extends ICita {

  static async isCitaDisponible(doctorId, pacienteId, fecha) {
    try {
      const citaFecha = new Date(fecha);
      const citaInicio = new Date(citaFecha.getTime() - 60 * 60 * 1000); // 1 hora antes
      const citaFin = new Date(citaFecha.getTime() + 60 * 60 * 1000); // 1 hora después

      // Verificar citas del doctor
      const citasDoctorSnapshot = await firestore.collection('citas')
        .where('doctorId', '==', doctorId)
        .where('fecha', '>=', citaInicio)
        .where('fecha', '<=', citaFin)
        .get();

      // Verificar citas del paciente
      const citasPacienteSnapshot = await firestore.collection('citas')
        .where('pacienteId', '==', pacienteId)
        .where('fecha', '>=', citaInicio)
        .where('fecha', '<=', citaFin)
        .get();

      const isDoctorAvailable = citasDoctorSnapshot.empty;
      const isPacienteAvailable = citasPacienteSnapshot.empty;

      return isDoctorAvailable && isPacienteAvailable;
    } catch (error) {
      throw error;
    }
  }

  static async createCita(cita) {
    try {
      const isDisponible = await this.isCitaDisponible(cita.doctorId, cita.pacienteId, cita.fecha);
      if (!isDisponible) {
        throw new Error('Ya existe una cita programada en este rango de tiempo.');
      }

      const citaRef = await firestore.collection('citas').add(cita);
      return { id: citaRef.id, ...cita };
    } catch (error) {
      throw error;
    }
  }

  static async getCitas() {
    try {
      const citasSnapshot = await firestore.collection('citas').get();
      const citas = [];
      citasSnapshot.forEach(doc => {
        citas.push({ id: doc.id, ...doc.data() });
      });
      return citas;
    } catch (error) {
      throw error;
    }
  }

  static async getCitasByPaciente(pacienteId) {
    try {
      const citasSnapshot = await firestore.collection('citas').where('pacienteId', '==', pacienteId).get();
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

module.exports = Cita;
