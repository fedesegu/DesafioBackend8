import { Router } from "express";
import { manager } from "../DAO/managerFileS/productManager.js";
import { productsManager } from "../DAO/managerDB/productsManagerDB.js";
import { usersManager } from "../DAO/managerDB/usersManagerDB";
import { cartsManager } from "../DAO/managerDB/cartsManagerDB.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts({});
    res.render("home", { response: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realTimeProducts");
  } catch (error) {
    throw new Error(error.message);
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await productsManager.findAll(req.query);
    console.log("products", products);
    res.render("products", { response: products, style: "product" });
  } catch (error) {
    throw new Error(error.message);
  }
});
router.get("/homeuser/:idUser", async (req, res) => {
  const { idUser } = req.params;
  const user = await usersManager.findById(idUser);
  const { first_name, last_name } = user;
  res.render("homeuser", { first_name, last_name });
});

router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.get("/chat/:idUser", async (req, res) => {
  const { idUser } = req.params;
  try {
    const user = await usersManager.findById(idUser);
    const { first_name, last_name } = user;
    res.render("chat", { first_name, last_name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/carts/:idCart", async (req, res) => {
  const { idCart } = req.params;
  try {
    const cart = await cartsManager.findById(idCart);
    if (!cart) {
      return res.status(404).send("Cart not founded");
    }
    const cartProducts = cart.products.map((doc) => doc.toObject());

    console.log(cartProducts);
    res.render("cart", { response: cartProducts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});
router.get("/cart/", async (req, res) => {
  try {
    const cart = await cartsManager.findAll();
    console.log("cart", cart);
    res.render("cart", { response: cart });
  } catch (error) {
    throw new Error(error.message);
  }
});

router.get("/login", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/api/views/products")
    }
  res.render("login")
});


router.get("/signup", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/api/views/products")
  }
  res.render("sign up")
});

router.get("/profile", async (req, res) => {
    res.render("profile")
    });

router.get('/error', async (req, res) => {
      console.log(req);
      let message = req.session.messages[0]
      res.render("error", { message })
     })
      
router.get("/restaurar", async (req, res) => {
     res.render("restaurarPassword")
     });
export default router;






// import { Router } from "express";
// import { ProductManager } from "../dao/managerFileS/productManager.js";
// import { ProductManagerDB } from "../dao/managerDB/productManagerDB.js";
// import { CartManagerDB } from "../dao/managerDB/cartsManagerDB.js";

// const productManagerDB = new ProductManagerDB();
// const cartManagerDB = new CartManagerDB();
// const productManager = new ProductManager();
// const routerViews = Router();

// routerViews.get("/", async (req, res) => {
//   let products = await productManager.getProduct();

//   res.render("home", {
//     products: products,
//   });
// });

// routerViews.get("/realtimeproducts", async (req, res) => {
//   res.render("realTimeProducts");
// });


// routerViews.get("/chat", async (req, res) => {
//   res.render("chat");
// });

// /*
// routerViews.get("/products", async (req, res) => {

//   if (!req.session.user) {

//     return res.redirect("/api/views/login")
    
//   }

//   let products = await productManagerDB.findAll(req.query)

//   let productsDB = products.payload

//   const productsObject = productsDB.map(p => p.toObject());

//   res.render("products", {
//     productsData: productsObject,
//     user: req.session.user
//   });


// });
// */
// routerViews.get("/products", async (req, res) => {

//   if (!req.session.passport) {

//     return res.redirect("/api/views/login")

//   }

//   let products = await productManagerDB.findAll(req.query)

//   let productsDB = products.payload

//   const productsObject = productsDB.map(p => p.toObject());

//   const { name } = req.user


//   res.render("products", {
//     productsData: productsObject,
//     user: { name },
//     style: "product"
//   });


// });

// routerViews.get("/carts/:cartId", async (req, res) => {

//   const { cartId } = req.params

//   let cartById = await cartManagerDB.findCartById(cartId);

//   let cartArray = cartById.products;

//   const cartArrayObject = cartArray.map(doc => doc.toObject());

//   console.log(cartArrayObject);

//   res.render("cart", {
//     cartData: cartArrayObject
//   });

// });



// routerViews.get("/login", async (req, res) => {

//   // console.log(req);

//   if (req.session.user) {

//     return res.redirect("/api/views/products")

//   }

//   res.render("login")

// });


// routerViews.get("/signup", async (req, res) => {

//   if (req.session.user) {

//     return res.redirect("/api/views/products")

//   }

//   res.render("signup")

// });

// routerViews.get("/profile", async (req, res) => {

//   res.render("profile")

// });

// routerViews.get("/restaurarPassword", async (req, res) => {

//   res.render("restaurarPassword")


// });

// routerViews.get('/error', async (req, res) => {

//   //console.log(req);

//  let message = req.session.messages[0]

//   res.render("error", { message })
// })

// export { routerViews };