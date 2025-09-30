function execute() {
    var tags = [
        {
            "data": "namtan",
            "name": "Nam Tần(10607)"
        },
        {
            "data": "dothi",
            "name": "Đô Thị(5221)"
        },
        {
            "data": "nhiethuyet",
            "name": "Nhiệt Huyết(4480)"
        },
        {
            "data": "satphatquadoan",
            "name": "Sát Phạt Quả Đoán(3256)"
        },
        {
            "data": "huyenhuyen",
            "name": "Huyền Huyễn(2863)"
        },
        {
            "data": "nutan",
            "name": "Nữ Tần(1797)"
        },
        {
            "data": "lichsuvocancu",
            "name": "Lịch Sử Vô Căn Cứ(1770)"
        },
        {
            "data": "sangvan",
            "name": "Sảng Văn(1668)"
        },
        {
            "data": "dothicaothu",
            "name": "Đô Thị Cao Thủ(1631)"
        },
        {
            "data": "lichsu",
            "name": "Lịch Sử(1567)"
        },
        {
            "data": "giaheoanthitho",
            "name": "Giả Heo Ăn Thịt Hổ(1538)"
        },
        {
            "data": "dongphuonghuyenhuyen",
            "name": "Đông Phương Huyền Huyễn(1449)"
        },
        {
            "data": "hohoacaothu",
            "name": "Hộ Hoa Cao Thủ(1433)"
        },
        {
            "data": "nghichtap",
            "name": "Nghịch Tập(1430)"
        },
        {
            "data": "codaingontinh",
            "name": "Cổ Đại Ngôn Tình(1353)"
        },
        {
            "data": "vodao",
            "name": "Võ Đạo(1339)"
        },
        {
            "data": "thangcapluu",
            "name": "Thăng Cấp Lưu(1218)"
        },
        {
            "data": "cuocsongdothi",
            "name": "Cuộc Sống Đô Thị(1203)"
        },
        {
            "data": "muuluoc",
            "name": "Mưu Lược(1123)"
        },
        {
            "data": "xuyenqua",
            "name": "Xuyên Qua(1063)"
        },
        {
            "data": "xaubung",
            "name": "Xấu Bụng(1007)"
        },
        {
            "data": "luyencong",
            "name": "Luyện Công(908)"
        },
        {
            "data": "machsuynghithanhky",
            "name": "Mạch Suy Nghĩ Thanh Kỳ(893)"
        },
        {
            "data": "cuonggiatrove",
            "name": "Cường Giả Trở Về(886)"
        },
        {
            "data": "kiemtien",
            "name": "Kiếm Tiền(871)"
        },
        {
            "data": "bacsiluu",
            "name": "Bác Sĩ Lưu(855)"
        },
        {
            "data": "tinhyeu",
            "name": "Tình Yêu(835)"
        },
        {
            "data": "linhdi",
            "name": "Linh Dị(803)"
        },
        {
            "data": "dithedailuc",
            "name": "Dị Thế Đại Lục(790)"
        },
        {
            "data": "trungsinh",
            "name": "Trùng Sinh(772)"
        },
        {
            "data": "tienhiep",
            "name": "Tiên Hiệp(763)"
        },
        {
            "data": "tranhba",
            "name": "Tranh Bá(738)"
        },
        {
            "data": "huyennghiluu",
            "name": "Huyền Nghi Lưu(678)"
        },
        {
            "data": "hiendaiquybi",
            "name": "Hiện Đại Quỷ Bí(677)"
        },
        {
            "data": "tridau",
            "name": "Trí Đấu(672)"
        },
        {
            "data": "ngotsung",
            "name": "Ngọt Sủng(661)"
        },
        {
            "data": "dithuatsieunang",
            "name": "Dị Thuật Siêu Năng(640)"
        },
        {
            "data": "hiendaingontinh",
            "name": "Hiện Đại Ngôn Tình(628)"
        },
        {
            "data": "danhmat",
            "name": "Đánh Mặt(603)"
        },
        {
            "data": "xuyenquathoikhong",
            "name": "Xuyên Qua Thời Không(587)"
        },
        {
            "data": "hiendaituchan",
            "name": "Hiện Đại Tu Chân(578)"
        },
        {
            "data": "thuongngayvan",
            "name": "Thường Ngày Văn(560)"
        },
        {
            "data": "nuthan",
            "name": "Nữ Thần(544)"
        },
        {
            "data": "tienhiepcodien",
            "name": "Tiên Hiệp Cổ Điển(528)"
        },
        {
            "data": "baothu",
            "name": "Báo Thù(501)"
        },
        {
            "data": "thanhthuc",
            "name": "Thành Thục(500)"
        },
        {
            "data": "chitonluu",
            "name": "Chí Tôn Lưu(482)"
        },
        {
            "data": "nhenhom",
            "name": "Nhẹ Nhõm(482)"
        },
        {
            "data": "thamhiem",
            "name": "Thám Hiểm(468)"
        },
        {
            "data": "trochoi",
            "name": "Trò Chơi(465)"
        },
        {
            "data": "thientailuu",
            "name": "Thiên Tài Lưu(461)"
        },
        {
            "data": "vodichluu",
            "name": "Vô Địch Lưu(460)"
        },
        {
            "data": "trithongminhtaituyen",
            "name": "Trí Thông Minh Tại Tuyến(453)"
        },
        {
            "data": "tonggiamdochaomon",
            "name": "Tổng Giám Đốc Hào Môn(451)"
        },
        {
            "data": "quyenmuu",
            "name": "Quyền Mưu(445)"
        },
        {
            "data": "nguoioreluu",
            "name": "Người Ở Rể Lưu(442)"
        },
        {
            "data": "khoahuyen",
            "name": "Khoa Huyễn(439)"
        },
        {
            "data": "soicoquatkhoi",
            "name": "Sợi Cỏ Quật Khởi(414)"
        },
        {
            "data": "binhvuong",
            "name": "Binh Vương(391)"
        },
        {
            "data": "loanthe",
            "name": "Loạn Thế(390)"
        },
        {
            "data": "trieudinhgiangho",
            "name": "Triều Đình Giang Hồ(365)"
        },
        {
            "data": "ydaothanhthu",
            "name": "Y Đạo Thánh Thủ(357)"
        },
        {
            "data": "hethongluu",
            "name": "Hệ Thống Lưu(355)"
        },
        {
            "data": "tonggiamdoc",
            "name": "Tổng Giám Đốc(349)"
        },
        {
            "data": "tinhtao",
            "name": "Tỉnh Táo(342)"
        },
        {
            "data": "kinhdikinhkhung",
            "name": "Kinh Dị Kinh Khủng(341)"
        },
        {
            "data": "cokinh",
            "name": "Cổ Kính(326)"
        },
        {
            "data": "naodonglon",
            "name": "Não Động Lớn(320)"
        },
        {
            "data": "dinang",
            "name": "Dị Năng(314)"
        },
        {
            "data": "trieudinh",
            "name": "Triều Đình(307)"
        },
        {
            "data": "lamruong",
            "name": "Làm Ruộng(305)"
        },
        {
            "data": "cuonggialuu",
            "name": "Cường Giả Lưu(294)"
        },
        {
            "data": "batdauluu",
            "name": "Bắt Đầu Lưu(294)"
        },
        {
            "data": "duhidigioi",
            "name": "Du Hí Dị Giới(284)"
        },
        {
            "data": "luongtongnguyenminh",
            "name": "Lưỡng Tống Nguyên Minh(284)"
        },
        {
            "data": "luyendan",
            "name": "Luyện Đan(275)"
        },
        {
            "data": "laungaysinhtinh",
            "name": "Lâu Ngày Sinh Tình(268)"
        },
        {
            "data": "daonguoc",
            "name": "Đảo Ngược(267)"
        },
        {
            "data": "thegioituonglai",
            "name": "Thế Giới Tương Lai(264)"
        },
        {
            "data": "nhanhtiettau",
            "name": "Nhanh Tiết Tấu(260)"
        },
        {
            "data": "dothitutien",
            "name": "Đô Thị Tu Tiên(258)"
        },
        {
            "data": "nucuong",
            "name": "Nữ Cường(254)"
        },
        {
            "data": "minhtrieu",
            "name": "Minh Triều(252)"
        },
        {
            "data": "vongdu",
            "name": "Võng Du(242)"
        },
        {
            "data": "haomon",
            "name": "Hào Môn(215)"
        },
        {
            "data": "thuongnghiepongtrum",
            "name": "Thương Nghiệp Ông Trùm(213)"
        },
        {
            "data": "dithexuyenqua",
            "name": "Dị Thế Xuyên Qua(207)"
        },
        {
            "data": "giatoc",
            "name": "Gia Tộc(206)"
        },
        {
            "data": "thamtusuyluan",
            "name": "Thám Tử Suy Luận(205)"
        },
        {
            "data": "phandau",
            "name": "Phấn Đấu(197)"
        },
        {
            "data": "kinhdoanh",
            "name": "Kinh Doanh(195)"
        },
        {
            "data": "chienthanluu",
            "name": "Chiến Thần Lưu(192)"
        },
        {
            "data": "tanthenguyco",
            "name": "Tận Thế Nguy Cơ(192)"
        },
        {
            "data": "tucuong",
            "name": "Tự Cường(191)"
        },
        {
            "data": "tanthe",
            "name": "Tận Thế(186)"
        },
        {
            "data": "nutonggiamdoc",
            "name": "Nữ Tổng Giám Đốc(185)"
        },
        {
            "data": "canthan",
            "name": "Cẩn Thận(184)"
        },
        {
            "data": "huyenhoc",
            "name": "Huyền Học(181)"
        },
        {
            "data": "tuhanche",
            "name": "Tự Hạn Chế(171)"
        },
        {
            "data": "caothuxuongnui",
            "name": "Cao Thủ Xuống Núi(170)"
        },
        {
            "data": "kyhuyentuchan",
            "name": "Kỳ Huyễn Tu Chân(168)"
        },
        {
            "data": "niendaivan",
            "name": "Niên Đại Văn(166)"
        },
        {
            "data": "badao",
            "name": "Bá Đạo(164)"
        },
        {
            "data": "cuopquyen",
            "name": "Cướp Quyền(158)"
        },
        {
            "data": "cuimucluu",
            "name": "Củi Mục Lưu(156)"
        },
        {
            "data": "kyhuyen",
            "name": "Kỳ Huyễn(154)"
        },
        {
            "data": "nongthon",
            "name": "Nông Thôn(154)"
        },
        {
            "data": "cungdautrachdau",
            "name": "Cung Đấu Trạch Đấu(147)"
        },
        {
            "data": "tinhyeuvahonnhan",
            "name": "Tình Yêu Và Hôn Nhân(145)"
        },
        {
            "data": "hunghivongdu",
            "name": "Hư Nghĩ Võng Du(143)"
        },
        {
            "data": "cungnguoitacpham",
            "name": "Cùng Người Tác Phẩm(141)"
        },
        {
            "data": "vohiep",
            "name": "Võ Hiệp(139)"
        },
        {
            "data": "dichnu",
            "name": "Đích Nữ(135)"
        },
        {
            "data": "sinhtonkhieuchien",
            "name": "Sinh Tồn Khiêu Chiến(131)"
        },
        {
            "data": "truythe",
            "name": "Truy Thê(131)"
        },
        {
            "data": "chientranh",
            "name": "Chiến Tranh(128)"
        },
        {
            "data": "truongsinh",
            "name": "Trường Sinh(128)"
        },
        {
            "data": "sungthe",
            "name": "Sủng Thê(128)"
        },
        {
            "data": "tanhantamquoc",
            "name": "Tần Hán Tam Quốc(127)"
        },
        {
            "data": "nhieunuchinh",
            "name": "Nhiều Nữ Chính(126)"
        },
        {
            "data": "nongmon",
            "name": "Nông Môn(125)"
        },
        {
            "data": "thany",
            "name": "Thần Y(119)"
        },
        {
            "data": "honghoang",
            "name": "Hồng Hoang(118)"
        },
        {
            "data": "bathackluu",
            "name": "Bật Hack Lưu(114)"
        },
        {
            "data": "khoihai",
            "name": "Khôi Hài(111)"
        },
        {
            "data": "tienhoa",
            "name": "Tiến Hóa(110)"
        },
        {
            "data": "hoangtu",
            "name": "Hoàng Tử(110)"
        },
        {
            "data": "luongtantuyduong",
            "name": "Lưỡng Tấn Tùy Đường(108)"
        },
        {
            "data": "thanthoai",
            "name": "Thần Thoại(107)"
        },
        {
            "data": "vuichoigiaitri",
            "name": "Vui Chơi Giải Trí(106)"
        },
        {
            "data": "phongthan",
            "name": "Phong Thần(103)"
        },
        {
            "data": "tamquoc",
            "name": "Tam Quốc(102)"
        },
        {
            "data": "hocsinh",
            "name": "Học Sinh(102)"
        },
        {
            "data": "duongtrieu",
            "name": "Đường Triều(102)"
        },
        {
            "data": "thuongchien",
            "name": "Thương Chiến(102)"
        },
        {
            "data": "tayphuongkyhuyen",
            "name": "Tây Phương Kỳ Huyễn(100)"
        },
        {
            "data": "lapnghiep",
            "name": "Lập Nghiệp(100)"
        },
        {
            "data": "khoahockythuat",
            "name": "Khoa Học Kỹ Thuật(98)"
        },
        {
            "data": "giaitriminhtinh",
            "name": "Giải Trí Minh Tinh(95)"
        },
        {
            "data": "huongthosinhhoat",
            "name": "Hương Thổ Sinh Hoạt(95)"
        },
        {
            "data": "huyentuongngontinh",
            "name": "Huyễn Tưởng Ngôn Tình(91)"
        },
        {
            "data": "truyenthongvohiep",
            "name": "Truyền Thống Võ Hiệp(90)"
        },
        {
            "data": "thegia",
            "name": "Thế Gia(89)"
        },
        {
            "data": "suyluanhuyennghi",
            "name": "Suy Luận Huyền Nghi(89)"
        },
        {
            "data": "cungdau",
            "name": "Cung Đấu(85)"
        },
        {
            "data": "maphap",
            "name": "Ma Pháp(83)"
        },
        {
            "data": "trochoinguoichoi",
            "name": "Trò Chơi Người Chơi(83)"
        },
        {
            "data": "yeunhau",
            "name": "Yêu Nhau(82)"
        },
        {
            "data": "giambao",
            "name": "Giám Bảo(81)"
        },
        {
            "data": "minhtinh",
            "name": "Minh Tinh(81)"
        },
        {
            "data": "trachdau",
            "name": "Trạch Đấu(81)"
        },
        {
            "data": "tiende",
            "name": "Tiên Đế(77)"
        },
        {
            "data": "dithuluu",
            "name": "Dị Thú Lưu(76)"
        },
        {
            "data": "daosi",
            "name": "Đạo Sĩ(75)"
        },
        {
            "data": "hoanhioangia",
            "name": "Hoan Hỉ Oan Gia(75)"
        },
        {
            "data": "thaigiam",
            "name": "Thái Giám(75)"
        },
        {
            "data": "honghoangphongthan",
            "name": "Hồng Hoang Phong Thần(73)"
        },
        {
            "data": "laoban",
            "name": "Lão Bản(72)"
        },
        {
            "data": "tinhte",
            "name": "Tinh Tế(72)"
        },
        {
            "data": "hoangu",
            "name": "Hoa Ngu(71)"
        },
        {
            "data": "thidau",
            "name": "Thi Đấu(65)"
        },
        {
            "data": "quansu",
            "name": "Quân Sự(63)"
        },
        {
            "data": "thinhthe",
            "name": "Thịnh Thế(63)"
        },
        {
            "data": "santruong",
            "name": "Sân Trường(62)"
        },
        {
            "data": "phongthuyhuyenthuat",
            "name": "Phong Thuỷ Huyền Thuật(62)"
        },
        {
            "data": "danhdau",
            "name": "Đánh Dấu(62)"
        },
        {
            "data": "linhkhikhoiphuc",
            "name": "Linh Khí Khôi Phục(61)"
        },
        {
            "data": "cholamviec",
            "name": "Chỗ Làm Việc(61)"
        },
        {
            "data": "tamquandang",
            "name": "Tam Quan Đang(59)"
        },
        {
            "data": "ngotnguoc",
            "name": "Ngọt Ngược(58)"
        },
        {
            "data": "nguoccanba",
            "name": "Ngược Cặn Bã(58)"
        },
        {
            "data": "tongmon",
            "name": "Tông Môn(57)"
        },
        {
            "data": "doansung",
            "name": "Đoàn Sủng(57)"
        },
        {
            "data": "thiemhon",
            "name": "Thiểm Hôn(57)"
        },
        {
            "data": "docsung",
            "name": "Độc Sủng(56)"
        },
        {
            "data": "kythuatluu",
            "name": "Kỹ Thuật Lưu(54)"
        },
        {
            "data": "tanhan",
            "name": "Tần Hán(54)"
        },
        {
            "data": "truoctiencuoisauthich",
            "name": "Trước Tiên Cưới Sau Thích(54)"
        },
        {
            "data": "donnuchinh",
            "name": "Đơn Nữ Chính(53)"
        },
        {
            "data": "diencanh",
            "name": "Điện Cạnh(53)"
        },
        {
            "data": "kieuhung",
            "name": "Kiêu Hùng(52)"
        },
        {
            "data": "tienhiephuyentinh",
            "name": "Tiên Hiệp Huyễn Tình(50)"
        },
        {
            "data": "aolot",
            "name": "Áo Lót(49)"
        },
        {
            "data": "taydu",
            "name": "Tây Du(48)"
        },
        {
            "data": "kiemcungmaphap",
            "name": "Kiếm Cùng Ma Pháp(47)"
        },
        {
            "data": "manhbao",
            "name": "Manh Bảo(47)"
        },
        {
            "data": "dailao",
            "name": "Đại Lão(47)"
        },
        {
            "data": "linhcan",
            "name": "Linh Căn(46)"
        },
        {
            "data": "luyencongluu",
            "name": "Luyện Công Lưu(45)"
        },
        {
            "data": "nongdan",
            "name": "Nông Dân(45)"
        },
        {
            "data": "sapdatluu",
            "name": "Sắp Đặt Lưu(45)"
        },
        {
            "data": "guongvolailanh",
            "name": "Gương Vỡ Lại Lành(44)"
        },
        {
            "data": "lamgiau",
            "name": "Làm Giàu(42)"
        },
        {
            "data": "trieuhoanluu",
            "name": "Triệu Hoán Lưu(41)"
        },
        {
            "data": "phiasaumanluu",
            "name": "Phía Sau Màn Lưu(40)"
        },
        {
            "data": "mythuc",
            "name": "Mỹ Thực(40)"
        },
        {
            "data": "xuyenthu",
            "name": "Xuyên Thư(40)"
        },
        {
            "data": "chuthienluu",
            "name": "Chư Thiên Lưu(39)"
        },
        {
            "data": "lyhon",
            "name": "Ly Hôn(39)"
        },
        {
            "data": "vuongphi",
            "name": "Vương Phi(37)"
        },
        {
            "data": "thienkim",
            "name": "Thiên Kim(37)"
        },
        {
            "data": "thucteao",
            "name": "Thực Tế Ảo(36)"
        },
        {
            "data": "cuongcuong",
            "name": "Cường Cường(36)"
        },
        {
            "data": "anhtrangsang",
            "name": "Ánh Trăng Sáng(36)"
        },
        {
            "data": "phamnhanluu",
            "name": "Phàm Nhân Lưu(35)"
        },
        {
            "data": "docogiambao",
            "name": "Đồ Cổ Giám Bảo(35)"
        },
        {
            "data": "trochoikiepsong",
            "name": "Trò Chơi Kiếp Sống(35)"
        },
        {
            "data": "satthu",
            "name": "Sát Thủ(35)"
        },
        {
            "data": "amap",
            "name": "Ấm Áp(35)"
        },
        {
            "data": "nguoichoi",
            "name": "Người Chơi(34)"
        },
        {
            "data": "nutonnucuong",
            "name": "Nữ Tôn Nữ Cường(34)"
        },
        {
            "data": "kiemtu",
            "name": "Kiếm Tu(33)"
        },
        {
            "data": "chientranhkhangnhat",
            "name": "Chiến Tranh Kháng Nhật(33)"
        },
        {
            "data": "duongthanh",
            "name": "Dưỡng Thành(32)"
        },
        {
            "data": "luyenkhi",
            "name": "Luyện Khí(32)"
        },
        {
            "data": "vohanluu",
            "name": "Vô Hạn Lưu(31)"
        },
        {
            "data": "quanlu",
            "name": "Quân Lữ(31)"
        },
        {
            "data": "vuem",
            "name": "Vú Em(31)"
        },
        {
            "data": "tuongaituongsat",
            "name": "Tương Ái Tương Sát(31)"
        },
        {
            "data": "lamruongkinhthuong",
            "name": "Làm Ruộng Kinh Thương(31)"
        },
        {
            "data": "nuphoi",
            "name": "Nữ Phối(31)"
        },
        {
            "data": "cachep",
            "name": "Cá Chép(31)"
        },
        {
            "data": "nghenghiepvan",
            "name": "Nghề Nghiệp Văn(30)"
        },
        {
            "data": "theducthidau",
            "name": "Thể Dục Thi Đấu(30)"
        },
        {
            "data": "tongtrieu",
            "name": "Tống Triều(30)"
        },
        {
            "data": "truoctiencuoisauyeu",
            "name": "Trước Tiên Cưới Sau Yêu(28)"
        },
        {
            "data": "dongbinh",
            "name": "Dong Binh(27)"
        },
        {
            "data": "phithang",
            "name": "Phi Thăng(27)"
        },
        {
            "data": "tuonglaivongdu",
            "name": "Tương Lai Võng Du(27)"
        },
        {
            "data": "vuonggiavinhquang",
            "name": "Vương Giả Vinh Quang(26)"
        },
        {
            "data": "hoangdacausinh",
            "name": "Hoang Dã Cầu Sinh(26)"
        },
        {
            "data": "kieptruocvakiepnay",
            "name": "Kiếp Trước Và Kiếp Này(26)"
        },
        {
            "data": "thaohan",
            "name": "Tháo Hán(26)"
        },
        {
            "data": "dinanggia",
            "name": "Dị Năng Giả(25)"
        },
        {
            "data": "lamquai",
            "name": "Làm Quái(24)"
        },
        {
            "data": "tuongquan",
            "name": "Tướng Quân(24)"
        },
        {
            "data": "canhsat",
            "name": "Cảnh Sát(23)"
        },
        {
            "data": "hoangdeluu",
            "name": "Hoàng Đế Lưu(23)"
        },
        {
            "data": "tienhoabiendi",
            "name": "Tiến Hóa Biến Dị(23)"
        },
        {
            "data": "nganhgiaitri",
            "name": "Ngành Giải Trí(23)"
        },
        {
            "data": "thanhmaitrucma",
            "name": "Thanh Mai Trúc Mã(23)"
        },
        {
            "data": "hoankho",
            "name": "Hoàn Khố(23)"
        },
        {
            "data": "thuongcotientan",
            "name": "Thượng Cổ Tiên Tần(22)"
        },
        {
            "data": "camyve",
            "name": "Cẩm Y Vệ(22)"
        },
        {
            "data": "rutthuong",
            "name": "Rút Thưởng(22)"
        },
        {
            "data": "thienluong",
            "name": "Thiện Lương(22)"
        },
        {
            "data": "kinhdikinhkhung",
            "name": "Kinh Dị Kinh Khủng(22)"
        },
        {
            "data": "hinhsutrinhsat",
            "name": "Hình Sự Trinh Sát(21)"
        },
        {
            "data": "thiethuyet",
            "name": "Thiết Huyết(21)"
        },
        {
            "data": "laosu",
            "name": "Lão Sư(21)"
        },
        {
            "data": "baotieu",
            "name": "Bảo Tiêu(21)"
        },
        {
            "data": "ngaokieu",
            "name": "Ngạo Kiều(21)"
        },
        {
            "data": "vuonghau",
            "name": "Vương Hầu(21)"
        },
        {
            "data": "tuyduong",
            "name": "Tùy Đường(21)"
        },
        {
            "data": "nguthuluu",
            "name": "Ngự Thú Lưu(21)"
        },
        {
            "data": "sungvat",
            "name": "Sủng Vật(21)"
        },
        {
            "data": "sachluocluu",
            "name": "Sách Lược Lưu(21)"
        },
        {
            "data": "quyenthan",
            "name": "Quyền Thần(21)"
        },
        {
            "data": "baoan",
            "name": "Bảo An(20)"
        },
        {
            "data": "nguocvan",
            "name": "Ngược Văn(20)"
        },
        {
            "data": "hocba",
            "name": "Học Bá(19)"
        },
        {
            "data": "cucpham",
            "name": "Cực Phẩm(19)"
        },
        {
            "data": "nhanhxuyen",
            "name": "Nhanh Xuyên(19)"
        },
        {
            "data": "phansaolo",
            "name": "Phản Sáo Lộ(19)"
        },
        {
            "data": "muontao",
            "name": "Muộn Tao(18)"
        },
        {
            "data": "trachnam",
            "name": "Trạch Nam(18)"
        },
        {
            "data": "thanhsudanquoc",
            "name": "Thanh Sử Dân Quốc(18)"
        },
        {
            "data": "nhanvatphandien",
            "name": "Nhân Vật Phản Diện(18)"
        },
        {
            "data": "khonggian",
            "name": "Không Gian(18)"
        },
        {
            "data": "tutien",
            "name": "Tu Tiên(18)"
        },
        {
            "data": "thatgiathienkim",
            "name": "Thật Giả Thiên Kim(18)"
        },
        {
            "data": "tuchan",
            "name": "Tu Chân(18)"
        },
        {
            "data": "linhdacchung",
            "name": "Lính Đặc Chủng(17)"
        },
        {
            "data": "daukhithegioi",
            "name": "Đấu Khí Thế Giới(17)"
        },
        {
            "data": "thanhthanluu",
            "name": "Thành Thần Lưu(17)"
        },
        {
            "data": "nhiethuyetsantruong",
            "name": "Nhiệt Huyết Sân Trường(17)"
        },
        {
            "data": "viencothanthoai",
            "name": "Viễn Cổ Thần Thoại(17)"
        },
        {
            "data": "ngabailuu",
            "name": "Ngả Bài Lưu(17)"
        },
        {
            "data": "docphi",
            "name": "Độc Phi(17)"
        },
        {
            "data": "thaituphi",
            "name": "Thái Tử Phi(17)"
        },
        {
            "data": "giakhong",
            "name": "Giá Không(17)"
        },
        {
            "data": "sieucapkhoahockythuat",
            "name": "Siêu Cấp Khoa Học Kỹ Thuật(16)"
        },
        {
            "data": "khongkimthuchi",
            "name": "Không Kim Thủ Chỉ(16)"
        },
        {
            "data": "chientranhgiuacachanhtinh",
            "name": "Chiến Tranh Giữa Các Hành Tinh(16)"
        },
        {
            "data": "chatgroup",
            "name": "Chat Group(16)"
        },
        {
            "data": "huyennghisuyluan",
            "name": "Huyền Nghi Suy Luận(16)"
        },
        {
            "data": "manhhe",
            "name": "Manh Hệ(16)"
        },
        {
            "data": "hoangthuc",
            "name": "Hoàng Thúc(16)"
        },
        {
            "data": "santruongsinhhoat",
            "name": "Sân Trường Sinh Hoạt(16)"
        },
        {
            "data": "mangbenminhluu",
            "name": "Mang Bên Mình Lưu(15)"
        },
        {
            "data": "thientai",
            "name": "Thiên Tài(15)"
        },
        {
            "data": "loraanhsangluu",
            "name": "Lộ Ra Ánh Sáng Lưu(15)"
        },
        {
            "data": "thoikhongvan",
            "name": "Thời Không Văn(14)"
        },
        {
            "data": "chiensi",
            "name": "Chiến Sĩ(14)"
        },
        {
            "data": "thiendinhvan",
            "name": "Thiên Đình Văn(14)"
        },
        {
            "data": "daiga",
            "name": "Đại Gả(14)"
        },
        {
            "data": "dilam",
            "name": "Đi Làm(14)"
        },
        {
            "data": "chuatri",
            "name": "Chữa Trị(14)"
        },
        {
            "data": "daccong",
            "name": "Đặc Công(14)"
        },
        {
            "data": "vuonggia",
            "name": "Vương Gia(14)"
        },
        {
            "data": "doithumotmatmotcon",
            "name": "Đối Thủ Một Mất Một Còn(14)"
        },
        {
            "data": "baochekhuyetdiem",
            "name": "Bao Che Khuyết Điểm(14)"
        },
        {
            "data": "hachoa",
            "name": "Hắc Hóa(14)"
        },
        {
            "data": "vuongtrieutranhba",
            "name": "Vương Triều Tranh Bá(13)"
        },
        {
            "data": "khoacu",
            "name": "Khoa Cử(13)"
        },
        {
            "data": "miengphao",
            "name": "Miệng Pháo(13)"
        },
        {
            "data": "nhagiaunhat",
            "name": "Nhà Giàu Nhất(13)"
        },
        {
            "data": "taichinh",
            "name": "Tài Chính(13)"
        },
        {
            "data": "benhkieu",
            "name": "Bệnh Kiều(13)"
        },
        {
            "data": "trungyluu",
            "name": "Trung Y Lưu(12)"
        },
        {
            "data": "daotac",
            "name": "Đạo Tặc(12)"
        },
        {
            "data": "cuongquoc",
            "name": "Cường Quốc(12)"
        },
        {
            "data": "phapsu",
            "name": "Pháp Sư(12)"
        },
        {
            "data": "trinhquan",
            "name": "Trinh Quán(12)"
        },
        {
            "data": "kyhuyenlichsu",
            "name": "Kỳ Huyễn Lịch Sử(12)"
        },
        {
            "data": "daisuhuynh",
            "name": "Đại Sư Huynh(12)"
        },
        {
            "data": "tieubinh",
            "name": "Tiểu Binh(12)"
        },
        {
            "data": "bachlienhoa",
            "name": "Bạch Liên Hoa(12)"
        },
        {
            "data": "thuanai",
            "name": "Thuần Ái(12)"
        },
        {
            "data": "lamdangiau",
            "name": "Làm Dân Giàu(12)"
        },
        {
            "data": "hiendaivohiep",
            "name": "Hiện Đại Võ Hiệp(11)"
        },
        {
            "data": "thuatsi",
            "name": "Thuật Sĩ(11)"
        },
        {
            "data": "maphapsantruong",
            "name": "Ma Pháp Sân Trường(11)"
        },
        {
            "data": "doatxa",
            "name": "Đoạt Xá(11)"
        },
        {
            "data": "thosan",
            "name": "Thợ Săn(11)"
        },
        {
            "data": "diemthe",
            "name": "Điềm Thê(11)"
        },
        {
            "data": "caolanh",
            "name": "Cao Lãnh(11)"
        },
        {
            "data": "hanmontude",
            "name": "Hàn Môn Tử Đệ(11)"
        },
        {
            "data": "vuamananh",
            "name": "Vua Màn Ảnh(11)"
        },
        {
            "data": "thangcap",
            "name": "Thăng Cấp(11)"
        },
        {
            "data": "yeutinhtinhduyen",
            "name": "Yêu Tinh Tình Duyên(11)"
        },
        {
            "data": "ngudai",
            "name": "Ngu Dại(11)"
        },
        {
            "data": "vidien",
            "name": "Vị Diện(11)"
        },
        {
            "data": "bacsi",
            "name": "Bác Sĩ(11)"
        },
        {
            "data": "thuoctinhluu",
            "name": "Thuộc Tính Lưu(10)"
        },
        {
            "data": "khangchien",
            "name": "Kháng Chiến(10)"
        },
        {
            "data": "khoahockythuattuchan",
            "name": "Khoa Học Kỹ Thuật Tu Chân(10)"
        },
        {
            "data": "namthan",
            "name": "Nam Thần(10)"
        },
        {
            "data": "nhathietke",
            "name": "Nhà Thiết Kế(10)"
        },
        {
            "data": "ramat",
            "name": "Ra Mắt(10)"
        },
        {
            "data": "phoma",
            "name": "Phò Mã(10)"
        },
        {
            "data": "khongnuchinh",
            "name": "Không Nữ Chính(10)"
        },
        {
            "data": "hikichtinh",
            "name": "Hí Kịch Tinh(10)"
        },
        {
            "data": "nuchinhmanhembe",
            "name": "Nữ Chính Manh Em Bé(10)"
        },
        {
            "data": "tongman",
            "name": "Tổng Mạn(10)"
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
