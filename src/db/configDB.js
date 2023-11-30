import mongoose from "mongoose";



const URI = 'mongodb+srv://federicosegu:Abeyp231@cluster0.gjwkb4d.mongodb.net/DesafioBackend8?retryWrites=true&w=majority';

mongoose.connect(URI)
    .then(() => console.log("conectado a ecommerce"))
    .catch((error) => console.log(error));