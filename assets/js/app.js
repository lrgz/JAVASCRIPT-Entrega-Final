
/***
 * Proyecto  : Simulador de credito personal 
 * Fecha : 12/2022
 * Autor : Rodrigo Zerrezuela
 * Descripcion : de acuerdo a los datos de la persona y su sueldo 
 *               se extablece que se le brindara un credito equivalente a 3
 *               sueldos del informado os y puden devuelto en 1/2/3 años
 */

/***
 * Tipo  : Objeto
 * nombre : Persona
 * Fecha : 12/2022
 * Autor : Rodrigo Zerrezuela
 * Descripcion : Objto para el manejo de los datos de la persona
 */
class Persona {

    constructor(nombreApellido, email, telefono, sueldo, cuotas) {
        this.nombreApellido = nombreApellido;
        this.email = email;
        this.telefono = telefono;
        this.sueldo = sueldo;
        this.cuotas = cuotas;
        this.capital = sueldo * 3;

    }

    saveStorage() {
        localStorage.setItem("cliente", JSON.stringify(this));
    }

    clearStorage() {
        localStorage.removeItem("cliente");
    }

    getDatosPersona() {
        console.log("<-----datos Persona----->");
        console.log("Nombre y Apellido: ", this.nombreApellido);
        console.log("E-mail: ", this.email);
        console.log("Telefono: ", this.telefono);
        console.log("<-----fin datos Persona----->");
    }


    getPrestamo() {
        let prestamo = new Prestamo(this.capital, this.cuotas);
        prestamo.setPrestamoPlan();
        prestamo.getPrestamoPlan();
    }


}

/***
 * Tipo  : Objeto
 * nombre : Prestamo
 * Fecha : 12/2022
 * Autor : Rodrigo Zerrezuela
 * Descripcion : Objto para el manejo del prestamo
 */
class Prestamo {

    constructor(capital, cuotas) {

        this.capital = capital;
        this.cuotas = cuotas;
        this.tasa = 75.50;
        this.plan = [];
        this.totales = [];
    }


    setPrestamoPlan() {

        let capital;
        let interes;
        let importeCuota;
        let totalCapital;
        let totalInteres;
        let totalCuota;

        for (let i = 1; i <= this.cuotas; i++) {
            capital = (this.capital / this.cuotas).toFixed(2);
            interes = (((this.capital * this.tasa) / 100) / this.cuotas).toFixed(2);
            importeCuota = (parseFloat(capital) + parseFloat(interes)).toFixed(2);
            console.log("* ", i, " * ", capital, " * ", interes, " * ", importeCuota, " *");
            this.plan.push({ cuo: i, cap: capital, int: interes, imp: importeCuota });
        }
        totalCapital = (this.capital).toFixed(2);
        totalInteres = (interes * this.cuotas).toFixed(2);
        totalCuota = (importeCuota * this.cuotas);
        this.totales.push({ cap: totalCapital, int: totalInteres, cuo: totalCuota });
        this.saveStorage();
    }

    saveStorage() {
        localStorage.setItem("prestamo", JSON.stringify(this));
    }

    clearStorage() {
        localStorage.removeItem("prestamo");
    }


    getPrestamoPlan() {
        let planCuotas = JSON.parse(localStorage.getItem("prestamo"));

        for (const plan of planCuotas.plan) {
            document.getElementById("tab").innerHTML = document.getElementById("tab").innerHTML +
                `<tr>
                <td> ${plan.cuo}</td>
                <td> ${plan.cap}</td>
                <td> ${plan.int}</td>
                <td> ${plan.imp}</td>
            </tr>`;
        }
        document.getElementById("t1").innerHTML = this.totales[0].cap;
        document.getElementById("t2").innerHTML = this.totales[0].int;
        document.getElementById("t3").innerHTML = this.totales[0].cuo;
    }
}

/***
 * Tipo  : Objeto
 * nombre : Cotizacion
 * Fecha : 01/2023
 * Autor : Rodrigo Zerrezuela
 * Descripcion : obtiene la cotizacion por fecth y la almacena
 */
class Cotizacion {

    constructor() {
        this.cotizaciones;
      
    }


    setCotizacionDolar(paramCotizacion) {

        //this.cotizaciones.push(paramCotizacion);
        this.cotizaciones=paramCotizacion;
        this.clearStorage();
        this.saveStorage();


    }

    saveStorage() {
        localStorage.setItem("cotizacion", JSON.stringify(this));
    }

    clearStorage() {
        localStorage.removeItem("cotizacion");
    }


    getDolarCotizacion() {
        this.cotizaciones = JSON.parse(localStorage.getItem("cotizacion"));
        
    }
}

/***
 * *********************** PROCESO ***********************
 */

init();



