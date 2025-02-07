import { NextFunction, Request, Response } from "express";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    if(!req.isAuthenticated()){
        res.status(401).json("Você não está autenticado!")
        return
    }

    next()
}

export default authenticate