import {Request, Response, Router} from "express"
import jwt from "jsonwebtoken"

const authRouter = Router();

authRouter.post("/", async (req: Request, res: Response) => {

    const payload = {
        nome: "Bruno Costa",
        id: 1,
        role: "admin",
        email: "email@email.com",
        turma: "clamed V3"
    }

    const chaveSecretaJwt = process.env.JWT_SECRET ?? ""

    const token = await jwt.sign(payload, chaveSecretaJwt, {expiresIn: '1h'})

    res.status(200).json({token: token})
})

export default authRouter