import { Request, Response, Router } from "express";
import { Permission } from "../entity/Permission";
import { AppDataSource } from "../data-source";

const rbacRouter = Router()

const permissionRepository = AppDataSource.getRepository(Permission)

rbacRouter.get("/listPermissions", async (req: Request, res: Response) => {
    try {
        const permissions = await permissionRepository.find()

        res.status(200).json(permissions)
    } catch (ex){
        res.status(500).json("Erro ao processar solicitação")
    }
})

rbacRouter.post("/createOnePermission", async (req: Request, res: Response) => {
    try {
        const permissionBody = req.body as Permission

        if(!permissionBody.description){
            res.status(400).json("A descrição é obrigatória!")
            return
        }

        permissionRepository.save(permissionBody)

        res.status(201).json(permissionBody)

    } catch (ex){
        res.status(500).json("Erro ao processar solicitação")
    }
})

export default rbacRouter