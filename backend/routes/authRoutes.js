const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas públicas
router.post('/register', registerUser);  // Rota para registrar novo usuário
router.post('/login', loginUser);        // Rota para login

// Rota protegida (somente acessível para usuário autenticado)
router.get('/profile', protect, getUserProfile); // Rota para obter perfil de usuário

module.exports = router;
