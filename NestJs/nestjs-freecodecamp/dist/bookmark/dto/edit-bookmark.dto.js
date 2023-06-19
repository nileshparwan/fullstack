"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditBookmarkDto = void 0;
const create_bookmark_dto_1 = require("./create-bookmark.dto");
const mapped_types_1 = require("@nestjs/mapped-types");
class EditBookmarkDto extends (0, mapped_types_1.PartialType)(create_bookmark_dto_1.CreateBookmarkDto) {
}
exports.EditBookmarkDto = EditBookmarkDto;
//# sourceMappingURL=edit-bookmark.dto.js.map