function execute() {
    return Response.success([
        { title: "Update", input: "", script: "lastupdate.js" },
        { title: "New", input: "", script: "lastadd.js" },
    ]);
}