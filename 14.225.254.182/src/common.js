function tag(title, host, sort, tag) {
    var input = `${BASE_URL}/io/searchtp/searchBooks?find=&host=${host}&minc=0&sort=${sort}&tag=${tag}&p={0}`;
    return { title: title, input: input, script: "homecontent.js" };
}