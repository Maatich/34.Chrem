import { fileURLToPath } from 'url';
import path from "path";
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import {Faker, en, es } from "@faker-js/faker";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);


export const customFaker = new Faker({
    //Por Ej. el idioma
    locale: [en],
})

const { commerce, image, database, string, internet, person, phone, datatype, lorem } = customFaker;

const generateProduct = () => {

    return {
        _id: database.mongodbObjectId(),
        title: commerce.productName(),
        price: parseFloat(commerce.price()),
        departament: commerce.department(),
        stock: parseInt(string.numeric(2)),
        image: image.url(),
        code: string.alphanumeric(10),
        description: commerce.productDescription()
    }
}

export const newProducts = () => {
    const productsNumber = Math.ceil(Math.random()*10); // 1 - 10 productos
    let products = [];
    for (let i = 0; i < productsNumber; i++) {
        const product = generateProduct();
        products.push(product);
    }
    return products
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default __dirname;