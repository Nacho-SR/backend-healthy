const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

// Inicializar firebase admin SDK
admin.initializeApp({
  credential:admin.credential.cert(serviceAccount)
})

module.exports = admin