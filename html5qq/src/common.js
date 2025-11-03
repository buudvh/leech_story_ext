function formatDate(date, format) {
    if (!(date instanceof Date)) {
        date = new Date(date);
        if (isNaN(date.getTime())) return '';
    }

    var map = {
        "yyyy": date.getFullYear(),
        "MM": ("0" + (date.getMonth() + 1)).slice(-2),
        "dd": ("0" + date.getDate()).slice(-2),
        "HH": ("0" + date.getHours()).slice(-2),
        "mm": ("0" + date.getMinutes()).slice(-2),
        "ss": ("0" + date.getSeconds()).slice(-2)
    };

    for (var key in map) {
        format = format.replace(new RegExp(key, "g"), map[key]);
    }

    return format;
}