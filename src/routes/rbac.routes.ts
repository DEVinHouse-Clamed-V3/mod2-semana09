import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";

import { Permission } from "../entity/Permission";
import { Role } from "../entity/Role";
import { User } from "../entity/User";

const rbacRouter = Router()

const permissionRepository = AppDataSource.getRepository(Permission)
const roleRepository = AppDataSource.getRepository(Role)
const userRepository = AppDataSource.getRepository(User)

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

rbacRouter.get("/listPermissionsByRole", async (req: Request, res: Response) => {
    try {
        const roles = await roleRepository.find({
            relations: ["permissions"]
        })

        res.status(200).json(roles)
    } catch (ex){
        res.status(500).json("Erro ao processar solicitação")
    }
})

rbacRouter.post("/addPermissionToRole", async (req: Request, res: Response) => {
    try {
        const permissionRoleBody = req.body as {
            permissionId: number;
            roleId: number;
        }

        const permission = await permissionRepository
            .findOneBy({id: permissionRoleBody.permissionId})

        if(!permission){
            res.status(400).json("Permissão não existe!")
            return
        }

        const role = await roleRepository.findOne({ 
            where: {
                id: permissionRoleBody.roleId
            },
            relations: ["permissions"]
        })

        if(!role){
            res.status(400).json("Função não existe!")
            return
        }

        if(role.permissions.find(x => x.id == permission.id)){
            res.status(400).json("A role já possui essa permissão!")
            return
        }
        
        role.permissions.push(permission)
        await roleRepository.save(role)

        res.status(200).json(role)

    } catch (ex){
        console.log(ex)
        res.status(500).json("Erro ao processar solicitação")
    }
})

rbacRouter.post("/addRoleToUser", async (req: Request, res: Response) => {
    try {
        const userRoleBody = await req.body as {
            roleId: number;
            userId: number;
        }

        if(!userRoleBody.roleId || !userRoleBody.userId){
            res.status(400).json("O id da role e/ou do usuário são obrigatórios!")
            return
        }

        const role = await roleRepository.findOneBy({id: userRoleBody.roleId})

        if(!role){
            res.status(400).json("Role inválida!")
            return
        }

        const user = await userRepository.findOne({
            where: {
                id: userRoleBody.userId
            },
            relations: ["roles"]
        })

        if(!user){
            res.status(400).json("Usuário não existe!")
            return
        }

        if(user.roles.find(x => x.id == role.id)){
            res.status(400).json("O usuário já possui está role!")
            return
        }

        user.roles.push(role)
        await userRepository.save(user)

        res.status(201).json(user)

    } catch (ex){
        res.status(500).json("Erro ao processar solicitação")
    }
})
export default rbacRouter