class IPatient {
  /*
    Crear un nuevo usuario
    @param {string} email -> correo del usuario
    @param {string} password -> password del usuario
    @returns {Promise<User>}
    @throws {error} si hay un error en la creacion
   */
  static async createPatient (nombre) {}
  static async findByName (nombre) {}
}

module.exports = IPatient