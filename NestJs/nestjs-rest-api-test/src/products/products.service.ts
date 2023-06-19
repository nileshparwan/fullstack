import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from "./product.model";

@Injectable() // allows you to connect to other services. 
export class ProductService {
    products: Product[] = [];

    insertProduct(title: string, desc: string, price: number) {
        const id = Math.random().toString();
        const newProduct = new Product(
            id,
            title,
            desc,
            price
        );

        this.products.push(newProduct);
        return id;
    }

    fetchAllProduct(): Product[] {
        return [...this.products];
    }

    private findProduct(id:string): [Product, number] {
        let index = this.products.findIndex(prod => prod.id == id);
        const product = this.products[index];

        if (!product) {
            throw new NotFoundException("Could not find product");
        }

        return [product, index];
    }

    getSingleProduct(id: string) {
        const product = this.products.find(prod => prod.id === id);
        if (!product) {
            throw new NotFoundException("Could not found product");
        }
        return { ...product };
    }

    updateProduct(
        id: string,
        title: string,
        description: string,
        price: number
    ) {
        const [product, index] = this.findProduct(id);
        const updatedProduct = {...product}; 

        if (title){
            updatedProduct.title = title;
        }

        if(description){
            updatedProduct.description = description;
        }

        if(price){
            updatedProduct.price = price;
        }

        this.products[index] = {...product, ...updatedProduct};

        return {...updatedProduct};
    }


    deleteProduct(id:string){
        const [_, index] = this.findProduct(id);
       
        // either 
        this.products.splice(index, 1)

        // or 
        // this.products.filter(product => product.id !== id);
    }
}