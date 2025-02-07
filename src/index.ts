import dotenv from "dotenv"
dotenv.config()

import "reflect-metadata";
import express, { Request, Response } from "express"
import {AppDataSource} from "./data-source"
import cors from "cors"

import userRouter from "./routes/user.routes";
import rbacRouter from "./routes/rbac.routes";
import authenticate from "./middlewares/authenticate";

import session from "express-session";
import passport from "./config/passport"

const app = express()

app.use(cors())
app.use(express.json())

app.use(session({secret: process.env.SECRET_SESSION as string, resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())

app.post("/login", passport.authenticate('local', {
    successMessage: "Login realizado com sucesso!",
    failureMessage: "Erro ao realizar login"
}), (req: Request, res: Response) => {
    res.status(200).send("Login realizado com sucesso!")
})

app.get("/logout", (req: Request, res: Response) => {
    req.logout(() => {
        res.status(200).send("Deslogado com sucesso!")
    })
})

app.use("/users", authenticate, userRouter)
// app.use("/rbac", authenticate, rbacRouter)

AppDataSource.initialize().then(() => {
    app.listen(3000, () => {
        console.log("O servidor está rodando em http://localhost:3000")
    })
}).catch(error => console.log(error))

