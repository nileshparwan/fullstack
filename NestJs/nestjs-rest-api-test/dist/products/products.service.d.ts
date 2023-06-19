import { Product } from "./product.model";
export declare class ProductService {
    products: Product[];
    insertProduct(title: string, desc: string, price: number): string;
    fetchAllProduct(): Product[];
    private findProduct;
    getSingleProduct(id: string): {
        id: string;
        title: string;
        description: string;
        price: number;
    };
    updateProduct(id: string, title: string, description: string, price: number): {
        id: string;
        title: string;
        description: string;
        price: number;
    };
    deleteProduct(id: string): void;
}
