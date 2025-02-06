import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

const usersRepository = AppDataSource.getRepository(User);

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await usersRepository.findOneBy({ email: email });

    if (!user) return done(null, false, { message: 'Usuário não encontrado' });

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false, { message: 'Senha incorreta' });
        return done(null, user);
    });
}));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
    const user = await usersRepository.findOne({where: {id: id}});
    done(null, user);
});

export default passport;