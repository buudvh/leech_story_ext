let BASE_URL = "https://fanqienovel.com";
const API_URL = "https://qkfqapi.vv9v.cn/api";
const STV_HOST = "https://sangtacviet.app";
const IGNORES = [
  "nhanh xuyên",
  "ngôn tình",
  "ác nữ"
].join(",");

try {
  if (CONFIG_URL) {
    BASE_URL = CONFIG_URL;
  }
} catch { }