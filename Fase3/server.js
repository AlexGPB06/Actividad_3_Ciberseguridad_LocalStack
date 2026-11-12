const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = 'mi_clave_secreta_super_segura';

app.use(express.json());

// 1. Ruta pública (sin protección)
app.get('/', (req, res) => {
    res.send('API funcionando. Ve a /login para obtener tu token.');
});

// 2. Ruta para generar el token (Simulación de Login)
app.post('/login', (req, res) => {
    // Simulamos que el usuario ya se autenticó correctamente
    const user = { id: 1, username: 'admin' };
    
    // Creamos el token que expira en 1 hora
    const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// 3. Middleware para validar el token JWT
function verificarToken(req, res, next) {
    const headerAuth = req.headers['authorization'];
    
    if (!headerAuth) {
        return res.status(403).json({ error: 'Falta el token de autorización' });
    }

    // El formato suele ser "Bearer <token>"
    const token = headerAuth.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }
        req.user = decoded.user;
        next();
    });
}

// 4. Ruta sensible (Protegida con JWT)
app.get('/api/admin', verificarToken, (req, res) => {
    res.json({ mensaje: 'Bienvenido al panel de administración', usuario: req.user });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});