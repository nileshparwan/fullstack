"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookmarkService = exports.BookmarkService = class BookmarkService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBookmarks(userId) {
        let bookmark;
        try {
            bookmark = await this.prisma.bookmark.findMany({
                where: {
                    userId
                }
            });
        }
        catch (error) {
            throw new common_1.HttpException("Something went wrong", common_1.HttpStatus.NOT_FOUND);
        }
        if (!bookmark || userId !== bookmark.userId) {
            throw new common_1.HttpException("Could not find bookmark for the provided id", common_1.HttpStatus.NOT_FOUND);
        }
        return bookmark;
    }
    async getBookmarkById(userId, bookmarkId) {
        let bookmark;
        try {
            bookmark = await this.prisma.bookmark.findFirst({
                where: {
                    id: bookmarkId
                }
            });
        }
        catch (error) {
            throw new common_1.HttpException("Something went wrong, could not find bookmark", common_1.HttpStatus.NOT_FOUND);
        }
        if (!bookmark || bookmark.userId !== userId) {
            throw new common_1.HttpException("Could not find bookmark for the provided id", common_1.HttpStatus.NOT_FOUND);
        }
        return bookmark;
    }
    async createBookmark(userId, dto) {
        let bookmark;
        try {
            bookmark = await this.prisma.bookmark.create({
                data: Object.assign({ userId }, dto)
            });
        }
        catch (error) {
            throw new common_1.HttpException("Creating bookmark failed, please try again", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return bookmark;
    }
    async editBookmarkById(userId, bookmarkId, dto) {
        let bookmark, updateBookmark;
        try {
            bookmark = await this.prisma.bookmark.findUnique({
                where: {
                    id: bookmarkId
                }
            });
        }
        catch (error) {
            throw new common_1.HttpException("Something went wrong, could not udate bookmark", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (!bookmark || bookmark.userId !== userId) {
            throw new common_1.HttpException("You are not allowed to edit this bookmark", common_1.HttpStatus.UNAUTHORIZED);
        }
        try {
            updateBookmark = await this.prisma.bookmark.update({
                where: {
                    id: bookmarkId
                },
                data: Object.assign({}, dto)
            });
        }
        catch (error) {
            throw new common_1.HttpException("Something went wrong, could not save bookmark", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return updateBookmark;
    }
    async deleteBookmarkById(userId, bookmarkId) {
        let bookmark;
        try {
            bookmark = await this.getBookmarkById(userId, bookmarkId);
        }
        catch (error) {
            throw new common_1.HttpException("Something went wrong, could not delete bookmark", common_1.HttpStatus.NOT_FOUND);
        }
        if (!bookmark) {
            throw new common_1.HttpException("could not find bookmark for this id", common_1.HttpStatus.NOT_FOUND);
        }
        if (bookmark.userId !== userId) {
            throw new common_1.HttpException("You are not allowed to delete this bookmark", common_1.HttpStatus.UNAUTHORIZED);
        }
        try {
            await this.prisma.bookmark.delete({
                where: {
                    id: bookmark.id
                }
            });
        }
        catch (error) {
            throw new common_1.HttpException("Something went wrong, could not remove bookmark", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], BookmarkService.prototype, "deleteBookmarkById", null);
exports.BookmarkService = BookmarkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookmarkService);
//# sourceMappingURL=bookmark.service.js.map