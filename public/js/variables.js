//CONEXION A DOM
//--cards
const tortasCard = document.querySelector("#tortas-card")
//--items del carrito
const cartItem = document.querySelector("#cart-item")
//--footer de la tabla del carrito
const tablaFooter = document.querySelector("#cart-footer")
//--carrito-icono
const cartIcon = document.querySelector('#cartIcon')
//--Tabla carrito
const tablaCarrito = document.querySelector(".tabla-cart")
//--Busacador
const inputBuscar = document.querySelector("#input-buscar")
//--Categorias
const inputCategoria = document.querySelector("#input-categoria")
// guardamos en un array las "categorias" sin duplicados
let categorias = []
//--Realizar Compra
const realizarCompraContainer = document.querySelector("#div-realizar")
//--divFormulario
const divFormulario = document.querySelector("#div-formulario")
//--Formulario
const formulario = document.querySelector("#formulario")
//--Formulario-inputs
const nombre = document.querySelector("#name")
const adress = document.querySelector("#adress")
const email = document.querySelector("#email")
//--BTNEnviar
const btnEnviar = document.querySelector("#btn-enviar")

//--Templates
//--cards
const tmpltTortasCard = document.querySelector("#tmplt-tortas-card").content
const tmpltTablaFooter = document.querySelector("#tmplt-tabla-footer").content
const tmpltCart = document.querySelector("#tmplt-cart").content

//Fragment
const fragment = document.createDocumentFragment()

//Objeto Carrito
let carrito = {}


const listaPostres = []