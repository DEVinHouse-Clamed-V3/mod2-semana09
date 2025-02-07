import dotenv from "dotenv"
dotenv.config()

import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20"

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        return done(null, profile)
    }
))

passport.serializeUser((user: any, done) => {
    done(null, user);
})

passport.deserializeUser(async (user: any, done) => {
    done(null, user);
})

export default passport