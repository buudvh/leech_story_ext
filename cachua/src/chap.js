load("config.js");

function execute(url) {
  try {
    url = `${url}&tab=小说`;
    const response = fetch(url);
		if (!response.ok) throw new Error(`Status = ${response.status}`);
		const data = response.json();
    const content = data.data.content.split("\n").join("<br>");
    return Response.success(content);
  } catch (error) {
    return Response.error(`Url: ${url} \nMessage: ${error.message}`);
  }
}
