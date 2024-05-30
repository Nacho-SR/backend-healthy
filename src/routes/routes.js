const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getAllUsers, deleteUser, updateUser } = require('./../controller/userController')
const { registerPatient, getAllPatients, deletePatient, updatePatient } = require('./../controller/patientController')
const authenticateToken = require('./../auth/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/get-all-users', authenticateToken, getAllUsers)
router.delete('/users/:email', authenticateToken, deleteUser)
router.put('/users/:email', authenticateToken, updateUser)

router.post('/register-patient', registerPatient)
router.get('/get-all-patients', getAllPatients)
router.delete('/patients/:nombre', deletePatient)
router.put('/patients/:nombre', updatePatient)

module.exports = router