"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const auth_1 = require("../services/auth");
// Middleware para verificar o token no cookie
function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ error: 'Token não encontrado' });
        return;
    }
    try {
        const decoded = (0, auth_1.verifyToken)(token);
        req.userId = decoded.id;
        req.email = decoded.email;
        next();
    }
    catch (error) {
        res.status(403).json({ error: 'Token inválido' });
    }
}
