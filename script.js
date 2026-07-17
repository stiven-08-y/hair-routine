const btnGuardar =
    document.getElementById("guardar");

const btnAgregarProducto =
    document.getElementById(
        "btnAgregarProducto"
    );

const nuevoProducto =
    document.getElementById(
        "nuevoProducto"
    );

const listaProductos =
    document.getElementById(
        "listaProductos"
    );

const btnMostrarProductos =
    document.getElementById(
        "btnMostrarProductos"
    );

const btnPermiso =
    document.getElementById(
        "btnPermiso"
    );

const historialLavados =
    document.getElementById(
        "historialLavados"
    );


const modal = document.getElementById("modalLavado");

const btnRegistrar =
    document.getElementById("btnRegistrar");

const cancelar =
    document.getElementById("cancelar");

const fechaLavado =
    document.getElementById("fechaLavado");

let diaSeleccionado = null;

let productos = JSON.parse(
    localStorage.getItem("productos")
) || [];
mostrarProductos();
let lavados = JSON.parse(
    localStorage.getItem("lavados")
) || [];

let lavadoEditando = null;


function limpiarFormulario(){

    document.getElementById("nuevoProducto").value = "";

    document.getElementById("frecuenciaDias").value = 3;

    document.getElementById("modoAutomatico").checked = true;

    document.getElementById("notificarAntes").checked = true;

    document.getElementById("notificarHoy").checked = true;

    document.getElementById("listaProductos").innerHTML = "";
}

const calendario = document.getElementById("calendario");
const mesActualTexto = document.getElementById("mesActual");

let fecha = new Date();

const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

function crearCalendario(){

    calendario.innerHTML = "";

    const año = fecha.getFullYear();
    const mes = fecha.getMonth();

    mesActualTexto.textContent =
        `${meses[mes]} ${año}`;

    const primerDia =
        new Date(año, mes, 1).getDay();

    const diasMes =
        new Date(año, mes + 1, 0).getDate();

    const espacios =
        primerDia === 0 ? 6 : primerDia - 1;

    for(let i = 0; i < espacios; i++){

        const vacio =
            document.createElement("div");

        calendario.appendChild(vacio);
    }

    for(let dia = 1; dia <= diasMes; dia++){

        const celda =
            document.createElement("div");

        celda.classList.add("dia");

        celda.textContent = dia;

        const fechaCelda =
            `${año}-${
                String(mes+1)
                .padStart(2,"0")
            }-${
                String(dia)
                .padStart(2,"0")
            }`;

        const lavadoGuardado =
            lavados.find(
                l => l.fecha === fechaCelda
            );

        if(lavadoGuardado){
            celda.classList.add(
                "lavado"
            );
        }

        const proximo =
            lavados.find(
                l =>
                l.proximoLavado ===
                fechaCelda
            );

        if(proximo){
            celda.classList.add(
                "proximo"
            );
        }

        celda.addEventListener(
    "click",
    ()=>{

        diaSeleccionado = dia;

        const fechaCompleta =
            new Date(
                año,
                mes,
                dia
            );

        const fechaString =
            `${año}-${
                String(mes+1).padStart(2,"0")
            }-${
                String(dia).padStart(2,"0")
            }`;

        const lavadoExistente =
            lavados.find(
                l => l.fecha === fechaString
            );

        if(lavadoExistente){

            lavadoEditando =
                lavadoExistente;

            cargarLavado(
                lavadoExistente
            );

        }else{

            lavadoEditando = null;

            limpiarFormulario();

            fechaLavado.value =
                fechaString;
        }

        modal.classList.add(
            "activo"
        );
    }
);

        const hoy = new Date();

        if(
            dia === hoy.getDate() &&
            mes === hoy.getMonth() &&
            año === hoy.getFullYear()
        ){
            celda.classList.add("hoy");
        }

        calendario.appendChild(celda);
    }
}

crearCalendario();

document
.getElementById("mesAnterior")
.addEventListener("click",()=>{

    fecha.setMonth(
        fecha.getMonth()-1
    );

    crearCalendario();
});

