/* Veritabanı bağlantısının yapıldığı dosyamız  */

// Mysql işlemlerini yapmamıza yarayan paket
let mysql = require('mysql2');

// veritabanına bağlanacak nesneyi döndürüyor
let connection = mysql.createConnection({
    host: '31.192.212.112',
    port:'3306',
    user: 'acilduru_admin',
    password: "Filmapp123.",
    database: 'acilduru_suco',
});
// veritabanı bağlantısını sağlıyor
    connection.connect();

setInterval(()=>{
    connection.query("SELECT * FROM kullanicilar");
},1000);


// bu bağlantıyı kullanmamız için dışarı veriyor
module.exports = connection;