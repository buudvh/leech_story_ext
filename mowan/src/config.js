var BASE_URL = 'https://www.mowan.lol';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';
var SEARCH_PAGE_SIZE = 20;
var DISCOVER_PAGE_SIZE = 12;
var CN_NUM = '\\d０-９一二三四五六七八九十百千万零〇两';

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}

var API_URL = BASE_URL + '/api';
var LOGIN_URL = BASE_URL + '/user/login';
// Trang tĩnh cùng origin (không chạy SPA): đọc/ghi localStorage của trang mà không kích hoạt refresh/logout của SPA.
var STORAGE_PAGES = [BASE_URL + '/robots.txt', BASE_URL + '/user/favicon.png'];
var LOGIN_TITLE = 'Đăng nhập 魔丸小说';
// waitForReady của app chặn tối đa 60s mỗi lần ⇒ chờ đăng nhập bằng nhiều lượt.
var LOGIN_WAIT_MS = 180000;
// Cửa sổ đăng nhập vừa bị đóng/hết giờ thì không tự mở lại trong khoảng này (tránh mỗi chương tải về mở một cửa sổ).
var LOGIN_COOLDOWN_MS = 120000;

// Khoá localStorage của trang (SPA) và cookie mà SPA đòi phải có cùng token (thiếu là SPA tự đăng xuất).
var PAGE_ACCESS_KEY = 'novel_user_access_token';
var PAGE_REFRESH_KEY = 'novel_user_refresh_token';
var PAGE_USER_KEY = 'novel_user_user';
var PAGE_DEVICE_KEY = 'novel_user_device_id';
var PAGE_APP_KEY = 'novel_user_app_source';
var COOKIE_MAX_AGE = 315360000;

// Khoá localStorage của tiện ích.
var SESSION_KEY = 'mowan_session';
var BAD_ACCESS_KEY = 'mowan_bad_access';
var PROMPT_KEY = 'mowan_login_prompt';
// Mỗi lần chạy script chỉ mở cửa sổ đăng nhập tối đa một lần.
var MOWAN_PROMPTED = false;

// Mã lỗi của API (theo bundle của trang).
var AUTH_CODES = [40100, 40101, 40102];
var CODE_NO_PERMISSION = 40300;
var CODE_DEVICE_LIMIT = 40301;
var CODE_DAILY_LIMIT = 40304;
var CODE_GUEST_LIMIT = 40306;
var CODE_NOT_FOUND = 40400;

var LOGIN_REQUIRED_MESSAGE = '魔丸小说 bắt buộc đăng nhập và hiện chưa có phiên hợp lệ. Hãy đăng nhập trong cửa sổ trình duyệt tiện ích tự mở'
    + ' (hoặc tự mở ' + LOGIN_URL + ' bằng trình duyệt trong app), xong thì tải lại. Vừa đóng/hết giờ chờ thì khoảng '
    + Math.round(LOGIN_COOLDOWN_MS / 60000) + ' phút sau cửa sổ đăng nhập mới tự mở lại.';
var UNAVAILABLE_CHAPTER_MESSAGE = '本章节暂不可阅读。';
// Câu báo "không đọc được" mang nghĩa trả phí ⇒ trả câu báo như chương VIP; còn lại là lỗi tạm của nguồn.
var PAID_MESSAGE_RE = /VIP|付费|订阅|会员|购买|收费/i;
var EMPTY_CHAPTER_MESSAGE = '本章无内容。';

// ---------------- URL ----------------

function mowanEncode(value) {
    return encodeURIComponent(String(value == null ? '' : value));
}

