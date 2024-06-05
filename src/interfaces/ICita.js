class ICita {
  /*
    Crear un nuevo usuario
    @param {string} email -> correo del usuario
    @param {string} password -> password del usuario
    @returns {Promise<User>}
    @throws {error} si hay un error en la creacion
   */
  static async isCitaDisponible(doctorId, pacienteId, fecha) {}
  static async createCita (cita) {}
  static async getCitas() {}
  static async getCitasByPaciente(pacienteId) {}
}

module.exports = ICita