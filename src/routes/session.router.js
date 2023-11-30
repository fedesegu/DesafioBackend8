
import { Router } from "express";
import { usersManager } from "../DAO/managerDB/usersManagerDB.js"
import { hashData, compareData } from "../utils.js";
import passport from "passport";
const router = Router();

router.post("/signup", passport.authenticate("signup", {
      successRedirect: "/api/views/products",
      failureRedirect: "/api/views/error",
    })
  );
  
  router.post( "/login", passport.authenticate("login", {
      successRedirect: "/api/views/products",
      failureRedirect: "/api/views/error",
    })
  );
  
  router.get( "/auth/github", passport.authenticate("github", { scope: ["user:email"] })
  );
  
  router.get("/callback", passport.authenticate("github"), (req, res) => {
    res.redirect('/api/views/products');
  });
  

  router.get("/signout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/api/views/login");
    });
  });
  
  router.post("/restaurar", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await usersManager.findUserByEmail(email);      
      if (!user) {        
        return res.redirect("/api/views/restaurar");
      }
      const hashedPassword = await hashData(password);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: "Password updated" });
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  export default router;

  router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
       const user = req.user
       res.json({ message: user })
  })
    











// import { Router } from "express";
// import { UsersManagerDB } from "../dao/managerDB/usersManagerDB.js"
// import { hashData, compareData, generateToken } from "../utils.js";
// import passport from "passport";

// const routerSessions = Router();
// const usersManagerDB = new UsersManagerDB();





// routerSessions.post("/signup", passport.authenticate("signup"), (req, res) => {

//   return res.redirect("/api/views/products")

// }


// )


// routerSessions.post("/login", passport.authenticate("login", { failureMessage: true, failureRedirect: "/api/views/error" }), (req, res) => {

//   const { name, last_name, email } = req.user

//   const token = generateToken({
//     name,
//     last_name,
//     email
//   });

//   res.cookie("token", token, { maxAge: 60000, httpOnly: true })

//   return res.redirect("/api/sessions/current")


// }
// )



// routerSessions.get("/current", passport.authenticate("current", { session: false }), (req, res) => {

//   const user = req.user
//   res.json({ message: user })

// })



// routerSessions.get("/auth/github", passport.authenticate('github', { scope: ['user:email'] }));



// routerSessions.get("/callback", passport.authenticate('github', {
//   successRedirect: "/api/views/products",
//   failureRedirect: "/api/views/error"
// }),)


// routerSessions.get("/signout", async (req, res) => {

//   req.session.destroy(() => { res.redirect("/api/views/login") })

// });


// routerSessions.post("/restaurarPassword", async (req, res) => {

//   const { email, newPassword } = req.body


//   if (!email || !newPassword) {

//     return res.status(400).json({ message: "Faltan datos requeridos" });

//   }

//   try {
//     const user = await usersManagerDB.findByEmail(email);


//     if (!user) {
//       return res.redirect("/api/views/signup")
//     }

//     const hashedNewPassword = await hashData(newPassword);

//     user.password = hashedNewPassword;

//     await user.save()

//     res.status(200).json({ message: "password update" });




//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }

// });
// export { routerSessions };