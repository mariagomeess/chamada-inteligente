const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Gerar token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Registro de novo usuário
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verifica se o email já está registrado
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Cria novo usuário
        const user = await User.create({ name, email, password });

        // Resposta com o token JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Login de usuário
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verifica se o usuário existe
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Obter dados do usuário logado
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