/*cotizacion */



function validarForm(evObject) {

    evObject.preventDefault();

    let todoCorrecto = true;

    let frm = document.frmCliente;

    //validacion de nombre y apellido

    if (frm.nombreApellido.value === '' || frm.nombreApellido.value.length === 0 || !isNaN(frm.nombreApellido.value)) {
        mensajeError('No se ha informado un Nombre y Apelllido');
        todoCorrecto = false;
    }

    //validacion de e-mail
    if (frm.email.value ==='' || frm.email.value.length === 0 || !isNaN(frm.email.value)) {
        mensajeError('No se ha informado un e-mail,o se cumple con el formato');
        todoCorrecto = false;
    }
    
    if (frm.telefono.value <= 0|| isNaN(frm.telefono.value) ) {
        mensajeError('No se ha informado telefono');

        todoCorrecto = false;
    }

    //validacion de campo sueldo
    if (frm.sueldo.value <= 0|| isNaN(frm.sueldo.value) ) {
        mensajeError('Se informado incorrectamente el sueldo ');

        todoCorrecto = false;
    }
    //validacion de plazo    
    if (frm.cantidadCuotas.value <= 0|| isNaN(frm.cantidadCuotas.value) ) {
        mensajeError('No se ha informado la cantidad de cuotas');

        todoCorrecto= false;
    }


    //verifico si esta todo ok        
    if (todoCorrecto == true) {

        calcularCredito()
    }

}

function calcularCredito() {

    btnCalcular.disabled = true;
    /* tomo lo datos del cliente y los almaceno */
    let nombreApellido = document.getElementById("nombreApellido").value
    let email = document.getElementById("email").value
    let telefono = document.getElementById("telefono").value
    let sueldo = document.getElementById("sueldo").value
    let cuotas = document.getElementById("cantidadCuotas").value
    let planCuotas = document.getElementById("planCuotas")

    //genero el cliente
    let cliente = new Persona(nombreApellido, email, telefono, sueldo, cuotas);

    //almaceno el cliente
    cliente.saveStorage();


    // muestro el plan de cuotas

    planCuotas.classList.remove("listCuotasHide");
    planCuotas.classList.add("listCuotasShow");

    cliente.getPrestamo();

}


function resetInfo() {
    btnCalcular.disabled = false;
    document.getElementById("nombreApellido").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("sueldo").value = "";
    document.getElementById("cantidadCuotas").value = 0;
    localStorage.clear();
    planCuotas.classList.remove("listCuotasShow");
    planCuotas.classList.add("listCuotasHide");

}

function init(){


    /* agrego los eventos a los botones */
    let btnCalcular = document.getElementById("btnCalcular");
    let btnReset = document.getElementById("btnReset");

    btnCalcular.addEventListener("click", validarForm);

    btnReset.addEventListener("click", resetInfo);

    /*cotizacion dolar */
    cotizacionDolar();
}

function cotizacionDolar(){

    let dolar = new Cotizacion();     

   

        
    let cotizacion  = [];
    let titulo,venta,compra;

    fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales")
    .then(response=> response.json())
    .then(function(data){  


   
        for (let i = 0; i <= 1; i++) 
        {       
            titulo=data[i]['casa']['nombre'];
            compra=data[i]['casa']['compra'];
            venta=data[i]['casa']['venta']             
            
            cotizacion.push({ titulo: titulo, venta: venta, compra: compra})
        }
        dolar.setCotizacionDolar(cotizacion);


    })
    // aca ver tema de toast
    //.catch((err) => console.log(err));


    dolar.getDolarCotizacion()


    let msg= '<h1>COTIZACION DOLAR </h1>'


    for (const dolarCotizacion of dolar.cotizaciones.cotizaciones) {
  
        msg= msg +`<h3>${dolarCotizacion.titulo}</h3>
                   <p>Venta  :  ${dolarCotizacion.venta} </p>
                   <p>Compra :  ${dolarCotizacion.compra} </p>
                   <hr>`
    }

    
/*     for (const coti of dolar.cotizaciones) {

        console.log(coti.titulo);
    } */

Swal.fire({
    html:
    `${msg}`,
    icon:"info",
   // footer:"<a href=''>IR A GOOGLE</a>",
   // color: '#1a1a19',
    //background: '#d1ddbe',
    showClass:{
        popup:'animate__animated animate__bounceInUp'
    },
    hideClass:{
        popup:'animate__animated animate__hinge'
    }
   
});
}

function mensajeError(msg){
    Toastify({
        text: `${msg}`,
        duration:1500,
        gravity:"top",
        position:"right",
        style:{
            fontSize:"18px",
            fontFamily:"Verdana",
            color:"white",
            background:"red"
        }
    }).showToast();
}