// Tham số query của URL (SPA mã hoá dấu cách thành '+'). App có thể nối '/' vào cuối URL; id có '/' thật luôn được
// mã hoá thành %2F nên chỉ cắt '/' cuối của URL thô, không cắt từng giá trị.
function mowanQuery(url) {
    var result = {};
    var m, re = /[?&]([^=&#]+)=([^&#]*)/g;
    url = String(url).replace(/\/+$/, '');
    while ((m = re.exec(url)) !== null) {
        var value = m[2].replace(/\+/g, ' ');
        try {
            value = decodeURIComponent(value);
        } catch (error) {
            // Giữ nguyên nếu chuỗi mã hoá hỏng
        }
        result[m[1]] = value;
    }
    return result;
}

// Link chi tiết theo đúng route của SPA: /user/book?source=&book_id=&name=
function mowanBookUrl(source, bookId, name) {
    return BASE_URL + '/user/book?source=' + mowanEncode(source) + '&book_id=' + mowanEncode(bookId)
        + (name ? '&name=' + mowanEncode(name) : '');
}

function mowanBookRef(url) {
    var q = mowanQuery(url);
    if (!q.source || !q.book_id) return null;
    return { source: q.source, bookId: q.book_id, name: q.name || q.book_name || '' };
}

// Link chương theo route đọc của SPA: /user/reader?source=&book_id=&chapter_id=&book_name=
function mowanChapterUrl(source, bookId, chapterId, bookName) {
    return BASE_URL + '/user/reader?source=' + mowanEncode(source) + '&book_id=' + mowanEncode(bookId)
        + '&chapter_id=' + mowanEncode(chapterId) + (bookName ? '&book_name=' + mowanEncode(bookName) : '');
}

function mowanChapterRef(url) {
    var q = mowanQuery(url);
    if (!q.source || !q.chapter_id) return null;
    return { source: q.source, bookId: q.book_id || '', chapterId: q.chapter_id, bookName: q.book_name || q.name || '' };
}

function mowanQueryString(params) {
    var parts = [];
    for (var key in params) {
        if (!params.hasOwnProperty(key)) continue;
        var value = params[key];
        if (value === undefined || value === null || value === '') continue;
        parts.push(mowanEncode(key) + '=' + mowanEncode(value));
    }
    return parts.length ? '?' + parts.join('&') : '';
}

// ---------------- Phiên đăng nhập ----------------

function mowanValidSession(s) {
    // Không bao giờ tự sinh mã thiết bị: gói miễn phí chỉ cho 1 thiết bị, mã mới = thiết bị thứ hai.
    return !!(s && s.access && s.device);
}

function mowanCachedSession() {
    try {
        var s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
        return mowanValidSession(s) ? s : null;
    } catch (error) {
        return null;
    }
}

function mowanSaveSession(s) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ access: s.access, refresh: s.refresh || '', device: s.device, app: s.app || '' }));
    localStorage.removeItem(BAD_ACCESS_KEY);
}

// Token đã thử hết cách (refresh hỏng): nhớ lại để lần sau không gọi API vô ích với nó.
function mowanForgetSession(access) {
    localStorage.removeItem(SESSION_KEY);
    if (access) localStorage.setItem(BAD_ACCESS_KEY, access);
}

function mowanBadAccess() {
    return localStorage.getItem(BAD_ACCESS_KEY) || '';
}

// Script chạy trong trang: trả JSON (callJs của app trả chuỗi). Chỉ dùng localStorage/JSON — sessionStorage/location có thể không có.
function mowanReadScript() {
    return '(function(){try{'
        + 'var app="";try{if(typeof sessionStorage!=="undefined")app=sessionStorage.getItem(' + JSON.stringify(PAGE_APP_KEY) + ')||"";}catch(e){}'
        + 'return JSON.stringify({ok:true,host:typeof location!=="undefined"?String(location.host):null,'
        + 'access:localStorage.getItem(' + JSON.stringify(PAGE_ACCESS_KEY) + ')||"",'
        + 'refresh:localStorage.getItem(' + JSON.stringify(PAGE_REFRESH_KEY) + ')||"",'
        + 'device:localStorage.getItem(' + JSON.stringify(PAGE_DEVICE_KEY) + ')||"",app:app});'
        + '}catch(e){return JSON.stringify({ok:false,error:String(e)});}})()';
}

// {ok, session}: ok = đọc được localStorage của đúng trang; session = null nếu trang chưa đăng nhập.
function mowanReadBrowser(browser) {
    var raw = '';
    try {
        raw = browser.callJs(mowanReadScript(), 0);
    } catch (error) {
        return { ok: false, session: null };
    }
    var r = null;
    try {
        r = JSON.parse(String(raw || ''));
    } catch (error) {
        return { ok: false, session: null };
    }
    // host null = môi trường không có location (khung chạy thử); "" = about:blank khi trang không tải được.
    if (!r || !r.ok || (r.host != null && !/(^|\.)mowan\.lol$/.test(r.host))) return { ok: false, session: null };
    var s = { access: r.access, refresh: r.refresh, device: r.device, app: r.app };
    return { ok: true, session: mowanValidSession(s) ? s : null };
}

// Đọc phiên của trang bằng trình duyệt ẩn (kho WebKit chung với trình duyệt trong app).
function mowanPageSession() {
    for (var i = 0; i < STORAGE_PAGES.length; i++) {
        var browser = Engine.newBrowser();
        try {
            browser.launch(STORAGE_PAGES[i], 15000);
            var result = mowanReadBrowser(browser);
            if (result.ok) return result.session;
        } finally {
            browser.close();
        }
    }
    return null;
}

