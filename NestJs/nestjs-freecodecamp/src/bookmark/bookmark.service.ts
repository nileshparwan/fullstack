import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from "./dto";

@Injectable()
export class BookmarkService {

    constructor(private readonly prisma: PrismaService) {

    }

    async getBookmarks(userId: number) {
        let bookmark;

        try {
            bookmark = await this.prisma.bookmark.findMany({
                where: {
                    userId
                }
            })
        } catch (error) {
            throw new HttpException(
                "Something went wrong",
                HttpStatus.NOT_FOUND
            );
        }

        if (!bookmark || userId !== bookmark.userId) {
            throw new HttpException(
                "Could not find bookmark for the provided id",
                HttpStatus.NOT_FOUND
            );
        }

        return bookmark
    }

    async getBookmarkById(userId: number, bookmarkId: number) {
        let bookmark;

        try {
            bookmark = await this.prisma.bookmark.findFirst({
                where: {
                    id: bookmarkId
                }
            })
        } catch (error) {
            throw new HttpException(
                "Something went wrong, could not find bookmark",
                HttpStatus.NOT_FOUND
            );
        }

        if (!bookmark || bookmark.userId !== userId) {
            throw new HttpException(
                "Could not find bookmark for the provided id",
                HttpStatus.NOT_FOUND
            );
        }

        return bookmark;
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        let bookmark;

        try {
            bookmark = await this.prisma.bookmark.create({
                data: {
                    userId,
                    ...dto
                }
            })
        } catch (error) {
            throw new HttpException(
                "Creating bookmark failed, please try again",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return bookmark;
    }

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        let bookmark, updateBookmark;

        try {
            bookmark = await this.prisma.bookmark.findUnique({
                where: {
                    id: bookmarkId
                }
            })
        } catch (error) {
            throw new HttpException(
                "Something went wrong, could not udate bookmark",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        if (!bookmark || bookmark.userId !== userId) {
            throw new HttpException(
                "You are not allowed to edit this bookmark",
                HttpStatus.UNAUTHORIZED
            );
        }

        try {
            updateBookmark = await this.prisma.bookmark.update({
                where: {
                    id: bookmarkId
                },
                data: {
                    ...dto
                }
            })
        } catch (error) {
            throw new HttpException(
                "Something went wrong, could not save bookmark",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return updateBookmark; 
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBookmarkById(userId: number, bookmarkId: number) {
        let bookmark;

        try {
            bookmark = await this.getBookmarkById(userId, bookmarkId);
        } catch (error) {
            throw new HttpException(
                "Something went wrong, could not delete bookmark",
                HttpStatus.NOT_FOUND
            );
        }

        if (!bookmark) {
            throw new HttpException(
                "could not find bookmark for this id",
                HttpStatus.NOT_FOUND
            );
        }

        if (bookmark.userId !== userId) {
            throw new HttpException(
                "You are not allowed to delete this bookmark",
                HttpStatus.UNAUTHORIZED
            );
        }

        try {
            await this.prisma.bookmark.delete({
                where: {
                    id: bookmark.id
                }
            })
        } catch (error) {
            throw new HttpException(
                "Something went wrong, could not remove bookmark",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }


    }

}