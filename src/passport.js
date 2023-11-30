
import passport from "passport";
import { usersManager } from "../src/DAO/managerDB/usersManagerDB.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { hashData, compareData } from "./utils.js";
import { usersModel } from "../src/db/models/users.model.js";



passport.use(
    "signup",
    new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            const { first_name, last_name } = req.body;
            if (!first_name || !last_name || !email || !password) {
                return done(null, false);
            }
            try {
                let isAdmin
                if (email === "adminCoder@coder.com") {
                    isAdmin = true
                } else {
                    isAdmin = false
                }
                const hashedPassword = await hashData(password);
                const createdUser = await usersManager.createUser({
                    ...req.body,
                    password: hashedPassword, isAdmin
                });
                done(null, createdUser);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "login",
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            if (!email || !password) {
                done(null, false);
            }
            try {
                const user = await usersManager.findUserByEmail(email);
                if (!user) {
                    done(null, false);
                }
                const isPasswordValid = await compareData(password, user.password);
                if (!isPasswordValid) {
                    return done(null, false);
                }
                done(null, user);
                console.log(user)
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "github",
    new GithubStrategy(
        {
            clientID: "Iv1.f644c6a8ca45697d",
            clientSecret: "b1bd9e7bd6a2dce7093e372efa128a90d1274066",
            callbackURL: "http://localhost:8080/api/sessions/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const userDB = await usersManager.findUserByEmail(profile._json.email);
                if (userDB) {
                    if (userDB.isGithub) {
                        return done(null, userDB);
                    } else {
                        return done(null, false);
                    }
                }
                const infoUser = {
                    first_name: profile._json.name.split(" ")[0], 
                    last_name: profile._json.name.split(" ")[1],
                    email: profile._json.email,
                    password: " ",
                    isGithub: true,
                };
                const createdUser = await usersManager.createUser(infoUser);
                done(null, createdUser);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersManager.findUserByID(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
passport.use("current", new JWTStrategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
        secretOrKey: SECRETJWT,
    },
    (jwt_payload, done) => {
        done(null, jwt_payload)
    }
))












// import passport from "passport";
// import { UsersManagerDB } from "./dao/managerDB/usersManagerDB.js"
// import { Strategy as LocalStrategy } from "passport-local";
// import { Strategy as GitHubStrategy } from "passport-github2";
// import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
// import { hashData, compareData } from "./utils.js";


// const usersManagerDB = new UsersManagerDB();
// const SECRETJWT = "jwtsecret";

// passport.use("signup", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, email, password, done) => {

//     const { name, last_name } = req.body

//     if (!email || !password || !name || !last_name) {

//         return done(null, false, { message: "All fields are required" })

//     }

//     try {

//         const hashedPassword = await hashData(password);

//         const createUser = await usersManagerDB.createOne({ ...req.body, password: hashedPassword });

//         done(null, createUser)


//     } catch (error) {
//         done(error)
//     }
// }))


// passport.use("login", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
//     if (!email || !password) {

//         return done(null, false, { message: "All fields are required" })

//     }

//     try {
//         const user = await usersManagerDB.findByEmail(email);

//         if (!user) {
//             return done(null, false, { message: "Incorrect email or password" })
//         }


//         const passwordValdHash = await compareData(password, user.password);

//         if (!passwordValdHash) {

//             return done(null, false, { message: "Incorrect email or password" })

//         }
       
//         done(null, user)

//     } catch (error) {
//         done(error)
//     }
// }))



// //NUEVO JWT

// const fromCookies = (req) => {

//     if (!req.cookies.token) {

//         return console.log("ERROR");

//     }

//     return req.cookies.token

// }


// passport.use("current", new JWTStrategy(


//     {

//         jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
//         secretOrKey: SECRETJWT,

//     },

//     (jwt_payload, done) => {


//         done(null, jwt_payload)

//     }


// ))



// passport.use("github", new GitHubStrategy({
//     clientID: 'Iv1.15e1a8911be07618',
//     clientSecret: 'bc029f89fd4e4db369b04da8b6d31623b1476e53',
//     callbackURL: "http://localhost:8080/api/sessions/callback",
//     scope: ["user:email"]
// },
//     async (accessToken, refreshToken, profile, done) => {



//         try {

//             const userDB = await usersManagerDB.findByEmail(profile.emails[0].value)

//             //login

//             if (userDB) {
//                 if (userDB.isGithub) {

//                     return done(null, userDB);

//                 } else {

//                     return done(null, false);
//                 }

//             }

//             //signup

//             const infoUser = {

//                 name: profile._json.name.split(' ')[0],

//                 last_name: profile._json.name.split(' ')[1],

//                 email: profile.emails[0].value,

//                 password: " ",

//                 isGithub: true
//             }

//             const createdUser = await usersManagerDB.createOne(infoUser);

//             done(null, createdUser)

//         } catch (error) {

//             done(error)

//         }


//     }
// ));

// passport.serializeUser((user, done) => {
//     done(null, user._id);
// })


// passport.deserializeUser(async (id, done) => {

//     try {

//         const user = await usersManagerDB.findById(id)

//         done(null, user)

//     } catch (error) {

//         done(error)

//     }


// })