//CONFIGURAMOS LAS VARIABLES DE ENTORNO
require('dotenv').config()
//HACEMOS USO DE EXPRESS - MYSQL
var express = require('express');
var mysl = require('mysql');
var cors = require('cors');

const puerto = process.env.PUERTO;
var app = express();
//para usar json
app.use(express.json());
//evitar bloqueos 
app.use(cors());

var conexion = mysl.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
});

conexion.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log('successful connection')
    }
});

//rutas
app.get('/', (req, res)=>{
    res.send("hola");
});

//mostrar todos los medicamentos
app.get('/api/medicamentos',(req, res)=>{
    conexion.query('SELECT * FROM medicamentos ORDER BY id DESC', (error, medicamentos)=>{
        if(error){
            console.log(error);
        }else{
            res.send(medicamentos);
            console.log("GET medicamentos");
        }
    });
});

//mostrar un solo medicamento 
app.get('/api/medicamentos/:id',(req, res)=>{
    conexion.query('SELECT * FROM medicamentos WHERE id = ?', [req.params.id] ,(error, medicamento)=>{
        if(error){
            console.log(error);
        }else{
            if(medicamento.length === 0){
                res.status(404);
                res.send({mens:'no existe ese medicamento'})
            }else{
                res.send(medicamento);
                console.log("GET medicamento");
            }
        }
    });
});

//agregar medicamentos
app.post('/api/medicamentos', (req, res)=>{
    let datos = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        foto: req.body.foto,
        stock: req.body.stock
    }

    let SQL= 'INSERT INTO medicamentos SET ?';
    conexion.query(SQL,datos, (error, result)=>{
        if(error){
            console.log(error);
        }else{
            res.send({mens:'medicamento agregado con exito'});
            console.log("POST medicamento")
        }
    });
});

//editar medicamento
app.put('/api/medicamentos/:id',(req, res)=>{
    let id = req.params.id;
    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let foto = req.body.foto;
    let stock = req.body.stock;
    let sql = 'UPDATE medicamentos SET nombre = ?, descripcion = ?, precio = ?, foto = ?, stock = ? WHERE id = ?';
    conexion.query(sql, [nombre, descripcion, precio, foto, stock, id], (error, resulta)=>{
        if(error){
            console.log(error);
        }else{
            res.send({mens:'medicamento editado con exito'});
            console.log("PUT medicamento ")
        }  
    });
});

//borrar medicamento
app.delete('/api/medicamentos/:id',(req, res)=>{
    conexion.query('DELETE FROM medicamentos WHERE id = ?',[req.params.id], (error, result)=>{
        if(error){
            console.log(error);
        }else{
            res.send({mens:'medicamento eliminado con exito'});
            console.log("DELETE medicamento ")
        }
    });
});

//servidor
app.listen(puerto || 3000, (req, res)=>{
    console.log("SERVER ON -- PORT: "+puerto);
});