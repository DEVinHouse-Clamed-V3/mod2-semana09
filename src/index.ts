import dotenv from "dotenv"
dotenv.config()

import "reflect-metadata";
import express, { Request, Response } from "express"
import {AppDataSource} from "./data-source"
import cors from "cors"
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import authenticate from "./middlewares/authenticate";
import rbacRouter from "./routes/rbac.routes";

import passport from "./middlewares/passport";

import session from "express-session";


const app = express()

app.use(cors())
app.use(express.json())

app.use(session({ secret: 'segredo', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

// app.use("/login", authRouter)
// app.use("/users", authenticate, userRouter)
// app.use("/rbac", rbacRouter)

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

app.get('/dashboard', (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
        res.status(401).json('Você não está autenticado');
        return 
    }
    res.status(200).json('Bem-vindo ao dashboard!');
});

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).send('Deslogado com sucesso!');
    });
});

AppDataSource.initialize().then(() => {
    app.listen(3000, () => {
        console.log("O servidor está rodando em http://localhost:3000")
    })
}).catch(error => console.log(error))

