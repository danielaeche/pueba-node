const inquirer = require ("inquirer");// modulo instalado de terceros
const fs = require('fs') //modulo nativo
const rutaArchivo= __dirname + '/pedidos.json'
let pedidos= fs.readFileSync(rutaArchivo, {encoding: 'utf8'});
pedidos= JSON.parse(pedidos)

//console.log(pedidos);

let opciones = [
    {
        name: 'nombre',
        type: 'input',
        message:'Ingresa tu nombre',
        validate: function (respuesta){
            if (respuesta.length < 1){
                return 'Dejanos saber tu nombre';
            }
            return true
        }
     
    },
    {
        name: 'telefono',
        type:'input',
        message:'Ingresa tu numero de telefono',
       // validate: function (respuesta){
       //     if (typeOf respuesta){
         //       return 'Dejanos saber tu telefono';
          //  }
         //   return true
       // }
    },
    {
        name: 'gusto',
        type: 'rawlist',
        message:'Elegi el gusto de la pizza',
        choices: ['muzzarella', 'jamon y morrones', 'calabresa', '4 quesos']
        },
    {
        name:'tamano',
        type:'list',
        message:'Elegi el tamano de la pizza',
        choices: ['personal', 'mediana', 'grande'],
    },
    {
        name: 'conBebida',
        type: 'confirm',
        default: false,
        
    },
    {
        name:'bebida',
        type:'list',
        message:'Elegi el gusto de la bebida',
        choices: ['coca', 'sprite', 'fanta', 'agua'],
        when: function (respuesta){
            return respuesta.conBebida
        }

    },
    
    {
        name:'paraLlevar',
        type:'confirm',
        message:'la pizza es para llevar',
        default: false, 
    },
    {
        name:'direccion',
        type:'input',
        message:'ingresa tu direccion',
        when: function(respuesta){
           return respuesta.paraLlevar
    },
    validate: function (respuesta){
        if (respuesta.length < 5){
            return 'Dejanos saber tu direccion para enviarte la pizza';
        }
        return true
    }
    },
    
    {
        name: 'clienteHabitual',
        type: 'confirm',
        default: false
    },
    {
        name:'empanadas',
        type:'checkbox',
        message:'Elegi el gusto de la empanada',
        choices: ['carne', 'queso', 'verdura', 'jamon', 'caprese', 'roquefort'],
    },

]

let listaDeDescuentos = function (){
    return {
        'personal': 3,
        'mediaba': 5,
        'grande': 8
    }
}
let obtenerPrecioPizza= function (tamano){
    let precios ={
        'personal': 430,
        'mediaba': 560,
        'grande': 650
    }
    return precios[tamano];
} 
let obtenerDescuento= function (tamano, conBebida, fnLista){
    if(! conBebida){
        return 0
    }
    let descuentos = fnLista();
    return descuentos [tamano];
    //if (tamano== 'personal'){
      //  return 5;
    //}
    //if (tamano== 'mediana'){
      //  return 10;
    //}
    //if (tamano== 'grande'){
      //  return 15;
    //}
};


inquirer
.prompt(opciones)
.then(function (respuesta) {
console.log('=== Resumen de tu pedido==='),
console.log('Tus datos son - Nombre: ' + respuesta.nombre + '/ Telefono: ' + respuesta.telefono);

let precioDelivery=0;
if(respuesta.paraLlevar){
    precioDelivery= 20;
    console.log('Tu pedido sera entregado en:' + respuesta.direccion);
}
else{
    console.log('Nos indicaste que pasaras por tu pedido');
}
console.log('=== Productos solicitados===');
console.log ('Pizza:'+ respuesta.gusto);
console.log ('Tamano: '+ respuesta.tamano);

let precioBebida=0;
if(respuesta.conBebida){
    precioBebida=80;
    console.log('bebida: '+ respuesta.bebida);
}
if(respuesta.clienteHabitual){
    console.log('Tus tres empanadas de regalo seran de : ');
    console.log('carne');
    console.log('jamon y queso');
    console.log('cebolla');
}

let precioPizza= obtenerPrecioPizza(respuesta.tamano);
let descuento= (respuesta.tamano, respuesta.conBebida);
console.log (descuento);

// switch (respuesta.tamano){
//     case 'personal': precioPizza = 430;
//         if (respuesta.conBebida){
//             descuento=5;
//         }
//     break;
//     case 'mediana': precioPizza = 560
//     if (respuesta.conBebida){
//         descuento=10;
//     }
//     break;
//     case 'grande': precioPizza = 630
//     if (respuesta.conBebida){
//         descuento=15;
//     }
//     break;
// }
console.log ('total delivery' + precioDelivery);
let subtotal= precioPizza + precioBebida;
let descuentoFinal= (subtotal*descuento)/100;
let precioFinal= (subtotal-descuentoFinal + precioDelivery);
console.log('Subtotal: '+ subtotal);
console.log('Descuento: '+ descuentoFinal);
console.log ('Total: '+ (subtotal-descuentoFinal + precioDelivery));

var fechaPedido= new Date();
// var diaDePedido = fechaPedido.getDate();
// var mesDePedido = fechaPedido.getMonth();
// var anoDePedido = fechaPedido.getFullYear();
// console.log("Fecha: " + anoDePedido + '-'+ mesDePedido+ "-"+ anoDePedido);

//console.log(fechaPedido.toLocaleString('en-US', {'hour12':true}));

let nuevos={
    fecha: fechaPedido.toLocaleDateString('en-US', {'hour12':true}),
    hora: fechaPedido.toLocaleTimeString('en-US', {'hour12':true})
}

let final= {
    ...respuesta,
    ...nuevos,
    totalProductos: precioFinal,
    descuento: descuentoFinal,
    id: pedidos.length == 0 ? 1: pedidos++
}
pedidos.push(final)

pedidos=JSON.stringify(pedidos)

fs.writeFileSync(rutaArchivo,pedidos)

})

