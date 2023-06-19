import { ProductService } from './products.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    addProduct(title: string, description: string, price: number): {
        id: string;
    };
    getAllProduct(): import("./product.model").Product[];
    getProduct(id: string): {
        id: string;
        title: string;
        description: string;
        price: number;
    };
    updatepProduct(id: string, title: string, description: string, price: number): {
        id: string;
        title: string;
        description: string;
        price: number;
    };
    removeProduct(id: string): any;
}
