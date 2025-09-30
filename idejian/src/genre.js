function execute() {
    var tags = [
        {
            "data": "namtan",
            "name": "Nam Tần"
        },
        {
            "data": "dothi",
            "name": "Đô Thị"
        },
        {
            "data": "nhiethuyet",
            "name": "Nhiệt Huyết"
        },
        {
            "data": "satphatquadoan",
            "name": "Sát Phạt Quả Đoán"
        },
        {
            "data": "huyenhuyen",
            "name": "Huyền Huyễn"
        },
        {
            "data": "nutan",
            "name": "Nữ Tần"
        },
        {
            "data": "lichsuvocancu",
            "name": "Lịch Sử Vô Căn Cứ"
        },
        {
            "data": "sangvan",
            "name": "Sảng Văn"
        },
        {
            "data": "dothicaothu",
            "name": "Đô Thị Cao Thủ"
        },
        {
            "data": "lichsu",
            "name": "Lịch Sử"
        },
        {
            "data": "giaheoanthitho",
            "name": "Giả Heo Ăn Thịt Hổ"
        },
        {
            "data": "dongphuonghuyenhuyen",
            "name": "Đông Phương Huyền Huyễn"
        },
        {
            "data": "hohoacaothu",
            "name": "Hộ Hoa Cao Thủ"
        },
        {
            "data": "nghichtap",
            "name": "Nghịch Tập"
        },
        {
            "data": "codaingontinh",
            "name": "Cổ Đại Ngôn Tình"
        },
        {
            "data": "vodao",
            "name": "Võ Đạo"
        },
        {
            "data": "thangcapluu",
            "name": "Thăng Cấp Lưu"
        },
        {
            "data": "cuocsongdothi",
            "name": "Cuộc Sống Đô Thị"
        },
        {
            "data": "muuluoc",
            "name": "Mưu Lược"
        },
        {
            "data": "xuyenqua",
            "name": "Xuyên Qua"
        },
        {
            "data": "xaubung",
            "name": "Xấu Bụng"
        },
        {
            "data": "luyencong",
            "name": "Luyện Công"
        },
        {
            "data": "machsuynghithanhky",
            "name": "Mạch Suy Nghĩ Thanh Kỳ"
        },
        {
            "data": "cuonggiatrove",
            "name": "Cường Giả Trở Về"
        },
        {
            "data": "kiemtien",
            "name": "Kiếm Tiền"
        },
        {
            "data": "bacsiluu",
            "name": "Bác Sĩ Lưu"
        },
        {
            "data": "tinhyeu",
            "name": "Tình Yêu"
        },
        {
            "data": "linhdi",
            "name": "Linh Dị"
        },
        {
            "data": "dithedailuc",
            "name": "Dị Thế Đại Lục"
        },
        {
            "data": "trungsinh",
            "name": "Trùng Sinh"
        },
        {
            "data": "tienhiep",
            "name": "Tiên Hiệp"
        },
        {
            "data": "tranhba",
            "name": "Tranh Bá"
        },
        {
            "data": "huyennghiluu",
            "name": "Huyền Nghi Lưu"
        },
        {
            "data": "hiendaiquybi",
            "name": "Hiện Đại Quỷ Bí"
        },
        {
            "data": "tridau",
            "name": "Trí Đấu"
        },
        {
            "data": "ngotsung",
            "name": "Ngọt Sủng"
        },
        {
            "data": "dithuatsieunang",
            "name": "Dị Thuật Siêu Năng"
        },
        {
            "data": "hiendaingontinh",
            "name": "Hiện Đại Ngôn Tình"
        },
        {
            "data": "danhmat",
            "name": "Đánh Mặt"
        },
        {
            "data": "xuyenquathoikhong",
            "name": "Xuyên Qua Thời Không"
        },
        {
            "data": "hiendaituchan",
            "name": "Hiện Đại Tu Chân"
        },
        {
            "data": "thuongngayvan",
            "name": "Thường Ngày Văn"
        },
        {
            "data": "nuthan",
            "name": "Nữ Thần"
        },
        {
            "data": "tienhiepcodien",
            "name": "Tiên Hiệp Cổ Điển"
        },
        {
            "data": "baothu",
            "name": "Báo Thù"
        },
        {
            "data": "thanhthuc",
            "name": "Thành Thục"
        },
        {
            "data": "chitonluu",
            "name": "Chí Tôn Lưu"
        },
        {
            "data": "nhenhom",
            "name": "Nhẹ Nhõm"
        },
        {
            "data": "thamhiem",
            "name": "Thám Hiểm"
        },
        {
            "data": "trochoi",
            "name": "Trò Chơi"
        },
        {
            "data": "thientailuu",
            "name": "Thiên Tài Lưu"
        },
        {
            "data": "vodichluu",
            "name": "Vô Địch Lưu"
        },
        {
            "data": "trithongminhtaituyen",
            "name": "Trí Thông Minh Tại Tuyến"
        },
        {
            "data": "tonggiamdochaomon",
            "name": "Tổng Giám Đốc Hào Môn"
        },
        {
            "data": "quyenmuu",
            "name": "Quyền Mưu"
        },
        {
            "data": "nguoioreluu",
            "name": "Người Ở Rể Lưu"
        },
        {
            "data": "khoahuyen",
            "name": "Khoa Huyễn"
        },
        {
            "data": "soicoquatkhoi",
            "name": "Sợi Cỏ Quật Khởi"
        },
        {
            "data": "binhvuong",
            "name": "Binh Vương"
        },
        {
            "data": "loanthe",
            "name": "Loạn Thế"
        },
        {
            "data": "trieudinhgiangho",
            "name": "Triều Đình Giang Hồ"
        },
        {
            "data": "ydaothanhthu",
            "name": "Y Đạo Thánh Thủ"
        },
        {
            "data": "hethongluu",
            "name": "Hệ Thống Lưu"
        },
        {
            "data": "tonggiamdoc",
            "name": "Tổng Giám Đốc"
        },
        {
            "data": "tinhtao",
            "name": "Tỉnh Táo"
        },
        {
            "data": "kinhdikinhkhung",
            "name": "Kinh Dị Kinh Khủng"
        },
        {
            "data": "cokinh",
            "name": "Cổ Kính"
        },
        {
            "data": "naodonglon",
            "name": "Não Động Lớn"
        },
        {
            "data": "dinang",
            "name": "Dị Năng"
        },
        {
            "data": "trieudinh",
            "name": "Triều Đình"
        },
        {
            "data": "lamruong",
            "name": "Làm Ruộng"
        },
        {
            "data": "cuonggialuu",
            "name": "Cường Giả Lưu"
        },
        {
            "data": "batdauluu",
            "name": "Bắt Đầu Lưu"
        },
        {
            "data": "duhidigioi",
            "name": "Du Hí Dị Giới"
        },
        {
            "data": "luongtongnguyenminh",
            "name": "Lưỡng Tống Nguyên Minh"
        },
        {
            "data": "luyendan",
            "name": "Luyện Đan"
        },
        {
            "data": "laungaysinhtinh",
            "name": "Lâu Ngày Sinh Tình"
        },
        {
            "data": "daonguoc",
            "name": "Đảo Ngược"
        },
        {
            "data": "thegioituonglai",
            "name": "Thế Giới Tương Lai"
        },
        {
            "data": "nhanhtiettau",
            "name": "Nhanh Tiết Tấu"
        },
        {
            "data": "dothitutien",
            "name": "Đô Thị Tu Tiên"
        },
        {
            "data": "nucuong",
            "name": "Nữ Cường"
        },
        {
            "data": "minhtrieu",
            "name": "Minh Triều"
        },
        {
            "data": "vongdu",
            "name": "Võng Du"
        },
        {
            "data": "haomon",
            "name": "Hào Môn"
        },
        {
            "data": "thuongnghiepongtrum",
            "name": "Thương Nghiệp Ông Trùm"
        },
        {
            "data": "dithexuyenqua",
            "name": "Dị Thế Xuyên Qua"
        },
        {
            "data": "giatoc",
            "name": "Gia Tộc"
        },
        {
            "data": "thamtusuyluan",
            "name": "Thám Tử Suy Luận"
        },
        {
            "data": "phandau",
            "name": "Phấn Đấu"
        },
        {
            "data": "kinhdoanh",
            "name": "Kinh Doanh"
        },
        {
            "data": "chienthanluu",
            "name": "Chiến Thần Lưu"
        },
        {
            "data": "tanthenguyco",
            "name": "Tận Thế Nguy Cơ"
        },
        {
            "data": "tucuong",
            "name": "Tự Cường"
        },
        {
            "data": "tanthe",
            "name": "Tận Thế"
        },
        {
            "data": "nutonggiamdoc",
            "name": "Nữ Tổng Giám Đốc"
        },
        {
            "data": "canthan",
            "name": "Cẩn Thận"
        },
        {
            "data": "huyenhoc",
            "name": "Huyền Học"
        },
        {
            "data": "tuhanche",
            "name": "Tự Hạn Chế"
        },
        {
            "data": "caothuxuongnui",
            "name": "Cao Thủ Xuống Núi"
        },
        {
            "data": "kyhuyentuchan",
            "name": "Kỳ Huyễn Tu Chân"
        },
        {
            "data": "niendaivan",
            "name": "Niên Đại Văn"
        },
        {
            "data": "badao",
            "name": "Bá Đạo"
        },
        {
            "data": "cuopquyen",
            "name": "Cướp Quyền"
        },
        {
            "data": "cuimucluu",
            "name": "Củi Mục Lưu"
        },
        {
            "data": "kyhuyen",
            "name": "Kỳ Huyễn"
        },
        {
            "data": "nongthon",
            "name": "Nông Thôn"
        },
        {
            "data": "cungdautrachdau",
            "name": "Cung Đấu Trạch Đấu"
        },
        {
            "data": "tinhyeuvahonnhan",
            "name": "Tình Yêu Và Hôn Nhân"
        },
        {
            "data": "hunghivongdu",
            "name": "Hư Nghĩ Võng Du"
        },
        {
            "data": "cungnguoitacpham",
            "name": "Cùng Người Tác Phẩm"
        },
        {
            "data": "vohiep",
            "name": "Võ Hiệp"
        },
        {
            "data": "dichnu",
            "name": "Đích Nữ"
        },
        {
            "data": "sinhtonkhieuchien",
            "name": "Sinh Tồn Khiêu Chiến"
        },
        {
            "data": "truythe",
            "name": "Truy Thê"
        },
        {
            "data": "chientranh",
            "name": "Chiến Tranh"
        },
        {
            "data": "truongsinh",
            "name": "Trường Sinh"
        },
        {
            "data": "sungthe",
            "name": "Sủng Thê"
        },
        {
            "data": "tanhantamquoc",
            "name": "Tần Hán Tam Quốc"
        },
        {
            "data": "nhieunuchinh",
            "name": "Nhiều Nữ Chính"
        },
        {
            "data": "nongmon",
            "name": "Nông Môn"
        },
        {
            "data": "thany",
            "name": "Thần Y"
        },
        {
            "data": "honghoang",
            "name": "Hồng Hoang"
        },
        {
            "data": "bathackluu",
            "name": "Bật Hack Lưu"
        },
        {
            "data": "khoihai",
            "name": "Khôi Hài"
        },
        {
            "data": "tienhoa",
            "name": "Tiến Hóa"
        },
        {
            "data": "hoangtu",
            "name": "Hoàng Tử"
        },
        {
            "data": "luongtantuyduong",
            "name": "Lưỡng Tấn Tùy Đường"
        },
        {
            "data": "thanthoai",
            "name": "Thần Thoại"
        },
        {
            "data": "vuichoigiaitri",
            "name": "Vui Chơi Giải Trí"
        },
        {
            "data": "phongthan",
            "name": "Phong Thần"
        },
        {
            "data": "tamquoc",
            "name": "Tam Quốc"
        },
        {
            "data": "hocsinh",
            "name": "Học Sinh"
        },
        {
            "data": "duongtrieu",
            "name": "Đường Triều"
        },
        {
            "data": "thuongchien",
            "name": "Thương Chiến"
        },
        {
            "data": "tayphuongkyhuyen",
            "name": "Tây Phương Kỳ Huyễn"
        },
        {
            "data": "lapnghiep",
            "name": "Lập Nghiệp"
        },
        {
            "data": "khoahockythuat",
            "name": "Khoa Học Kỹ Thuật"
        },
        {
            "data": "giaitriminhtinh",
            "name": "Giải Trí Minh Tinh"
        },
        {
            "data": "huongthosinhhoat",
            "name": "Hương Thổ Sinh Hoạt"
        },
        {
            "data": "huyentuongngontinh",
            "name": "Huyễn Tưởng Ngôn Tình"
        },
        {
            "data": "truyenthongvohiep",
            "name": "Truyền Thống Võ Hiệp"
        },
        {
            "data": "thegia",
            "name": "Thế Gia"
        },
        {
            "data": "suyluanhuyennghi",
            "name": "Suy Luận Huyền Nghi"
        },
        {
            "data": "cungdau",
            "name": "Cung Đấu"
        },
        {
            "data": "maphap",
            "name": "Ma Pháp"
        },
        {
            "data": "trochoinguoichoi",
            "name": "Trò Chơi Người Chơi"
        },
        {
            "data": "yeunhau",
            "name": "Yêu Nhau"
        },
        {
            "data": "giambao",
            "name": "Giám Bảo"
        },
        {
            "data": "minhtinh",
            "name": "Minh Tinh"
        },
        {
            "data": "trachdau",
            "name": "Trạch Đấu"
        },
        {
            "data": "tiende",
            "name": "Tiên Đế"
        },
        {
            "data": "dithuluu",
            "name": "Dị Thú Lưu"
        },
        {
            "data": "daosi",
            "name": "Đạo Sĩ"
        },
        {
            "data": "hoanhioangia",
            "name": "Hoan Hỉ Oan Gia"
        },
        {
            "data": "thaigiam",
            "name": "Thái Giám"
        },
        {
            "data": "honghoangphongthan",
            "name": "Hồng Hoang Phong Thần"
        },
        {
            "data": "laoban",
            "name": "Lão Bản"
        },
        {
            "data": "tinhte",
            "name": "Tinh Tế"
        },
        {
            "data": "hoangu",
            "name": "Hoa Ngu"
        },
        {
            "data": "thidau",
            "name": "Thi Đấu"
        },
        {
            "data": "quansu",
            "name": "Quân Sự"
        },
        {
            "data": "thinhthe",
            "name": "Thịnh Thế"
        },
        {
            "data": "santruong",
            "name": "Sân Trường"
        },
        {
            "data": "phongthuyhuyenthuat",
            "name": "Phong Thuỷ Huyền Thuật"
        },
        {
            "data": "danhdau",
            "name": "Đánh Dấu"
        },
        {
            "data": "linhkhikhoiphuc",
            "name": "Linh Khí Khôi Phục"
        },
        {
            "data": "cholamviec",
            "name": "Chỗ Làm Việc"
        },
        {
            "data": "tamquandang",
            "name": "Tam Quan Đang"
        },
        {
            "data": "ngotnguoc",
            "name": "Ngọt Ngược"
        },
        {
            "data": "nguoccanba",
            "name": "Ngược Cặn Bã"
        },
        {
            "data": "tongmon",
            "name": "Tông Môn"
        },
        {
            "data": "doansung",
            "name": "Đoàn Sủng"
        },
        {
            "data": "thiemhon",
            "name": "Thiểm Hôn"
        },
        {
            "data": "docsung",
            "name": "Độc Sủng"
        },
        {
            "data": "kythuatluu",
            "name": "Kỹ Thuật Lưu"
        },
        {
            "data": "tanhan",
            "name": "Tần Hán"
        },
        {
            "data": "truoctiencuoisauthich",
            "name": "Trước Tiên Cưới Sau Thích"
        },
        {
            "data": "donnuchinh",
            "name": "Đơn Nữ Chính"
        },
        {
            "data": "diencanh",
            "name": "Điện Cạnh"
        },
        {
            "data": "kieuhung",
            "name": "Kiêu Hùng"
        },
        {
            "data": "tienhiephuyentinh",
            "name": "Tiên Hiệp Huyễn Tình"
        },
        {
            "data": "aolot",
            "name": "Áo Lót"
        },
        {
            "data": "taydu",
            "name": "Tây Du"
        },
        {
            "data": "kiemcungmaphap",
            "name": "Kiếm Cùng Ma Pháp"
        },
        {
            "data": "manhbao",
            "name": "Manh Bảo"
        },
        {
            "data": "dailao",
            "name": "Đại Lão"
        },
        {
            "data": "linhcan",
            "name": "Linh Căn"
        },
        {
            "data": "luyencongluu",
            "name": "Luyện Công Lưu"
        },
        {
            "data": "nongdan",
            "name": "Nông Dân"
        },
        {
            "data": "sapdatluu",
            "name": "Sắp Đặt Lưu"
        },
        {
            "data": "guongvolailanh",
            "name": "Gương Vỡ Lại Lành"
        },
        {
            "data": "lamgiau",
            "name": "Làm Giàu"
        },
        {
            "data": "trieuhoanluu",
            "name": "Triệu Hoán Lưu"
        },
        {
            "data": "phiasaumanluu",
            "name": "Phía Sau Màn Lưu"
        },
        {
            "data": "mythuc",
            "name": "Mỹ Thực"
        },
        {
            "data": "xuyenthu",
            "name": "Xuyên Thư"
        },
        {
            "data": "chuthienluu",
            "name": "Chư Thiên Lưu"
        },
        {
            "data": "lyhon",
            "name": "Ly Hôn"
        },
        {
            "data": "vuongphi",
            "name": "Vương Phi"
        },
        {
            "data": "thienkim",
            "name": "Thiên Kim"
        },
        {
            "data": "thucteao",
            "name": "Thực Tế Ảo"
        },
        {
            "data": "cuongcuong",
            "name": "Cường Cường"
        },
        {
            "data": "anhtrangsang",
            "name": "Ánh Trăng Sáng"
        },
        {
            "data": "phamnhanluu",
            "name": "Phàm Nhân Lưu"
        },
        {
            "data": "docogiambao",
            "name": "Đồ Cổ Giám Bảo"
        },
        {
            "data": "trochoikiepsong",
            "name": "Trò Chơi Kiếp Sống"
        },
        {
            "data": "satthu",
            "name": "Sát Thủ"
        },
        {
            "data": "amap",
            "name": "Ấm Áp"
        },
        {
            "data": "nguoichoi",
            "name": "Người Chơi"
        },
        {
            "data": "nutonnucuong",
            "name": "Nữ Tôn Nữ Cường"
        },
        {
            "data": "kiemtu",
            "name": "Kiếm Tu"
        },
        {
            "data": "chientranhkhangnhat",
            "name": "Chiến Tranh Kháng Nhật"
        },
        {
            "data": "duongthanh",
            "name": "Dưỡng Thành"
        },
        {
            "data": "luyenkhi",
            "name": "Luyện Khí"
        },
        {
            "data": "vohanluu",
            "name": "Vô Hạn Lưu"
        },
        {
            "data": "quanlu",
            "name": "Quân Lữ"
        },
        {
            "data": "vuem",
            "name": "Vú Em"
        },
        {
            "data": "tuongaituongsat",
            "name": "Tương Ái Tương Sát"
        },
        {
            "data": "lamruongkinhthuong",
            "name": "Làm Ruộng Kinh Thương"
        },
        {
            "data": "nuphoi",
            "name": "Nữ Phối"
        },
        {
            "data": "cachep",
            "name": "Cá Chép"
        },
        {
            "data": "nghenghiepvan",
            "name": "Nghề Nghiệp Văn"
        },
        {
            "data": "theducthidau",
            "name": "Thể Dục Thi Đấu"
        },
        {
            "data": "tongtrieu",
            "name": "Tống Triều"
        },
        {
            "data": "truoctiencuoisauyeu",
            "name": "Trước Tiên Cưới Sau Yêu"
        },
        {
            "data": "dongbinh",
            "name": "Dong Binh"
        },
        {
            "data": "phithang",
            "name": "Phi Thăng"
        },
        {
            "data": "tuonglaivongdu",
            "name": "Tương Lai Võng Du"
        },
        {
            "data": "vuonggiavinhquang",
            "name": "Vương Giả Vinh Quang"
        },
        {
            "data": "hoangdacausinh",
            "name": "Hoang Dã Cầu Sinh"
        },
        {
            "data": "kieptruocvakiepnay",
            "name": "Kiếp Trước Và Kiếp Này"
        },
        {
            "data": "thaohan",
            "name": "Tháo Hán"
        },
        {
            "data": "dinanggia",
            "name": "Dị Năng Giả"
        },
        {
            "data": "lamquai",
            "name": "Làm Quái"
        },
        {
            "data": "tuongquan",
            "name": "Tướng Quân"
        },
        {
            "data": "canhsat",
            "name": "Cảnh Sát"
        },
        {
            "data": "hoangdeluu",
            "name": "Hoàng Đế Lưu"
        },
        {
            "data": "tienhoabiendi",
            "name": "Tiến Hóa Biến Dị"
        },
        {
            "data": "nganhgiaitri",
            "name": "Ngành Giải Trí"
        },
        {
            "data": "thanhmaitrucma",
            "name": "Thanh Mai Trúc Mã"
        },
        {
            "data": "hoankho",
            "name": "Hoàn Khố"
        },
        {
            "data": "thuongcotientan",
            "name": "Thượng Cổ Tiên Tần"
        },
        {
            "data": "camyve",
            "name": "Cẩm Y Vệ"
        },
        {
            "data": "rutthuong",
            "name": "Rút Thưởng"
        },
        {
            "data": "thienluong",
            "name": "Thiện Lương"
        },
        {
            "data": "kinhdikinhkhung",
            "name": "Kinh Dị Kinh Khủng"
        },
        {
            "data": "hinhsutrinhsat",
            "name": "Hình Sự Trinh Sát"
        },
        {
            "data": "thiethuyet",
            "name": "Thiết Huyết"
        },
        {
            "data": "laosu",
            "name": "Lão Sư"
        },
        {
            "data": "baotieu",
            "name": "Bảo Tiêu"
        },
        {
            "data": "ngaokieu",
            "name": "Ngạo Kiều"
        },
        {
            "data": "vuonghau",
            "name": "Vương Hầu"
        },
        {
            "data": "tuyduong",
            "name": "Tùy Đường"
        },
        {
            "data": "nguthuluu",
            "name": "Ngự Thú Lưu"
        },
        {
            "data": "sungvat",
            "name": "Sủng Vật"
        },
        {
            "data": "sachluocluu",
            "name": "Sách Lược Lưu"
        },
        {
            "data": "quyenthan",
            "name": "Quyền Thần"
        },
        {
            "data": "baoan",
            "name": "Bảo An"
        },
        {
            "data": "nguocvan",
            "name": "Ngược Văn"
        },
        {
            "data": "hocba",
            "name": "Học Bá"
        },
        {
            "data": "cucpham",
            "name": "Cực Phẩm"
        },
        {
            "data": "nhanhxuyen",
            "name": "Nhanh Xuyên"
        },
        {
            "data": "phansaolo",
            "name": "Phản Sáo Lộ"
        },
        {
            "data": "muontao",
            "name": "Muộn Tao"
        },
        {
            "data": "trachnam",
            "name": "Trạch Nam"
        },
        {
            "data": "thanhsudanquoc",
            "name": "Thanh Sử Dân Quốc"
        },
        {
            "data": "nhanvatphandien",
            "name": "Nhân Vật Phản Diện"
        },
        {
            "data": "khonggian",
            "name": "Không Gian"
        },
        {
            "data": "tutien",
            "name": "Tu Tiên"
        },
        {
            "data": "thatgiathienkim",
            "name": "Thật Giả Thiên Kim"
        },
        {
            "data": "tuchan",
            "name": "Tu Chân"
        },
        {
            "data": "linhdacchung",
            "name": "Lính Đặc Chủng"
        },
        {
            "data": "daukhithegioi",
            "name": "Đấu Khí Thế Giới"
        },
        {
            "data": "thanhthanluu",
            "name": "Thành Thần Lưu"
        },
        {
            "data": "nhiethuyetsantruong",
            "name": "Nhiệt Huyết Sân Trường"
        },
        {
            "data": "viencothanthoai",
            "name": "Viễn Cổ Thần Thoại"
        },
        {
            "data": "ngabailuu",
            "name": "Ngả Bài Lưu"
        },
        {
            "data": "docphi",
            "name": "Độc Phi"
        },
        {
            "data": "thaituphi",
            "name": "Thái Tử Phi"
        },
        {
            "data": "giakhong",
            "name": "Giá Không"
        },
        {
            "data": "sieucapkhoahockythuat",
            "name": "Siêu Cấp Khoa Học Kỹ Thuật"
        },
        {
            "data": "khongkimthuchi",
            "name": "Không Kim Thủ Chỉ"
        },
        {
            "data": "chientranhgiuacachanhtinh",
            "name": "Chiến Tranh Giữa Các Hành Tinh"
        },
        {
            "data": "chatgroup",
            "name": "Chat Group"
        },
        {
            "data": "huyennghisuyluan",
            "name": "Huyền Nghi Suy Luận"
        },
        {
            "data": "manhhe",
            "name": "Manh Hệ"
        },
        {
            "data": "hoangthuc",
            "name": "Hoàng Thúc"
        },
        {
            "data": "santruongsinhhoat",
            "name": "Sân Trường Sinh Hoạt"
        },
        {
            "data": "mangbenminhluu",
            "name": "Mang Bên Mình Lưu"
        },
        {
            "data": "thientai",
            "name": "Thiên Tài"
        },
        {
            "data": "loraanhsangluu",
            "name": "Lộ Ra Ánh Sáng Lưu"
        },
        {
            "data": "thoikhongvan",
            "name": "Thời Không Văn"
        },
        {
            "data": "chiensi",
            "name": "Chiến Sĩ"
        },
        {
            "data": "thiendinhvan",
            "name": "Thiên Đình Văn"
        },
        {
            "data": "daiga",
            "name": "Đại Gả"
        },
        {
            "data": "dilam",
            "name": "Đi Làm"
        },
        {
            "data": "chuatri",
            "name": "Chữa Trị"
        },
        {
            "data": "daccong",
            "name": "Đặc Công"
        },
        {
            "data": "vuonggia",
            "name": "Vương Gia"
        },
        {
            "data": "doithumotmatmotcon",
            "name": "Đối Thủ Một Mất Một Còn"
        },
        {
            "data": "baochekhuyetdiem",
            "name": "Bao Che Khuyết Điểm"
        },
        {
            "data": "hachoa",
            "name": "Hắc Hóa"
        },
        {
            "data": "vuongtrieutranhba",
            "name": "Vương Triều Tranh Bá"
        },
        {
            "data": "khoacu",
            "name": "Khoa Cử"
        },
        {
            "data": "miengphao",
            "name": "Miệng Pháo"
        },
        {
            "data": "nhagiaunhat",
            "name": "Nhà Giàu Nhất"
        },
        {
            "data": "taichinh",
            "name": "Tài Chính"
        },
        {
            "data": "benhkieu",
            "name": "Bệnh Kiều"
        },
        {
            "data": "trungyluu",
            "name": "Trung Y Lưu"
        },
        {
            "data": "daotac",
            "name": "Đạo Tặc"
        },
        {
            "data": "cuongquoc",
            "name": "Cường Quốc"
        },
        {
            "data": "phapsu",
            "name": "Pháp Sư"
        },
        {
            "data": "trinhquan",
            "name": "Trinh Quán"
        },
        {
            "data": "kyhuyenlichsu",
            "name": "Kỳ Huyễn Lịch Sử"
        },
        {
            "data": "daisuhuynh",
            "name": "Đại Sư Huynh"
        },
        {
            "data": "tieubinh",
            "name": "Tiểu Binh"
        },
        {
            "data": "bachlienhoa",
            "name": "Bạch Liên Hoa"
        },
        {
            "data": "thuanai",
            "name": "Thuần Ái"
        },
        {
            "data": "lamdangiau",
            "name": "Làm Dân Giàu"
        },
        {
            "data": "hiendaivohiep",
            "name": "Hiện Đại Võ Hiệp"
        },
        {
            "data": "thuatsi",
            "name": "Thuật Sĩ"
        },
        {
            "data": "maphapsantruong",
            "name": "Ma Pháp Sân Trường"
        },
        {
            "data": "doatxa",
            "name": "Đoạt Xá"
        },
        {
            "data": "thosan",
            "name": "Thợ Săn"
        },
        {
            "data": "diemthe",
            "name": "Điềm Thê"
        },
        {
            "data": "caolanh",
            "name": "Cao Lãnh"
        },
        {
            "data": "hanmontude",
            "name": "Hàn Môn Tử Đệ"
        },
        {
            "data": "vuamananh",
            "name": "Vua Màn Ảnh"
        },
        {
            "data": "thangcap",
            "name": "Thăng Cấp"
        },
        {
            "data": "yeutinhtinhduyen",
            "name": "Yêu Tinh Tình Duyên"
        },
        {
            "data": "ngudai",
            "name": "Ngu Dại"
        },
        {
            "data": "vidien",
            "name": "Vị Diện"
        },
        {
            "data": "bacsi",
            "name": "Bác Sĩ"
        },
        {
            "data": "thuoctinhluu",
            "name": "Thuộc Tính Lưu"
        },
        {
            "data": "khangchien",
            "name": "Kháng Chiến"
        },
        {
            "data": "khoahockythuattuchan",
            "name": "Khoa Học Kỹ Thuật Tu Chân"
        },
        {
            "data": "namthan",
            "name": "Nam Thần"
        },
        {
            "data": "nhathietke",
            "name": "Nhà Thiết Kế"
        },
        {
            "data": "ramat",
            "name": "Ra Mắt"
        },
        {
            "data": "phoma",
            "name": "Phò Mã"
        },
        {
            "data": "khongnuchinh",
            "name": "Không Nữ Chính"
        },
        {
            "data": "hikichtinh",
            "name": "Hí Kịch Tinh"
        },
        {
            "data": "nuchinhmanhembe",
            "name": "Nữ Chính Manh Em Bé"
        },
        {
            "data": "tongman",
            "name": "Tổng Mạn"
        }
    ];

    var genres = [
        { title: "男-奇幻", input: "/books/nansheng?categoryId=1114", script: "zen.js" },
        { title: "男-玄幻", input: "/books/nansheng?categoryId=1115", script: "zen.js" },
        { title: "男-武侠", input: "/books/nansheng?categoryId=1116", script: "zen.js" },
        { title: "男-仙侠", input: "/books/nansheng?categoryId=1117", script: "zen.js" },
        { title: "男-都市", input: "/books/nansheng?categoryId=1118", script: "zen.js" },
        { title: "男-校园", input: "/books/nansheng?categoryId=1119", script: "zen.js" },
        { title: "男-历史", input: "/books/nansheng?categoryId=1120", script: "zen.js" },
        { title: "男-军事", input: "/books/nansheng?categoryId=1121", script: "zen.js" },
        { title: "男-游戏", input: "/books/nansheng?categoryId=1122", script: "zen.js" },
        { title: "男-竞技", input: "/books/nansheng?categoryId=1123", script: "zen.js" },
        { title: "男-科幻", input: "/books/nansheng?categoryId=1124", script: "zen.js" },
        { title: "男-灵异", input: "/books/nansheng?categoryId=1125", script: "zen.js" },
    ];

    tags.forEach(function (tag) {
        genres.push({ title: tag.name, input: tag.data + ",", script: "tag.js" })
    });

    return Response.success(genres);
}