// Ghi token mới vào trang như SPA làm sau khi refresh (localStorage + 2 cookie), để phiên của trình duyệt không hỏng
// khi refresh token xoay vòng. Trang đã có phiên khác (đăng nhập lại/SPA tự refresh) thì không đè.
function mowanWriteBack(oldRefresh, s, user) {
    var cookieTail = '; path=/; max-age=' + COOKIE_MAX_AGE + '; SameSite=Lax; Secure';
    var script = '(function(){try{'
        + 'var cur=localStorage.getItem(' + JSON.stringify(PAGE_REFRESH_KEY) + ')||"";'
        + 'if(cur&&cur!==' + JSON.stringify(oldRefresh || '') + ')return "skip";'
        + 'var device=localStorage.getItem(' + JSON.stringify(PAGE_DEVICE_KEY) + ')||' + JSON.stringify(s.device) + ';'
        + 'localStorage.setItem(' + JSON.stringify(PAGE_ACCESS_KEY) + ',' + JSON.stringify(s.access) + ');'
        + 'localStorage.setItem(' + JSON.stringify(PAGE_REFRESH_KEY) + ',' + JSON.stringify(s.refresh || '') + ');'
        + (user ? 'localStorage.setItem(' + JSON.stringify(PAGE_USER_KEY) + ',' + JSON.stringify(JSON.stringify(user)) + ');' : '')
        + 'document.cookie="Authorization="+encodeURIComponent("Bearer "+' + JSON.stringify(s.access) + ')+' + JSON.stringify(cookieTail) + ';'
        + 'document.cookie="X-Device-ID="+encodeURIComponent(device)+' + JSON.stringify(cookieTail) + ';'
        + 'return "ok";}catch(e){return "error: "+e;}})()';
    var browser = Engine.newBrowser();
    try {
        browser.launch(STORAGE_PAGES[0], 15000);
        var result = String(browser.callJs(script, 0) || '');
        if (result != 'ok') console.log('Không ghi được phiên vào trang: ' + (result || 'trang không phản hồi'));
    } catch (error) {
        console.log('Không ghi được phiên vào trang: ' + error.message);
    } finally {
        browser.close();
    }
}

function mowanSession() {
    var s = mowanCachedSession();
    if (s) return s;
    var bad = mowanBadAccess();
    s = mowanPageSession();
    if (s && s.access != bad) {
        mowanSaveSession(s);
        s.fromPage = true;
        return s;
    }
    s = mowanPromptLogin(s ? s.access : bad);
    if (s) return s;
    throw new Error(LOGIN_REQUIRED_MESSAGE);
}

// Phiên khác phiên đang dùng mà executor khác (cache) hoặc trang (người dùng/SPA) vừa có.
function mowanNewerSession(current, checkPage) {
    var bad = mowanBadAccess();
    var cached = mowanCachedSession();
    if (cached && cached.access != current.access && cached.access != bad) return cached;
    if (!checkPage) return null;
    var page = mowanPageSession();
    if (page && page.access != current.access && page.access != bad) {
        mowanSaveSession(page);
        return page;
    }
    return null;
}

// Làm mới access token đúng như SPA: POST /auth/refresh {refresh_token}. null = refresh token không còn dùng được.
function mowanRefresh(s) {
    if (!s.refresh) return null;
    var headers = mowanHeaders(s);
    headers['Content-Type'] = 'application/json';
    var json = mowanFetchJson(API_URL + '/auth/refresh', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ refresh_token: s.refresh }),
        timeout: 20000
    });
    if (json.code == 0 && json.data && json.data.access_token) {
        var fresh = { access: json.data.access_token, refresh: json.data.refresh_token || s.refresh, device: s.device, app: s.app };
        mowanSaveSession(fresh);
        mowanWriteBack(s.refresh, fresh, json.data.user);
        return fresh;
    }
    if (mowanIsAuthCode(json.code) || json.code == 400 || json.code == 401 || (json.code >= 40000 && json.code < 40100)) return null;
    throw new Error(mowanErrorMessage(json));
}

function mowanPromptState() {
    try {
        return JSON.parse(localStorage.getItem(PROMPT_KEY) || '{}') || {};
    } catch (error) {
        return {};
    }
}

// Probe của waitForReady phải trả chuỗi JSON {ready}; sẵn sàng = có token MỚI (khác token vừa bị từ chối).
function mowanLoginProbe(badAccess) {
    return '(function(){var t="";try{t=localStorage.getItem(' + JSON.stringify(PAGE_ACCESS_KEY) + ')||"";}catch(e){}'
        + 'return JSON.stringify({ready:t!==""&&t!==' + JSON.stringify(badAccess || '') + ',chars:t.length,encoded:0});})()';
}

