# Vbook Crawler Extensions Workspace Rules

This file defines the project-scoped rules for writing Vbook web crawler extensions in this repository.

## Coding Style & Patterns

- **Language**: All crawler scripts must be written in Javascript (compatible with Vbook engine).
- **Libraries**: Scripts should load `libs.js` using `load('libs.js')` to utilize helper functions (`crawler`, simplified/traditional Chinese converters, etc.).
- **String Conversions**: Chinese text should be converted to Simplified/Traditional format using `.convertT2S()` if required.
- **TOC Formatting**: Chapter titles in the table of contents must be normalized using `.formatTocName()`.
- **Chapter Text cleaning**:
  - Always clean HTML inside `chap.js` using `.cleanHtml()`.
  - Remove the trailing `(本章完)` indicator text using `.replace(/\(本章完\)/g, "")`.

## Pagination Best Practices

- **Chapter Content (`chap.js`)**:
  - If a chapter is split across multiple pages, loop through the pagination links using `.select("div.prenext a")` matching text `下一页` and concatenate all pages.
- **TOC Pages (`page.js`)**:
  - Nếu trang web có cơ chế phân trang mục lục (tùy thuộc vào số chương giới hạn của từng trang web khác nhau, không cố định là 1000 chương), hãy triển khai `page.js` để parse hộp chọn phân trang (ví dụ `#pageSelect`) hoặc các nút chuyển trang mục lục và trả về danh sách các URL của trang mục lục.
