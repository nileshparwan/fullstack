import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ProductService } from './products.service';

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ){}

    @Post()
    addProduct(
        @Body("title") title: string,
        @Body("description") description: string,
        @Body("price") price: number
    ): { id: string } {
        const id = this.productService.insertProduct(title, description, price);
        return {
            id
        }
    }

    @Get()
    getAllProduct(){
        return this.productService.fetchAllProduct();
    }

    @Get(":id")
    getProduct(@Param("id") id:string){
        return this.productService.getSingleProduct(id);
    }

    @Patch(":id")
    updatepProduct(
        @Param("id") id: string,
        @Body("title") title: string,
        @Body("description") description: string,
        @Body("price") price: number
    ) {
        const product = this.productService.updateProduct(id, title, description, price);
        return { ...product };
    }

    @Delete(":id")
    removeProduct(@Param("id") id: string) {
        this.productService.deleteProduct(id);
        return null;
    }

}