function mowanWaitLogin(browser, badAccess) {
    var probe = mowanLoginProbe(badAccess);
    var deadline = Date.now() + LOGIN_WAIT_MS;
    while (Date.now() < deadline) {
        var r = browser.waitForReady(probe, Math.min(60000, Math.max(1000, deadline - Date.now())), 500, 1) || {};
        if (r.ready) {
            // Không tin cờ ready: đọc lại token và kiểm tra (phải đọc trước khi đóng cửa sổ).
            var s = mowanReadBrowser(browser).session;
            return s && s.access != badAccess ? s : null;
        }
        // Người dùng đóng cửa sổ.
        if (r.cancelled || /not found/i.test(String(r.reason || ''))) return null;
        // Hết lượt 60s hoặc lỗi tạm khi trang đang chuyển trang ⇒ chờ tiếp.
        sleep(500);
    }
    return null;
}

// Executor khác đang mở cửa sổ đăng nhập: chờ phiên nó lưu thay vì mở cửa sổ thứ hai.
function mowanWaitOtherPrompt(state, badAccess) {
    var deadline = state.start + LOGIN_WAIT_MS + 20000;
    while (Date.now() < deadline) {
        var cached = mowanCachedSession();
        if (cached && cached.access != badAccess) return cached;
        var now = mowanPromptState();
        if (now.start != state.start || now.end) {
            cached = now.ok ? mowanCachedSession() : null;
            return cached && cached.access != badAccess ? cached : null;
        }
        sleep(2000);
    }
    return null;
}

// Mở trình duyệt hiện cho người dùng TỰ đăng nhập trên trang. Tiện ích không bao giờ hỏi hay lưu mật khẩu.
function mowanPromptLogin(badAccess) {
    if (MOWAN_PROMPTED) return null;
    MOWAN_PROMPTED = true;
    var state = mowanPromptState();
    var now = Date.now();
    if (state.start && !state.end && now - state.start < LOGIN_WAIT_MS + 20000) return mowanWaitOtherPrompt(state, badAccess);
    if (state.end && !state.ok && now - state.end < LOGIN_COOLDOWN_MS) return null;

    localStorage.setItem(PROMPT_KEY, JSON.stringify({ start: now }));
    var session = null;
    var browser = null;
    try {
        browser = Engine.newVisibleBrowser(LOGIN_TITLE);
        browser.launchAsync(LOGIN_URL);
        session = mowanWaitLogin(browser, badAccess);
        // Lưu phiên trước khi ghi trạng thái kết thúc: executor đang chờ thấy "xong" là đọc được phiên ngay.
        if (session) mowanSaveSession(session);
    } finally {
        if (browser) {
            try {
                browser.close();
            } catch (error) {
                // Cửa sổ đã đóng
            }
        }
        localStorage.setItem(PROMPT_KEY, JSON.stringify({ start: now, end: Date.now(), ok: !!session }));
    }
    return session;
}

// ---------------- Gọi API ----------------

function mowanHeaders(s) {
    var headers = { 'Accept': 'application/json, text/plain, */*', 'X-Device-ID': s.device };
    if (s.access) headers['Authorization'] = 'Bearer ' + s.access;
    if (s.app) headers['X-App'] = s.app;
    return headers;
}

function mowanIsAuthCode(code) {
    return AUTH_CODES.indexOf(Number(code)) != -1;
}