document
.getElementById("mesSiguiente")
.addEventListener("click",()=>{

    fecha.setMonth(
        fecha.getMonth()+1
    );

    crearCalendario();
});

btnRegistrar.addEventListener(
    "click",
    ()=>{
        limpiarFormulario();
        modal.classList.add(
            "activo"
        );

        const hoy = new Date();

        fechaLavado.value =
            `${hoy.getFullYear()}-${
                String(hoy.getMonth()+1).padStart(2,"0")
            }-${
                String(hoy.getDate()).padStart(2,"0")
            }`;
    }
);

cancelar.addEventListener(
    "click",
    ()=>{

        modal.classList.remove(
            "activo"
        );
    }
);

btnAgregarProducto.addEventListener(
    "click",
    agregarProducto
);

btnMostrarProductos.addEventListener(
    "click",
    ()=>{
        if(
            listaProductos.style.display
            === "none"
        ){
            listaProductos.style.display =
                "block";

            mostrarProductos();
        }else{
            listaProductos.style.display =
                "none";
        }
    }
);

btnPermiso.addEventListener(
    "click",
    async ()=>{
        const permiso =
            await Notification.requestPermission();

        if(permiso === "granted"){
            alert(
                "Notificaciones activadas"
            );
        }
    }
);



btnGuardar.addEventListener("click", guardarLavado);

function guardarLavado(){

    const fecha = fechaLavado.value;

    const producto = document
        .getElementById("nuevoProducto")
        .value
        .trim();

    const automatico =
        document.getElementById(
            "modoAutomatico"
        ).checked;

    const frecuencia =
        Number(
            document.getElementById(
                "frecuenciaDias"
            ).value
        );

    console.log(
        document.querySelectorAll(".productoCheck")
    );

    console.log(
        document.querySelectorAll(
            ".productoCheck:checked"
        )
    );

    const productosSeleccionados =
    [...document.querySelectorAll(
        ".productoCheck:checked"
    )].map(
        producto => producto.value
    );

    console.log(productosSeleccionados);

    let proximoLavado;

    if(automatico){

        const partes =
            fecha.split("-");

        const fechaTemp =
            new Date(
                Number(partes[0]),
                Number(partes[1]) - 1,
                Number(partes[2])
            );

        fechaTemp.setDate(
            fechaTemp.getDate() + frecuencia
        );

        proximoLavado =
        `${fechaTemp.getFullYear()}-${
            String(
                fechaTemp.getMonth()+1
            ).padStart(2,"0")
        }-${
            String(
                fechaTemp.getDate()
            ).padStart(2,"0")
        }`;

    }else{

        proximoLavado =
            document
            .getElementById(
                "proximoLavadoInput"
            ).value;
    }

    const lavado = {
        fecha,
        productos:
            productosSeleccionados,
        automatico,
        frecuencia,
        proximoLavado
    };

    if(lavadoEditando){

    const indice =
        lavados.findIndex(
            l =>
            l.fecha ===
            lavadoEditando.fecha
        );

    lavados[indice] =
        lavado;

    }else{

        lavados.push(lavado);
    }

    localStorage.setItem(
        "lavados",
        JSON.stringify(lavados)
    );

    actualizarResumen();

    crearCalendario();

    actualizarHistorial();

    actuallizarEstadisticas();

    modal.classList.remove(
        "activo"
    );

    console.log(lavados);
}

function cargarLavado(lavado){

    fechaLavado.value =
        lavado.fecha;

    document
        .getElementById(
            "nuevoProducto"
        ).value =
        lavado.productos[0] || "";

    document
        .getElementById(
            "modoAutomatico"
        ).checked =
        lavado.automatico;

    document
        .getElementById(
            "frecuenciaDias"
        ).value =
        lavado.frecuencia;

}

function actualizarResumen(){

    const ultimoLavadoTexto =
        document.getElementById("ultimoLavado");

    const proximoLavadoTexto =
        document.getElementById("proximoLavado");

    if(lavados.length === 0){

        ultimoLavadoTexto.textContent =
            "Sin registros";

        proximoLavadoTexto.textContent =
            "No programado";

        return;
    }

    // Ordenar por fecha
    const ordenados = [...lavados].sort(
        (a,b)=>
        new Date(a.fecha) -
        new Date(b.fecha)
    );

    const ultimo =
        ordenados[
            ordenados.length - 1
        ];

    ultimoLavadoTexto.textContent =
        formatearFecha(
            ultimo.fecha
        );

    proximoLavadoTexto.textContent =
        formatearFecha(
            ultimo.proximoLavado
        );
}

