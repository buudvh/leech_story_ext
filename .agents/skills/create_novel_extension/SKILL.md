---
name: create_novel_extension
description: Quy định danh sách tệp tin, cấu trúc hàm, đầu vào/đầu ra và các cú pháp hỗ trợ khi xây dựng Vbook novel crawler extension.
---

# Vbook Extension Development Specification

Tài liệu này quy định các tệp tin bắt buộc, cấu trúc function, tham số đầu vào/đầu ra và cú pháp API khi phát triển một Vbook extension.

## 1. Cấu Trúc Thư Mục Tiện Ích (Extension Structure)
```
<tên_tiện_ích>/
├── icon.png          # Ảnh đại diện kích thước 144x144 pixels.
├── plugin.json       # Tệp cấu hình metadata và liên kết script.
└── src/
    ├── libs.js       # Bộ thư viện dịch thuật và bộ crawler chung (cần có).
    ├── home.js       # Script trang chủ (khám phá).
    ├── genre.js      # Script danh mục thể loại.
    ├── gen.js        # Script lấy danh sách truyện của thể loại/bảng xếp hạng.
    ├── detail.js     # Script lấy thông tin chi tiết truyện.
    ├── page.js       # Script phân tách các trang mục lục (nếu có phân trang).
    ├── toc.js        # Script lấy danh sách chương trên từng trang mục lục.
    ├── chap.js       # Script lấy nội dung chữ của chương truyện.
    └── search.js     # Script tìm kiếm truyện.
```

### 1.1. Cấu Trúc File plugin.json
Tệp `plugin.json` định nghĩa các thông số cấu hình và khai báo đường dẫn tệp tin script:
```json
{
  "metadata": {
    "name": "<Tên tiện ích mở rộng>",
    "author": "<Tên tác giả>",
    "version": 1,
    "source": "<Địa chỉ trang web nguồn cào truyện>",
    "regexp": "<Biểu thức chính quy khớp với URL chi tiết của truyện>",
    "description": "<Mô tả ngắn gọn về tiện ích>",
    "locale": "<Mã ngôn ngữ nguồn, ví dụ: zh_CN, vi_VN>",
    "language": "javascript",
    "type": "<Thể loại nội dung: comic, novel, hoặc chinese_novel>"
  },
  "script": {
    "home": "home.js",      // Tên file script trang chủ (không bắt buộc)
    "genre": "genre.js",    // Tên file script thể loại (không bắt buộc)
    "detail": "detail.js",  // Tên file script chi tiết truyện (bắt buộc)
    "search": "search.js",  // Tên file script tìm kiếm (không bắt buộc)
    "page": "page.js",      // Tên file script phân trang mục lục (không bắt buộc)
    "toc": "toc.js",        // Tên file script mục lục chương (bắt buộc)
    "chap": "chap.js"       // Tên file script nội dung chương (bắt buộc)
  },
  "config": {
    "BASE_URL": {
      "title": "Config url",
      "mode": "input",
      "format": "text",
      "default": "<Mặc định URL trang web nguồn>"
    },
    "DEFAULT_COVER": {
      "title": "Default cover url",
      "mode": "input",
      "format": "text",
      "default": "<Đường dẫn ảnh bìa mặc định>"
    }
  }
}
```

---

## 2. Đặc Tả Chi Tiết Các Script (Script Specifications)

### 2.1. home.js & genre.js
- **Chức năng**: Khởi tạo danh sách các tab khám phá hoặc danh sách thể loại lọc truyện.
- **Cấu trúc hàm**:
  ```javascript
  function execute() {
      return Response.success([
          { title: "Tên hiển thị", input: "đầu_vào_của_gen.js", script: "gen.js" }
      ]);
  }
  ```
- **Đầu ra**: `Response.success(data)` với `data` là mảng các đối tượng chứa `{ title, input, script }`.

---

### 2.2. gen.js
- **Chức năng**: Lấy danh sách truyện từ các tab home hoặc danh sách thể loại.
- **Cấu trúc hàm**:
  ```javascript
  function execute(url, page) {
      // url: tham số 'input' truyền từ home.js / genre.js
      // page: trang tiếp theo (chuỗi rỗng ở trang 1)
      return Response.success(booksList, nextPageKey);
  }
  ```
- **Đầu ra**: `Response.success(booksList, nextPageKey)`
  - `booksList`: Mảng chứa các đối tượng truyện:
    ```javascript
    {
        name: "Tên truyện",
        link: "URL hoặc path của truyện",
        cover: "URL ảnh bìa truyện",
        description: "Mô tả ngắn hoặc tác giả",
        host: "Domain của trang web" // (Không bắt buộc nếu link đầy đủ)
    }
    ```
  - `nextPageKey`: Khóa của trang tiếp theo (ví dụ: số trang tiếp theo, hoặc link tương đối). Trả về `null` hoặc `""` để dừng load.

