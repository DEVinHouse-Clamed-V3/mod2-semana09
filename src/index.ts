import dotenv from "dotenv"
dotenv.config()

import "reflect-metadata";
import express, { Request, Response } from "express"
import {AppDataSource} from "./data-source"
import cors from "cors"

import passport from "./middlewares/passport";

import session from "express-session";


const app = express()

app.use(cors())
app.use(express.json())

app.use(session({ secret: 'segredo', resave: false, saveUninitialized: false }));

// Configuração da sessão
app.use(session({
    secret: "secreto",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware para verificar autenticação
const ensureAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Não autenticado" });
};

// 🔹 Rota para iniciar login com Google
app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// 🔹 Rota de callback do Google
app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.json({ message: "Login com Google bem-sucedido", user: req.user });
    }
);

// 🔹 Rota protegida
app.get("/profile", ensureAuthenticated, (req, res) => {
    res.json({ message: "Perfil do usuário", user: req.user });
});

// 🔹 Logout
app.post("/logout", (req, res, next) => {
    req.logout((err: any) => {
        if (err) return next(err);
        res.json({ message: "Logout realizado" });
    });
});

AppDataSource.initialize().then(() => {
    app.listen(3000, () => {
        console.log("O servidor está rodando em http://localhost:3000")
    })
}).catch(error => console.log(error))