function formatearFecha(fecha){

    const partes = fecha.split("-");

    const año = partes[0];
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    const meses = [
        "Ene","Feb","Mar","Abr",
        "May","Jun","Jul","Ago",
        "Sep","Oct","Nov","Dic"
    ];

    return `${dia} ${meses[mes - 1]}`;
}

document
.getElementById("eliminarLavado")
.addEventListener(
    "click",
    eliminarLavado
);

function eliminarLavado(){

    if(!lavadoEditando)
        return;

    lavados =
        lavados.filter(
            l =>
            l.fecha !==
            lavadoEditando.fecha
        );

    localStorage.setItem(
        "lavados",
        JSON.stringify(lavados)
    );

    crearCalendario();

    actualizarResumen();

    actualizarHistorial();

    actualizarEstadisticas();

    modal.classList.remove(
        "activo"
    );

    lavadoEditando = null;
}

function guardarProductos(){

    localStorage.setItem(
        "productos",
        JSON.stringify(
            productos
        )
    );

}

function agregarProducto(){

    const nombre =
        nuevoProducto.value
        .trim();

    if(nombre === "")
        return;

    if(
        productos.includes(
            nombre
        )
    ){
        alert(
            "Ese producto ya existe."
        );
        return;
    }

    productos.push(
        nombre
    );

    guardarProductos();

    mostrarProductos();

    nuevoProducto.value = "";
}

function mostrarProductos(){

    listaProductos.innerHTML = "";

    productos.forEach((producto, indice)=>{

        const item =
            document.createElement("div");

        item.classList.add(
            "producto-item"
        );

        item.innerHTML = `
            <label>
                <input
                    type="checkbox"
                    value="${producto}"
                    class="productoCheck"
                >
                ${producto}
            </label>

            <button
                class="btnEliminarProducto"
                onclick="eliminarProducto(${indice})"
            >
                🗑️
            </button>
        `;

        listaProductos.appendChild(item);
    });
}

function eliminarProducto(indice){

    productos.splice(
        indice,
        1
    );

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

    mostrarProductos();
}

function envirNotificacion(titulo, mensaje){

    if(Notification.permission === "granted"){

        new Notification(
            titulo,
            {
                body: mensaje
            }
        );
    }
}

function revisarNotificaciones(){

    const hoy =
        new Date();

    const hoyString =
        `${hoy.getFullYear()}-${
            String(
                hoy.getMonth()+1
            ).padStart(2,"0")
        }-${
            String(
                hoy.getDate()
            ).padStart(2,"0")
        }`;

    lavados.forEach(
        lavado=>{

            if(
                lavado.proximoLavado ===
                hoyString &&
                lavado.notificarMismoDia
            ){
                enviarNotificacion(
                    "Hair Routine",
                    "Hoy toca lavado de cabello."
                );
            }
        }
    );
}

function actualizarHistorial(){

    historialLavados.innerHTML = "";

    const historial =
        [...lavados]
        .sort(
            (a,b)=>
                new Date(b.fecha)
                -
                new Date(a.fecha)
        );

    historial.forEach(
        (lavado,index)=>{

            const tarjeta =
                document.createElement(
                    "div"
                );

            tarjeta.classList.add(
                "historialItem"
            );

            tarjeta.innerHTML = `
                <h3>
                    🩷 ${lavado.fecha}
                </h3>

                <p>
                    Productos:
                    ${
                        lavado.productos &&
                        lavado.productos.length > 0
                        ?
                        lavado.productos.join(", ")
                        :
                        "Sin productos"
                    }
                </p>

                <p>
                    Próximo:
                    ${
                        lavado.proximoLavado
                        ||
                        "Manual"
                    }
                </p>

                <div class="accionesHistorial">

                    <button
                        onclick="
                            editarDesdeHistorial(
                                '${lavado.fecha}'
                            )
                        "
                    >
                        ✏️ Editar
                    </button>

                    <button
                        onclick="
                            borrarDesdeHistorial(
                                '${lavado.fecha}'
                            )
                        "
                    >
                        🗑 Eliminar
                    </button>

                </div>
            `;

            historialLavados
            .appendChild(
                tarjeta
            );
        }
    );
}

