const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Crear la base de datos
const db = admin.firestore()

// Ruta Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const userRef = db.collection('users').doc('email')
        const userDoc = await userRef.get()
        if (!userDoc.exists) {
            return res.status(401).json({
                'status': 'failed',
                'message': 'Invalid email or password'
            })
        }

        const userData = userDoc.data()
        const isPassValid = await bcrypt.compare(password, userData.password)
        if (isPassValid) {
            const token = jwt.sign(
                { email: userData.email },
                'CLAVE SUPER SECRETA',
                { expiresIn: '1h'}
            )

            req.json({
                'status': 'success',
                token
            })
        } else {
            return res.status(401).json({
              'status': 'failed',
              'message': 'Invalid email or password'
            })
        }
    } catch (error) {
        return res.json({
            'status': 'failed',
            'error': error
        })
    }
})

module.exports = router