---

### 2.3. detail.js
- **Chức năng**: Lấy thông tin chi tiết của truyện.
- **Cấu trúc hàm**:
  ```javascript
  function execute(url) {
      // url: đường dẫn chi tiết của truyện
      return Response.success({
          name: "Tên truyện",
          cover: "URL ảnh bìa",
          author: "Tên tác giả",
          description: "Mô tả truyện",
          ongoing: true, // hoặc false (trạng thái hoàn thành)
          host: "Domain trang nguồn",
          genres: [
              { title: "Tên thể loại", input: "tên_hoặc_link", script: "search.js" }
          ]
      });
  }
  ```
- **Đầu ra**: `Response.success(bookDetailObj)`

---

### 2.4. page.js
- **Chức năng**: Chia nhỏ mục lục thành nhiều trang nếu trang web nguồn có cơ chế phân trang mục lục (không cố định số chương, tùy thuộc vào từng trang web cụ thể).
- **Cấu trúc hàm**:
  ```javascript
  function execute(url) {
      // url: đường dẫn chi tiết của truyện
      return Response.success([urlPage1, urlPage2, ...]);
  }
  ```
- **Đầu ra**: `Response.success(pagesList)` với `pagesList` là mảng các URL trang mục lục (nếu không phân trang, trả về `[url]`).

---

### 2.5. toc.js
- **Chức năng**: Cào danh sách chương trên một trang mục lục cụ thể.
- **Cấu trúc hàm**:
  ```javascript
  function execute(url) {
      // url: đường dẫn trang mục lục (lấy từ mảng trả về của page.js)
      return Response.success([
          { name: "Tên chương", url: "URL chương", host: "Domain trang" }
      ]);
  }
  ```
- **Đầu ra**: `Response.success(chaptersList)` với `chaptersList` là mảng các đối tượng chứa `{ name, url, host }`.

---

### 2.6. chap.js
- **Chức năng**: Tải nội dung chương. Nếu chương bị chia thành nhiều trang con, cần viết vòng lặp `do-while` cào và gộp toàn bộ text trước khi trả về.
- **Cấu trúc hàm**:
  ```javascript
  function execute(url) {
      // url: đường dẫn chương truyện (lấy từ toc.js)
      return Response.success(contentHtmlString);
  }
  ```
- **Đầu ra**: `Response.success(contentHtmlString)` - Chuỗi HTML chứa nội dung văn bản của chương đã được làm sạch qua `.cleanHtml()`.

---

### 2.7. search.js
- **Chức năng**: Tìm kiếm truyện theo từ khóa.
- **Cấu trúc hàm**:
  ```javascript
  function execute(key, page) {
      // key: từ khóa tìm kiếm
      // page: khóa trang tiếp theo (rỗng ở trang 1)
      return Response.success(booksList, nextPageKey);
  }
  ```
- **Đầu ra**: Tương tự như `gen.js`.

---

## 3. Cú Pháp và API Hỗ Trợ (Supported API Syntax)

### 3.1. Http Request (`fetch`)
```javascript
var response = fetch(url, {
    method: "GET", // GET, POST, PUT, DELETE
    headers: { "User-Agent": "xxx" },
    body: {}
});
let status = response.status;
let isSuccess = response.ok;
let doc = response.html();       // Trả về đối tượng Document (Jsoup)
let doc = response.html(charset); 
let text = response.text();       // Trả về String
let json = response.json();       // Trả về JSONObject
```

### 3.2. HTML Parser
```javascript
Html.parse(htmlText);            // Chuyển text sang Document
Html.clean(htmlText, ["div", "p"]); // Loại bỏ toàn bộ thẻ ngoại trừ div, p
```

### 3.3. Document Selector (Cú pháp JSoup)
```javascript
var elms = doc.select("selector"); // Lấy danh sách phần tử
var elm = elms.first();            // Phần tử đầu tiên
var text = elm.text();             // Lấy nội dung chữ
var attr = elm.attr("href");       // Lấy giá trị thuộc tính
elm.select("div").remove();        // Xóa phần tử con
```

### 3.4. Output Response
```javascript
Response.success(data);            // Trả về thành công
Response.success(data, next);      // Trả về thành công kèm token trang tiếp theo
Response.error(message);           // Trả về thông báo lỗi
```

### 3.5. Khác
```javascript
load("libs.js");                   // Nhúng file script khác
Console.log("message");            // Ghi log
sleep(1000);                       // Dừng luồng (milliseconds)
```
