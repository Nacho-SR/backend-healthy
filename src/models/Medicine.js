const admin = require('../config/firebase')
const IMedicine = require('../interfaces/IMedicine')
const firestore = admin.firestore()

class Medicine extends IMedicine {

  constructor ( descripcion, existencia, nombre ) {
    super()
    this.descripcion = descripcion
    this.existencia = existencia
    this.nombre = nombre
  }

  static async isMedDisponible(medicine) {
    const medRef = firestore.collection('medicina').doc(medicine)
    try {
      const isDisponible = medRef.existencia > 0
      return isDisponible;
    } catch (error) {
      throw error;
    }
  }

  static async buyCart (userId, carrito) {
    const batch = firestore.batch();
    try {
      // Procesar cada medicina en el carrito
      for (let item of carrito) {
        const medicinaRef = firestore.collection('medicina').doc(item.id)
        const medicinaDoc = await medicinaRef.get()
  
        if (!medicinaDoc.exists) {
          throw new Error(`La medicina con ID ${item.id} no existe`)
        }
  
        const medicinaData = medicinaDoc.data()
        const nuevaExistencia = medicinaData.existencia - item.quantity
  
        if (nuevaExistencia < 0) {
          throw new Error(`No hay suficiente existencia de la medicina con ID ${item.id}`)
        }
  
        // Restar la cantidad comprada de la existencia
        batch.update(medicinaRef, { existencia: nuevaExistencia })
  
        // Agregar la medicina comprada a la colección `misMedicinas`
        const userMedicinaRef = firestore.collection('misMedicinas').doc(userId).collection('medicina').doc(item.id)
        const userMedicinaDoc = await userMedicinaRef.get();

        if (userMedicinaDoc.exists) {
          // Si la medicina ya existe en `misMedicinas`, sumar la cantidad
          const existingData = userMedicinaDoc.data();
          const nuevaCantidad = existingData.quantity + item.quantity;
          batch.update(userMedicinaRef, { quantity: nuevaCantidad });
        } else {
          batch.set(userMedicinaRef, {
            quantity: item.quantity,
            descripcion: item.descripcion,
            nombre: item.nombre,
            datePurchased: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }

      const actualMedicine = await firestore.collection('misMedicinas').doc(userId).get()
  
      // Ejecutar las operaciones en batch
      await batch.commit();
      console.log('Compra procesada exitosamente');
      return actualMedicine
    } catch (error) {
      console.error('Error procesando la compra: ', error);
      throw error;
    }
  }

  static async getMedicines() {
    try{
      const medDocs = await firestore.collection('medicina').get()
      const medicines = []
      medDocs.forEach(doc => {
        medicines.push({ id: doc.id, ...doc.data() });
      })
      return medicines;
    } catch (error) {
      throw error;
    }
  }

  static async getMyMedicines(user) {
    try{
      // console.log(user)
      const medDocs = await firestore.collection('misMedicinas').doc(user).collection('medicina').get()
      const medicines = []
      medDocs.forEach(doc => {
        medicines.push({ id: doc.id, ...doc.data() });
      })
      return medicines;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Medicine;