function borrarDesdeHistorial(
    fecha
){

    if(
        !confirm(
            "¿Eliminar este lavado?"
        )
    ){
        return;
    }

    lavados =
        lavados.filter(
            l =>
                l.fecha !== fecha
        );

    localStorage.setItem(
        "lavados",
        JSON.stringify(
            lavados
        )
    );

    crearCalendario();

    actualizarResumen();

    actualizarHistorial();

    actualizarEstadisticas();
}

function editarDesdeHistorial(
    fecha
){

    const lavado =
        lavados.find(
            l =>
                l.fecha === fecha
        );

    if(!lavado)
        return;

    lavadoEditando =
        lavado;

    cargarLavado(
        lavado
    );

    modal.classList.add(
        "activo"
    );
}

revisarNotificaciones();

window.onload = function(){
    mostrarProductos();
}

actualizarHistorial();

actualizarEstadisticas();

function actualizarEstadisticas(){

    document.getElementById(
        "estadisticaTotal"
    ).textContent = lavados.length;

    const contadorProductos = {};

    lavados.forEach(lavado=>{
        lavado.productos.forEach(producto=>{
            contadorProductos[producto] =
                (contadorProductos[producto] || 0) + 1;
        });
    });

    let productoMasUsado = "-";
    let maximo = 0;

    for(const producto in contadorProductos){
        if(contadorProductos[producto] > maximo){
            maximo = contadorProductos[producto];
            productoMasUsado = producto;
        }
    }

    document.getElementById(
        "estadisticaProducto"
    ).textContent = productoMasUsado;

    if(lavados.length > 1){

        const fechas = lavados
            .map(l=>new Date(l.fecha))
            .sort((a,b)=>a-b);

        let sumaDias = 0;

        for(let i=1;i<fechas.length;i++){
            sumaDias +=
                (fechas[i]-fechas[i-1]) /
                (1000*60*60*24);
        }

        const promedio =
            Math.round(
                sumaDias /
                (fechas.length-1)
            );

        document.getElementById(
            "estadisticaPromedio"
        ).textContent =
            promedio + " días";
    }

    const hoy = new Date();

    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();

    const lavadosMes =
        lavados.filter(l=>{

            const fecha =
                new Date(l.fecha);

            return (
                fecha.getMonth() === mesActual &&
                fecha.getFullYear() === añoActual
            );

        }).length;

    document.getElementById(
        "estadisticaMes"
    ).textContent = lavadosMes;
}

const pantallaBienvenida =
    document.getElementById(
        "pantallaBienvenida"
    );

const nombreUsuario =
    document.getElementById(
        "nombreUsuario"
    );

const btnEntrar =
    document.getElementById(
        "btnEntrar"
    );

const nombreGuardado =
    localStorage.getItem(
        "nombreHairRoutine"
    );

if(nombreGuardado){

    document.getElementById(
        "mensajeBienvenida"
    ).textContent =
        `Hola ${nombreGuardado} 💜`;

    nombreUsuario.style.display =
        "none";

    btnEntrar.textContent =
        "Entrar ✨";
}

btnEntrar.addEventListener(
    "click",
    ()=>{

        if(
            !nombreGuardado &&
            nombreUsuario.value.trim() === ""
        ){
            return;
        }

        if(
            nombreUsuario.value.trim()
        ){

            localStorage.setItem(
                "nombreHairRoutine",
                nombreUsuario.value
            );
        }

        pantallaBienvenida.style.display =
            "none";
    }
);

if("serviceWorker" in navigator){

    window.addEventListener(
        "load",
        ()=>{

            navigator.serviceWorker.register(
                "./sw.js"
            );

        }
    );
}