// Đọc thân phản hồi bất kể mã HTTP (401 vẫn có {code:40100}). Browser ẩn dự phòng của app (403/429/503) trả trang
// có JSON lẫn trong HTML ⇒ thử cắt đoạn {...}.
function mowanFetchJson(url, options) {
    var response = fetch(url, options);
    var status = Number(response.status) || 0;
    var text = '';
    try {
        text = String(response.text() || '');
    } catch (error) {
        text = '';
    }
    var json = null;
    try {
        json = JSON.parse(text);
    } catch (error) {
        var start = text.indexOf('{'), end = text.lastIndexOf('}');
        if (start != -1 && end > start) {
            try {
                json = JSON.parse(text.substring(start, end + 1).replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
            } catch (error2) {
                json = null;
            }
        }
    }
    if (json && typeof json == 'object' && 'code' in json) {
        json.httpStatus = status;
        return json;
    }
    if (status == 401) return { code: 40100, message: '登录已过期', httpStatus: status };
    if (status == 403) return { code: CODE_NO_PERMISSION, message: '没有权限', httpStatus: status };
    if (status == 429) return { code: 42900, message: '操作过于频繁', httpStatus: status };
    if (status == 0 || status >= 500) throw new Error('Không kết nối được ' + BASE_URL + ' (HTTP ' + status + '). Kiểm tra mạng rồi thử lại.');
    throw new Error('Phản hồi lạ từ API (HTTP ' + status + ')');
}

function mowanRequest(path, params, s, timeout) {
    return mowanFetchJson(API_URL + path + mowanQueryString(params || {}), {
        method: 'GET',
        headers: mowanHeaders(s),
        timeout: timeout || 30000
    });
}

function mowanErrorMessage(json) {
    var code = Number(json && json.code);
    var server = json && json.message ? ' (服务器: ' + json.message + ')' : '';
    if (mowanIsAuthCode(code) || code == CODE_GUEST_LIMIT) return LOGIN_REQUIRED_MESSAGE + server;
    if (code == CODE_DEVICE_LIMIT) {
        return 'Tài khoản 魔丸小说 đang đăng nhập quá số thiết bị cho phép (gói miễn phí: 1 thiết bị). Mở '
            + BASE_URL + '/user/me/devices (我的 › 设备管理) bằng trình duyệt trong app, gỡ thiết bị cũ rồi thử lại.' + server;
    }
    if (code == CODE_DAILY_LIMIT) {
        return 'Đã hết hạn mức chương hôm nay của nguồn này (gói miễn phí: 200 chương/ngày, tính riêng từng nguồn, '
            + 'chương tải trước cũng tính). Mai đọc tiếp hoặc chọn nguồn khác.' + server;
    }
    if (code >= 42900 && code <= 42999) {
        return 'Trang đang giới hạn tần suất lấy chương (gửi yêu cầu quá nhanh). Đợi một lúc rồi thử lại; khi tải truyện hãy dùng 1 luồng và tăng thời gian nghỉ.' + server;
    }
    if (code == CODE_NO_PERMISSION) return 'Tài khoản không có quyền với nội dung này.' + server;
    if (code == CODE_NOT_FOUND) return 'API không tồn tại, có thể trang đã đổi giao diện.' + server;
    return 'API lỗi ' + code + server;
}

function mowanData(json) {
    if (json && json.code == 0) return json.data;
    throw new Error(mowanErrorMessage(json));
}

// Gọi API cần đăng nhập. Gặp lỗi phiên: thử phiên mới hơn ở cache/trang → refresh một lần → đọc lại → mở trình duyệt
// đăng nhập một lần. Mỗi bước tối đa một lần nên không lặp vô hạn.
function mowanApi(path, params, timeout) {
    var session = mowanSession();
    var json = mowanRequest(path, params, session, timeout);
    if (!mowanNeedsLogin(json)) return mowanData(json);

    var fresh = mowanNewerSession(session, !session.fromPage);
    if (fresh) {
        session = fresh;
        json = mowanRequest(path, params, session, timeout);
        if (!mowanNeedsLogin(json)) return mowanData(json);
    }

    // 40306 (hết lượt khách) = server không nhận phiên ⇒ refresh không giúp gì.
    if (mowanIsAuthCode(json.code)) {
        var refreshed = mowanRefresh(session);
        if (refreshed) {
            session = refreshed;
            json = mowanRequest(path, params, session, timeout);
            if (!mowanNeedsLogin(json)) return mowanData(json);
        } else {
            // Refresh hỏng có thể do executor khác vừa xoay vòng token ⇒ đọc lại một lần nữa.
            fresh = mowanNewerSession(session, true);
            if (fresh) {
                session = fresh;
                json = mowanRequest(path, params, session, timeout);
                if (!mowanNeedsLogin(json)) return mowanData(json);
            }
        }
    }

    mowanForgetSession(session.access);
    var login = mowanPromptLogin(session.access);
    if (login) {
        json = mowanRequest(path, params, login, timeout);
        if (!mowanNeedsLogin(json)) return mowanData(json);
        mowanForgetSession(login.access);
    }
    throw new Error(mowanErrorMessage(json));
}

function mowanNeedsLogin(json) {
    return mowanIsAuthCode(json.code) || json.code == CODE_GUEST_LIMIT;
}

// ---------------- Dữ liệu ----------------

function cleanText(text) {
    return String(text == null ? '' : text).replace(/[\s　 ]+/g, ' ').trim();
}

// Loại nội dung: novel | audio | image | video (giá trị lạ coi là novel, như SPA).
function mowanType(type) {
    var t = String(type || '').trim().toLowerCase();
    return t == 'audio' || t == 'image' || t == 'video' ? t : 'novel';
}

function mowanTypeName(type) {
    return { audio: 'audio', image: 'truyện tranh', video: 'video' }[mowanType(type)] || 'truyện chữ';
}

function mowanCover(src) {
    src = String(src || '').trim();
    if (!src) return DEFAULT_COVER;
    if (src.startsWith('//')) return 'https:' + src;
    if (src.startsWith('/')) return BASE_URL + src;
    return src;
}

function mowanItems(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.items || data.list || data.books || [];
}

function mowanItemId(item) {
    return item && (item.id != null && item.id !== '' ? item.id : item.book_id);
}

function mowanItemInfo(item) {
    return [
        cleanText(item.author) || '佚名',
        cleanText(item.category),
        cleanText(item.status),
        item.chapters_count ? item.chapters_count + '章' : '',
        item.source ? '来源: ' + cleanText(item.source) : ''
    ].filter(function (x) { return x; }).join(' · ');
}

// Item danh sách (tìm kiếm/khám phá) ⇒ item của app; bỏ audio/truyện tranh/video.
function mowanBookItem(item) {
    if (!item || !item.source || mowanItemId(item) == null || mowanType(item.type) != 'novel') return null;
    var name = cleanText(item.name || item.title || item.book_name);
    if (!name) return null;
    var intro = cleanText(item.description || item.intro);
    return {
        name: name,
        link: mowanBookUrl(item.source, mowanItemId(item), name),
        cover: mowanCover(item.cover),
        description: mowanItemInfo(item) + (intro ? '\n' + intro : ''),
        host: BASE_URL
    };
}

function mowanBookItems(list) {
    var data = [];
    (list || []).forEach(function (item) {
        var book = mowanBookItem(item);
        if (book) data.push(book);
    });
    return data;
}

// Chuyên mục Khám phá: mục có section=true là tiêu đề nhóm, các mục sau thuộc nhóm đó (như SPA).
function mowanTabEntries(source, sourceName, tabs) {
    var list = [];
    var section = '';
    (tabs || []).forEach(function (t) {
        if (!t) return;
        if (t.section) {
            section = cleanText(t.title);
            return;
        }
        if (t.key == null || t.key === '') return;
        list.push({
            title: [cleanText(sourceName), section, cleanText(t.title || t.key)].filter(function (x) { return x; }).join(' · '),
            input: 'source=' + mowanEncode(source) + '&tab=' + mowanEncode(t.key),
            script: 'gen.js'
        });
    });
    return list;
}

function isTrue(value) {
    return value === true || value === 1 || String(value) == 'true' || String(value) == '1';
}

// API mục lục hiện không có cờ khoá; kiểm vài tên trường khả dĩ phòng khi trang bật thu phí.
function mowanChapterLocked(chapter) {
    return isTrue(chapter.vip) || isTrue(chapter.is_vip) || isTrue(chapter.locked) || isTrue(chapter.is_locked)
        || isTrue(chapter.pay) || isTrue(chapter.is_pay) || isTrue(chapter.need_pay) || parseFloat(chapter.price || '0') > 0;
}

// ---------------- Dọn tên chương ----------------

// Ghi chú trong ngoặc vuông chỉ gồm các mẩu: 第三更/加更/二合一/4K/六千字/万字/求月票/VIP... (ngăn bởi dấu câu).
var NAME_NOTE_TOKEN = '(第?[' + CN_NUM + ']+更(完毕|到)?|[' + CN_NUM + ']*(推荐票|月票|打赏)?[加补爆]更[' + CN_NUM + ']*'
    + '|[' + CN_NUM + ']*章?合[一二]|[\\d.]+\\s*[kK](字|小章|大章)?|[' + CN_NUM + ']+千?字|万字(大章)?|大章'
    + '|求(订阅|月票|推荐票?|收藏|票票?|打赏|追读|首订|支持|关注|评论|投资|保底月票)|月票|推荐票|打赏|订阅'
    + '|VIP|(本章)?免费|限免|new|热|hot)';
var NAME_NOTE_RE = new RegExp('^[\\s，,、！!。.~～+]*' + NAME_NOTE_TOKEN + '([\\s，,、！!。.~～+]*' + NAME_NOTE_TOKEN + ')*[\\s，,、！!。.~～+]*$', 'i');

// Ngoặc tròn chứa lời xin phiếu/cảm ơn/thêm chương ⇒ rác; ngoặc khác ((上), (一), (大结局)…) là một phần tên chương.
var JUNK_NAME_PAREN = /\s*[（(][^（）()]*(求|加更|[一二三四五六七八九十\d]+更|月票|推荐票|打赏|盟主|感谢|谢谢)[^（）()]*[）)]/g;
// formatName cắt từ dấu ngoặc tròn ⇒ tạm đổi ngoặc sang ký tự riêng để giữ phần ngoặc còn lại.
var PAREN_FULL = String.fromCharCode(0xE000);
var PAREN_HALF = String.fromCharCode(0xE001);

function cleanChapterName(name) {
    var raw = cleanText(name);
    var text = raw;
    // Nhãn VIP/免费/限免/new/热 trong ngoặc, hoặc đứng riêng ở đầu/cuối tên.
    text = text.replace(/[【\[（(〔]\s*(VIP|免费|限免|new|热|hot)\s*[】\]）)〕]/gi, ' ');
    text = text.replace(/^(VIP|免费|限免|new)\s+/i, '').replace(/\s+(VIP|免费|限免|new)$/i, '');
    // Ghi chú cập nhật/xin phiếu trong 【】/[] (formatName chỉ cắt ở ngoặc tròn): 【第一更！】, [求订阅]...
    text = text.replace(/[【\[]([^】\]]*)[】\]]/g, function (m, inner) {
        return NAME_NOTE_RE.test(inner) ? ' ' : m;
    });
    // Lỗi gõ "弟2843章" → "第2843章".
    text = text.replace(new RegExp('^弟(\\s*[' + CN_NUM + ']+\\s*章)'), '第$1');
    // "1.第1章 ..." / "12、第12章 ..." → bỏ số thứ tự thừa ("125.第一军校" giữ nguyên).
    text = text.replace(new RegExp('^\\d+\\s*[.、．:：]\\s*(?=第\\s*[' + CN_NUM + ']+\\s*[章节回])'), '');
    // Số chương lặp: "第1章 第1章 xxx", "第一章第一章xxx".
    text = text.replace(new RegExp('^(第\\s*[' + CN_NUM + ']+\\s*[章节回])\\s*\\1\\s*'), '$1 ');
    // "第1358章尾声" → "第1358章 尾声".
    text = text.replace(new RegExp('^(第\\s*[' + CN_NUM + ']+\\s*[章节回])(?=[^\\s：:，,、.．\\-—])'), '$1 ');
    text = cleanText(text.replace(JUNK_NAME_PAREN, ''));
    // formatName bỏ số đầu tên ở "第1章 1xxx" ⇒ "第2章 2008年" sẽ thành "008年"; gặp dạng đó thì không gọi.
    if (!/^第(\d+)章\s+\1\d/.test(text)) {
        text = formatName(text.replace(/（/g, PAREN_FULL).replace(/\(/g, PAREN_HALF))
            .split(PAREN_FULL).join('（').split(PAREN_HALF).join('(');
    }
    // formatName cắt ở "求月票"... có thể để lại dấu phẩy treo: "四更，求月票" → "四更，".
    text = cleanText(text).replace(/[\s，,、：:；;]+$/, '');
    return text || raw;
}

// ---------------- Dọn nội dung chương ----------------

// Đoạn rác: so khớp cả đoạn (đã trim). Nội dung lấy từ nhiều trang nguồn nên có cả watermark kiểu trang lậu.
var JUNK_PARAGRAPH_PATTERNS = [
    /^[（(【\[]?\s*(本章完|本章结束|未完待续|待续)\s*[）)】\]]?[。.…!！~～]*$/,
    /^[（(]?\s*本章未完[，,。.!！\s]*(请|请您)?(点击|点|翻)?(下一页|下页)?(继续阅读|继续)?[^一-龥]*[）)]?$/,
    /^[\s\-—=*>《<]*(上一章|下一章|上一页|下一页|返回目录|章节目录|目录|返回书页|加入书签|章节报错|投推荐票|返回列表)([\s|｜\/·←→\-—]*(上一章|下一章|上一页|下一页|返回目录|章节目录|目录|返回书页|加入书签|章节报错|投推荐票|返回列表))*[\s\-—=*>》<]*$/,
    /^(https?:\/\/|www\.)\S+$/i,
    // Cả đoạn chỉ là lời xin phiếu trong ngoặc: "（求收藏，求推荐票）" ("【求生任务…】" vẫn giữ).
    /^[（(【\[]\s*求(收藏|推荐|月票|订阅|票|追读|打赏|评论|投资|首订|支持|关注)[^）)】\]]*[）)】\]]$/,
    // Cả đoạn là lời giới thiệu truyện khác: "（推荐xx的新书《…》）".
    /^[（(]\s*(推荐|推一本|推本|推书)[^）)]*(新书|《)[^）)]*[）)]$/,
    /^([请记得欢迎大家多多]*(求收藏|求推荐票?|求月票|求打赏|求订阅|求追读|加入书架|放入书架|投推荐票|投月票)[!！。~～、，,\s]*)+$/
];
// Chỉ xét đoạn ngắn (≤ 80 ký tự): câu truyện bình thường không chứa các mốc quảng bá này.
var JUNK_SHORT_PATTERNS = [
    /一秒记住|天才一秒|秒记住|记住本站|首发域名|请记住.{0,12}(网址|域名|本站)|收藏本站|本站网址|无弹窗|章节错误.{0,8}点此/,
    /最快更新.{0,20}(最新章节|无错|全文|首发)|手机(版|用户)(请)?(阅读|浏览|访问)|手机阅读(网址|地址)/,
    /魔丸小说|mowan\.lol/i,
    /[ｗw]{3}\s*[．。]\s*\S{2,20}\s*[．。]\s*(ｃｏｍ|ｎｅｔ|ｃｃ|ｌａ|com|net|cc|la)/i
];
// Tên miền (latin) trong đoạn ngắn kèm từ quảng bá ⇒ watermark của trang nguồn.
var DOMAIN_RE = /(www\.|m\.|wap\.)?[a-z0-9\-]{2,}\.(com|net|org|cc|la|co|info|xyz|top|vip|lol|tw|cn|me)\b/i;
var PROMO_RE = /笔趣|小说|阅读|更新|章节|首发|记住|网址|域名|书友|收藏|最新|免费|手机|本站|访问|搜索/;

