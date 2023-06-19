import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from "src/auth/guard";
import { GetUser } from "src/auth/decorator";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";

@UseGuards(JwtGuard)
@Controller("bookmarks")
export class BookMarkController {

    constructor(private readonly bookmarkservice: BookmarkService) { }

    @Get()
    getBookmarks(@GetUser("id") userId: number) {
        return this.bookmarkservice.getBookmarks(userId)
    }

    @Post()
    createBookmark(
        @GetUser("id") userId: number,
        @Body() dto: CreateBookmarkDto
    ) {
        return this.bookmarkservice.createBookmark(userId, dto)
    }

    @Get(":id")
    getBookmarkById(
        @GetUser("id") userId: number,
        @Param("id", ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmarkservice.getBookmarkById(userId, bookmarkId)
    }

    @Patch()
    editBookmarkById(
        @GetUser("id") userId: number,
        @Param("id") bookmarkId: number,
        dto: EditBookmarkDto
    ) {
        return this.bookmarkservice.editBookmarkById(userId, bookmarkId, dto)
    }

    @Delete()
    deleteBookmarkById(
        @GetUser("id") userId: number,
        @Param('id', ParseIntPipe) bookmarkId:number
    ) {
        return this.bookmarkservice.deleteBookmarkById(userId, bookmarkId)
    }
}