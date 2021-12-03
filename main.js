const http = require("http");

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>My First Page</title></head>");
    res.write(`<body>
  <h1>Salom Dunyo!</h1>
   </body`);
    res.write("</html>");
    res.end();
  } else {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>My First Page</title></head>");
    res.write(`<body>
  <h1>404 OPPS Not Pages!</h1>
   </body`);
    res.write("</html>");
    res.end();
  }
});

server.listen(3000, () => {
  console.log("server running ");
});

const peron = ()=>{
	console.log('ok');
}