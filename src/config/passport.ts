import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local"
import bcrypt from "bcrypt"

import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const usersRepository = AppDataSource.getRepository(User);

passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    
    const user = await usersRepository.findOneBy({ email: email });

    if (!user) return done(null, false, { message: "Usuário não encontrado!" })

    const valid = bcrypt.compareSync(password, user.password)

    if (!valid) return done(null, false, { message: "Email e/ou senha inválido!" })

    done(null, user);
}))

passport.serializeUser((user: any, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id: any, done) => {
    const user = await usersRepository.findOneBy({id: id})

    done(null, user);
})

export default passport