function isJunkParagraph(text) {
    for (var i = 0; i < JUNK_PARAGRAPH_PATTERNS.length; i++) {
        if (JUNK_PARAGRAPH_PATTERNS[i].test(text)) return true;
    }
    // Lời nhắn PS của tác giả xin phiếu/mời vào nhóm.
    if (/^p\.?\s*s\.?\s*[:：.,，]/i.test(text) && /求|书友群|QQ群|读者群|群号|月票|推荐票|订阅|打赏|追读|收藏/.test(text)) return true;
    // Quảng cáo nhóm đọc giả kèm số nhóm.
    if (/(书友群|QQ群|读者群|粉丝群|群号)\s*[:：]?\s*[【\[（(]?\s*\d{5,}/.test(text)) return true;
    if (text.length > 80) return false;
    for (var j = 0; j < JUNK_SHORT_PATTERNS.length; j++) {
        if (JUNK_SHORT_PATTERNS[j].test(text)) return true;
    }
    return DOMAIN_RE.test(text) && PROMO_RE.test(text);
}

function decodeEntities(text) {
    return text
        .replace(/&nbsp;/gi, ' ')
        .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#0?39;|&apos;/gi, "'")
        .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
        .replace(/&#x([0-9a-f]+);/gi, function (m, n) { return String.fromCharCode(parseInt(n, 16)); })
        .replace(/&amp;/gi, '&');
}

function normalizeTitle(text) {
    return String(text || '').replace(/[\s　 （）()【】\[\]！!？?，,。.：:、…·—\-]+/g, '');
}

// Dòng đầu là tiêu đề chương lặp lại: trùng title của API, hoặc dòng ngắn dạng "第八百零八章 莫崖".
function isHeadingParagraph(text, title) {
    var first = normalizeTitle(text);
    var name = normalizeTitle(title);
    if (name && first && (first == name || (first.length >= 4 && name.indexOf(first) == 0) || (name.length >= 4 && first.indexOf(name) == 0 && first.length - name.length <= 4))) return true;
    if (text.length > 40 || /[。“”"]/.test(text)) return false;
    return new RegExp('^(第\\s*[' + CN_NUM + ']+\\s*[章节回]|[\\d０-９]+\\s*章)').test(text);
}

// Đoạn văn của API ([{text, image}], hoặc chuỗi) ⇒ mảng dòng đã dọn. Đoạn ảnh minh hoạ bị bỏ (reader của app là chữ).
function cleanChapterLines(content) {
    var parts = [];
    var paragraphs = content && content.paragraphs;
    if (Array.isArray(paragraphs)) {
        paragraphs.forEach(function (p) {
            if (p == null) return;
            if (typeof p == 'string') parts.push(p);
            else if (p.text) parts.push(String(p.text));
            else if (p.content) parts.push(String(p.content));
        });
    } else if (content && typeof content.content == 'string') {
        parts.push(content.content);
    } else if (content && typeof content.text == 'string') {
        parts.push(content.text);
    }

    var lines = [];
    parts.forEach(function (part) {
        var text = decodeEntities(part.replace(/<br\s*\/?>|<\/p>/gi, '\n').replace(/<\/?[a-z][^>]*>/gi, ''));
        text = text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f​﻿]/g, '');
        // Ghi chú cuối đoạn: "...（未完待续）", "(本章完)".
        text = text.replace(/[（(]\s*(未完待续|本章完)\s*[）)]/g, '');
        text.split(/\r?\n/).forEach(function (line) {
            line = line.replace(/^[\s　 ]+|[\s　 ]+$/g, '');
            if (!line || isJunkParagraph(line)) return;
            // Dấu < > trần sẽ bị hiểu là thẻ HTML.
            lines.push(line.replace(/</g, '＜').replace(/>/g, '＞'));
        });
    });
    if (lines.length && isHeadingParagraph(lines[0], content && content.title)) lines.shift();
    return lines;
}
