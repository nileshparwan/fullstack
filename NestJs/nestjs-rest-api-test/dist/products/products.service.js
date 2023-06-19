"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const product_model_1 = require("./product.model");
let ProductService = exports.ProductService = class ProductService {
    constructor() {
        this.products = [];
    }
    insertProduct(title, desc, price) {
        const id = Math.random().toString();
        const newProduct = new product_model_1.Product(id, title, desc, price);
        this.products.push(newProduct);
        return id;
    }
    fetchAllProduct() {
        return [...this.products];
    }
    findProduct(id) {
        let index = this.products.findIndex(prod => prod.id == id);
        const product = this.products[index];
        if (!product) {
            throw new common_1.NotFoundException("Could not find product");
        }
        return [product, index];
    }
    getSingleProduct(id) {
        const product = this.products.find(prod => prod.id === id);
        if (!product) {
            throw new common_1.NotFoundException("Could not found product");
        }
        return Object.assign({}, product);
    }
    updateProduct(id, title, description, price) {
        const [product, index] = this.findProduct(id);
        const updatedProduct = Object.assign({}, product);
        if (title) {
            updatedProduct.title = title;
        }
        if (description) {
            updatedProduct.description = description;
        }
        if (price) {
            updatedProduct.price = price;
        }
        this.products[index] = Object.assign(Object.assign({}, product), updatedProduct);
        return Object.assign({}, updatedProduct);
    }
    deleteProduct(id) {
        const [_, index] = this.findProduct(id);
        this.products.splice(index, 1);
    }
};
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)()
], ProductService);
//# sourceMappingURL=products.service.js.map