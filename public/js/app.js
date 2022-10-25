//Eventos
//--Luego de que el HTML se haya leeido usamos el Fetch
document.addEventListener("DOMContentLoaded", () => {
    postresData()
    //Local Storage
    //si existe la key carrito...
    if (localStorage.getItem("carrito")) {
        //cargamos esa infromacion al carrito
        carrito = JSON.parse(localStorage.getItem("carrito"))
        pintarCarrito()
    }
})

//--Boton comprar
tortasCard.addEventListener("click", e => {
    agregarAlCarrito(e)
})

//--Items del carrito +aumentar -disminuir
cartItem.addEventListener("click", e => {
    //boton aumentar cantidad
    if (e.target.classList.contains("btn-aumentar")) {
        const postre = carrito[e.target.dataset.id]
        postre.cantidad++

        carrito[e.target.dataset.id] = { ...postre }
        pintarCarrito()
    }
    //boton disminuir cantidad
    if (e.target.classList.contains("btn-disminuir")) {
        const postre = carrito[e.target.dataset.id]
        postre.cantidad--
        //eliminar postre con cantidad = 0
        if (postre.cantidad === 0) {
            //borra el objeto del carrito con el indice "[e.target.dataset.id]"
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
})

//--Mostrar Carrito
cartIcon.addEventListener("click", () => {
    tablaCarrito.classList.toggle("tabla-cart--visible")
})

//Evita que el formulario se envie
formulario.addEventListener("submit", (e) => {
    e.preventDefault()
})

//Simula el envio del pedido
btnEnviar.addEventListener("click", () => {
    pedidoEnviado()
})

//Fetch
const postresData = async () => {
    try {
        const res = await fetch("../../public/DB/api.json")
        const data = await res.json()
        pintarCards(data)

        const res2 = await fetch("../../public/DB/api.json")
        const data2 = await res2.json()
        listarPostres(data2)

    } catch (error) {
        console.log(error)
    } finally {
        //categorias-- coloco aqui la invocacion a las siguientes funciones, porque es la unica forma que encontre para que ambas funcionen :)
        aplicarCategorias()
        cargarCategorias(inputCategoria, categorias)
    }
}

//pinta el Carrito en el HTML
const pintarCards = data => {
    data.forEach(postre => {
        tmpltTortasCard.querySelector("h5").textContent = postre.title
        tmpltTortasCard.querySelector("p").textContent = postre.precio
        tmpltTortasCard.querySelector("img").setAttribute("src", postre.thumbnailUrl)
        tmpltTortasCard.querySelector("button").dataset.id = postre.id
        tmpltTortasCard.querySelector("img").setAttribute("alt", "imagen de " + postre.title)

        const clone = tmpltTortasCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    tortasCard.appendChild(fragment)
}

const agregarAlCarrito = e => {
    if (e.target.classList.contains("btn-comprar")) {
        //Empujamos la informacion de la card en el html al carrito
        armarCarrito(e.target.parentElement)
        confirmar("Agregaste un Postre al carrito")
    }
    e.stopPropagation()
}

const armarCarrito = objeto => {
    const postre = {
        id: objeto.querySelector(".btn-comprar").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
    }

    //Evita el postre se duplique ↓
    if (carrito.hasOwnProperty(postre.id)) {
        postre.cantidad = carrito[postre.id].cantidad + 1
    }
    //carrito[postre.id]  = Estamos creando el index con el id del postre, si exite lo crea, pero si no existe lo sobreescribe
    carrito[postre.id] = { ...postre }

    pintarCarrito()
}

const pintarCarrito = () => {
    //cartItem parte vacio "", para que no se repitan los postres

    cartItem.innerHTML = ""

    Object.values(carrito).forEach((postre) => {
        tmpltCart.querySelector("th").textContent = postre.id
        tmpltCart.querySelectorAll("td")[0].textContent = postre.title
        tmpltCart.querySelectorAll("td")[1].textContent = postre.cantidad
        tmpltCart.querySelector(".btn-aumentar").dataset.id = postre.id
        tmpltCart.querySelector(".btn-disminuir").dataset.id = postre.id
        tmpltCart.querySelector("td span").textContent = postre.precio * postre.cantidad

        const clone = tmpltCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    cartItem.appendChild(fragment)

    pintarTablaFooter()

    //guardamos el Carrito en el Locale Storage
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

const pintarTablaFooter = () => {
    tablaFooter.innerHTML = ""
    if (Object.keys(carrito).length === 0) {
        tablaFooter.innerHTML =
            `
        <th scope="row" colspan="5">Carrito vacío 🛒</th>
        `
        //en caso de que el se cumpla el if, el return nos servira para que la deje de leerse el codigo fuera del if.
        return
    }
    //Suma la Cantidad de los Postres ↓
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    //Utiliza la cantidad de los postres agregados y los multiplica por sus repectivos precios ↓
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    tmpltTablaFooter.querySelectorAll("td")[0].textContent = nCantidad
    tmpltTablaFooter.querySelector("span").textContent = nPrecio

    const clone = tmpltTablaFooter.cloneNode(true)
    fragment.appendChild(clone)

    tablaFooter.appendChild(fragment)

    const btnVaciar = document.querySelector("#vaciar-carrito")
    btnVaciar.addEventListener("click", () => {
        carrito = {}
        pintarCarrito()
    }
    )
}

const listarPostres = (array) => {
    debugger
    array.map(postre => listaPostres.push(postre))
}

//Buscar Postres
const buscarPostre = () => {
    debugger
    inputBuscar.value = inputBuscar.value.trim().toUpperCase()
    if (inputBuscar.value !== "") {
        const resultado = listaPostres.filter(postre => postre.title.includes(inputBuscar.value))
        if (resultado.length === 0) {
            alerta("No se encontro el postre que buscabas", "error")
        } else {
            tortasCard.innerHTML = ""
            pintarCards(resultado)
        }
    } else {
        tortasCard.innerHTML = ""
        pintarCards(listaPostres)
    }

}

inputBuscar.addEventListener("input", buscarPostre)

//Sweet Alert 2

const alerta = (mensaje, icono) => {
    Swal.fire({
        icon: icono,
        title: mensaje,
    })
}

const confirmar = (mensaje) => {
    Swal.fire({
        icon: 'success',
        title: mensaje,
        showConfirmButton: false,
        timer: 700
    })
}

//categoriasDuplicados() = Utilizando la Funcion de order superior reduce() creamos una lista donde concatenamos las categorias y luego creamos una lista llamada listaCategorias donde dichas categorias no se repiten usando el objeto Set
const categoriaSinDuplicados = () => {
    debugger
    const categorias = listaPostres.reduce((acc, postr) => acc.concat(postr.categoria), [])
    const listaCategorias = new Set(categorias)
    return listaCategorias
}

//cree una funcion aplicar Categorias, ya que si ponia "categorias = categoriaSinDuplicados()" fuera de una funcion jamas guardaba el valor en la variable categorias, aun no lo entiendo
const aplicarCategorias = () => {
    categorias = categoriaSinDuplicados()
}
//cargarCategorias() = Cargamos las categorias en el select correspondiente
const cargarCategorias = (select, array) => {
    debugger
    if (array.size > 0) {
        array.forEach(elemento => {
            select.innerHTML += `<option value="${elemento}">${elemento}</option>`
        })

    } else {
        console.error("No existen elementos en el array.")
    }
}

// filtrarCategoria() = Filtra los postres segun sus categorias
const filtrarCategoria = () => {
    if (inputCategoria.value !== "") {
        const resultado = listaPostres.filter(postre => postre.categoria.includes(inputCategoria.value))
        if (resultado.length === 0) {
            console.clear()
            tortasCard.innerHTML = ""
            pintarCards(listaPostres)
        } else {
            tortasCard.innerHTML = ""
            pintarCards(resultado)
        }
    } else {
        tortasCard.innerHTML = ""
        pintarCards(listaPostres)
    }
}
inputCategoria.addEventListener("input", filtrarCategoria)



// realizarCompra
realizarCompraContainer.addEventListener("click", (e) => {
    debugger
    if (e.target.id === "checkout") {
        //"Si hay productos"
        if (Object.keys(carrito).length >= 1) {
            //--Mostrar Carrito
            divFormulario.classList.remove("hidden")
        } else {
            alerta("aun no has agregado productos al carrito", "error")
        }
    }
})

const datosCompletos = () => {
    if (nombre.value !== '' && email.value !== '' && adress.value !== '') {
        return true
    } else {
        return false
    }
}

const pedidoEnviado = () => {
    debugger
    if (datosCompletos()) {
        if (Object.keys(carrito).length >= 1) {
            const mensajeCotizar = () => {//Mensaje al final de la cotizacion de Felicitaciones
                Swal.fire({
                    title: `Felicitaciones ${nombre.value} has realizado tu compra con exito🎊`,
                    width: 600,
                    padding: '3em',
                    color: '#000',
                    background: '#fff',
                    backdrop: `
                          rgba(0,0,123,0.4)
                        `,
                    html: `
                            	<p>Tu pedido se enviara a <b>${adress.value}</b> en las proximas horas. Te enviamos un mail a <b>${email.value}</b> donde vas a poder seguir tu pedido.</p>
                                <div style="width:100%">
                                    <div style="height:0;padding-bottom:56.25%;position:relative;width:100%">
                                        <iframe allowfullscreen="" frameBorder="0" height="100%" src="https://giphy.com/embed/G96zgIcQn1L2xpmdxi/video" style="left:0;position:absolute;top:0" width="100%">
                                        </iframe>
                                    </div>
                                </div>`
                })
            }
            mensajeCotizar()
            divFormulario.classList.add("hidden")
        } else {
            alerta("El carrito esta vacío, agregue productos para realizar su pedido", "error")
        }
    } else {
        alerta("Complete los datos para realizar su pedido", "error")
    }
}

