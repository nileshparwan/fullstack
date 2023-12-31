import { PrismaService } from "src/prisma/prisma.service";
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from "./dto";
export declare class BookmarkService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getBookmarks(userId: number): Promise<any>;
    getBookmarkById(userId: number, bookmarkId: number): Promise<any>;
    createBookmark(userId: number, dto: CreateBookmarkDto): Promise<any>;
    editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto): Promise<any>;
    deleteBookmarkById(userId: number, bookmarkId: number): Promise<void>;
}
