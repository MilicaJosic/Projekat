var http = require("http");
var fs = require("fs");
var svi_kontakti=[]

var pocetna = fs.readFileSync("index.html","utf8");
var appcss = fs.readFileSync("app.css","utf8");
var appjs = fs.readFileSync("app.js","utf8");
var pozadina = fs.readFileSync("background.jpg");

function prikaziPocetnuStranu(response){
  response.writeHead(200, {"Content-Type": "text/html"});
  fs.readFile("kontakti.txt", "utf8", function(error, text) {
       if (error)
          return;
        svi_kontakti = JSON.parse(text);
        var kontakti =""
        for(i=svi_kontakti.length-1;i>=0;i--){
          ime = svi_kontakti[i].ime
          prezime = svi_kontakti[i].prezime
          broj = svi_kontakti[i].broj
          email = svi_kontakti[i].email
          datum = svi_kontakti[i].datum
          kontakti += "<section> <h3>" + ime + "</h3>"
          kontakti += "<h3>" + prezime + "</h3>";  
          kontakti += "<h3>" + broj + "</h3>"; 
          kontakti += "<h3>" + email + "</h3>";
          kontakti += "<h3>" + datum + "</h3>"
        }
        pocetna = pocetna.replace("#kontakti#", kontakti)
  });
  response.end(pocetna);
} 

function nepoznatURL(response){
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<h1>Not Found</h1>");
  response.end();
}

function Upis(kontakti){
  console.log(kontakti);
  fs.writeFile("kontakti.txt", kontakti, function(err) {
        if (err)
          console.log("Failed to write file:", err);
        else
          console.log("File written.");
});
}

function OdgovorNaZahtev(request,response){
  switch(request.url) {
    case "/": 
    case "/index.html": 
              prikaziPocetnuStranu(response);
              break;
    case "/app.css":
              response.writeHead(200, {"Content-Type": "text/css"});
              response.end(appcss);
              break;
    case "/background.jpg":
              response.writeHead(200, {'Content-Type': 'image/jpg' });
              response.end(pozadina, 'binary');
              break;
    case "/app.js":
						  response.writeHead(200, {"Content-Type": "text/plain"});
	            response.end(appjs);
	            break;
    case "/noviKontakt":
              request.setEncoding('utf8');
              request.on('data', function (novi_kontakt) {
                svi_kontakti.push(JSON.parse(novi_kontakt));
                Upis(JSON.stringify(svi_kontakti));
                console.log(svi_kontakti);
                response.end(novi_kontakt);
              });
              break;
      default: 
	            nepoznatURL(response);
	            break;
	}
}

var port = process.env.PORT || 8005;
var server = http.createServer(OdgovorNaZahtev);
server.listen(port);
console.log("Server ceka zahteve na portu "+port);