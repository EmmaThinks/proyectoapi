//variables necesarias para poder usar las librerias de mysql, express y cors
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

//guardamos las funcionalidades de express en una constante llamada app
const app = express();
//definimos el puerto para usarlo al final del codigo
const port = 3000;

//usamos las funcionalidades de express y cors con app.use
app.use(cors());
app.use(express.json());


//autorizacion basica, la misma que hicimos en la clase
function Autorizar(req, res, next) {
  const F1 = req.headers.authorization;
    if(F1 === "A123") {
      next();
    } else {
      res.send("no tienes autorizacion");
    };
};

//esta variable no se que hace pero mejor no la tocamos por miedo a romper el codigo
var datos;

//establecemos "con" como una conexion al localhost de mysql y phpmyadmin
let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tienda"
});

//nos conectamos a la base de datos e imprimimos los objetos que tiene la unica tabla en la base de datos
con.connect((err) => {
  console.log("productos disponibles en la base de datos:");
  con.query("SELECT * FROM productos", (err, result,) => {
    if (err) throw err;
    console.log(result);
  });
});

//consulta para borrar una fila segun la id
app.delete('/delete', Autorizar, (req, res) => {

  //aqui nos traemos la id desde el lado del cliente y la usamos como referencia para borrar la fila que deseamos
  var id = req.body.id;
  con.query(`DELETE FROM productos WHERE id = ${id}`, 
    (err, result, fields) => {
    if (err) throw err;
    datos = result;
    console.log(datos);
  });
});

//consulta para editar una fila
app.patch('/edit', Autorizar, (req, res) => {


  //nos traemos los datos del lado del cliente y los usamos como los parametros que queremos editar en la base de datos
  var id = req.body.id;
  var nombre = req.body.nombre;
  var descripcion = req.body.descripcion;
  var precio = req.body.precio;
  var imagen = req.body.imagen;

  con.query(`UPDATE productos SET nombre = '${nombre}', descripcion = '${descripcion}', precio = ${precio}, imagen = '${imagen}' WHERE id = ${id}`, 
    (err, result) => {
    if (err) throw err;
    console.log(result) 
  });
});


//consulta para añadir productos a la base de datos
app.put('/add', Autorizar, (req, res) => {

  //de nuevo, nos traemos los datos del lado del cliente para saber que vamos a editar y los colocamos en variables para usarlas como los parametros que necesita la consulta
  var nombre = req.body.nombre;
  var descripcion = req.body.descripcion;
  var precio = req.body.precio;
  var imagen = req.body.imagen;

  con.query(`INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES('${nombre}','${descripcion}','${precio}','${imagen}')`, 
    (err, result) => {
    if (err) throw err;
    console.log(result);
  });

});


//obtenemos la informacion de la base de datos, desde la id hasta la imagen de la tabla productos para poder enviarla como json al cliente y que lo podamos usar
//como si fuera un arreglo de objetos
app.get(`/get`, Autorizar, (req, res) => {
  con.query(`SELECT id, nombre, descripcion, precio, imagen FROM productos`, 
    (err, result) => {
      if (err) throw err; 
      console.log(result);
      res.json(result);
    });
})


//funcion que nos avisa cuando el server prendio y en que puerto, para eso era la variable de puerto
app.listen(port, () => {
  console.log(`API lista en el puerto http://localhost:${port}`);
});