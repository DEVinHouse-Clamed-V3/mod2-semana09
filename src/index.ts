import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express"
import {AppDataSource} from "./data-source"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

AppDataSource.initialize().then(() => {
    app.listen(3000, () => {
        console.log("O servidor está rodando em http://localhost:3000")
    })
}).catch(error => console.log(error))

