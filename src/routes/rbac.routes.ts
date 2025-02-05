import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";

import { Permission } from "../entity/Permission";
import { Role } from "../entity/Role";

const rbacRouter = Router()

const permissionRepository = AppDataSource.getRepository(Permission)
const roleRepository = AppDataSource.getRepository(Role)

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

        await permissionRepository.save(permissionBody)

        res.status(201).json(permissionBody)

    } catch (ex){
        res.status(500).json("Erro ao processar solicitação")
    }
})

rbacRouter.get("/listRoles", async (req: Request, res: Response) => {
    try {
        const roles = await roleRepository.find()

        res.status(200).json(roles)
    } catch (ex){
        res.status(500).json("Erro ao processar solicitação")
    }
})

rbacRouter.post("/createOneRole", async (req: Request, res: Response) => {
    try {
        const roleBody = req.body as Role

        if(!roleBody.description){
            res.status(400).json("A descrição é obrigatória!")
            return
        }

        await roleRepository.save(roleBody)

        res.status(201).json(roleBody)

    } catch (ex){
        res.status(500).json("Erro ao processar solicitação")
    }
})

export default rbacRouter