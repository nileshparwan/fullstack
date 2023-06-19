import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";
export declare class BookMarkController {
    private readonly bookmarkservice;
    constructor(bookmarkservice: BookmarkService);
    getBookmarks(userId: number): Promise<any>;
    createBookmark(userId: number, dto: CreateBookmarkDto): Promise<any>;
    getBookmarkById(userId: number, bookmarkId: number): Promise<any>;
    editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto): Promise<any>;
    deleteBookmarkById(userId: number, bookmarkId: number): Promise<void>;
}
