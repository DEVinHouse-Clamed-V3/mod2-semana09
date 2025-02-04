import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] ?? ""

        if(!token){
            res.status(401).json("Token inválido!")
            return
        }
        
        const decoded = await jwt.verify(token, process.env.JWT_SECRET ?? "")
        next()
    } catch (ex){
        res.status(401).json("Token inválido!")
    }
}

export default authenticate