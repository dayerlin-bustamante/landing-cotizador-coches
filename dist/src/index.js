
function Seguros(marca, year, seguro) {
    this.marca = marca;
    this.year = year;
    this.seguro = seguro;
}

Seguros.prototype.cotizacionSeg = function (){
    let cantidad;
    const Valorbase = 2000;
    switch (this.marca) {
        case '1':
        cantidad = Valorbase * 1.15
        break;
        
        case '2':
        cantidad = Valorbase * 1.05
        break;

        case '3':
        cantidad = Valorbase * 1.35
        break;

        default:
        break;
    }

    const diferencia = new Date().getFullYear() - this.year;
    cantidad -= ((diferencia * 3) * cantidad / 100 )
    
    if (this.seguro == 'Basico') {
        cantidad *= 1.30
    } else {
        cantidad*= 1.50
    }

    return cantidad;
}

function UI(){}

UI.prototype.opciones = () => {
    const max = new Date().getFullYear(); //2023
    const min = max - 20;//2003
    
    const selectYears = document.querySelector('#year');
    for (let i = max; min < i; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i
        selectYears.appendChild(option)
    }
}
UI.prototype.mostrarMensaje = function(mensaje, tipo) {
    const div = document.createElement('div');
    const result = document.querySelector('#result');
    const form = document.querySelector('#form');
    const spinner = document.querySelector('#cargando');

    if (tipo === 'error') {
        div.classList.add('rounded', 'border-s-4', 'border-red-500', 'bg-red-50', 'p-4', 'text-sm', 'font-medium', 'text-red-800')
    } else {
        div.classList.add('rounded', 'border-s-4', 'border-green-500', 'bg-green-100', 'p-4', 'text-sm', 'font-medium', 'text-green-600');
        spinner.classList.remove('hidden')
    }
    form.insertBefore(div, result);
    div.textContent = mensaje;

    setTimeout( () => {
        div.remove()
        spinner.classList.add('hidden')
    },  3000)
}

const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.opciones();
    eventListener();
})

function eventListener(){
    const form = document.querySelector('#form');
    form.addEventListener('submit', cotizarSeguro)
}

function cotizarSeguro(e) {
    e.preventDefault();
    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    if ( marca == '' || year == '' || tipo == '') {
        ui.mostrarMensaje('Por favor rellene todos los campos', 'error');
        return;
    }
    ui.mostrarMensaje('Cotizando...');

    const seg = new Seguros(marca,year,tipo);
    const total =  seg.cotizacionSeg();
    const result = document.querySelector('#result');
    const tipoMarca = document.querySelector('#marca').options[document.querySelector('#marca').selectedIndex].textContent;
    const localsave = {
    ...seg,
    total,
    tipoMarca
    };


    setTimeout(() => {
        result.classList.add('bg-white')
        result.innerHTML = `
            <article class="flex items-end justify-between rounded-lg border border-gray-100 bg-white p-6">
                <div class="flex items-center gap-4">
                    <span class="hidden rounded-full bg-gray-100 p-2 text-gray-600 sm:block">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    </span>
                    <div>
                        <p class="text-sm text-gray-500">Marca: ${tipoMarca}, Año: ${seg.year}</p>
                        <p class="text-sm text-gray-500">Tipo de seguro: ${seg.seguro}</p>
                        <p class="text-2xl font-medium text-gray-900">€${total}</p>
                    </div>
                </div>
                <div class="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span class="text-xs font-medium"> % </span>
                </div>
            </article> 
        `
    }, 3000)

    if(localStorage.getItem('cotizacion')){
        const local = document.querySelector('#localSave');
        const datosLocal = JSON.parse(localStorage.getItem('cotizacion'));
        local.innerHTML = `
        <div class="max-w-sm p-3 static lg:absolute lg:top-16 lg:right-0 flex flex-col items-end">
            <p class="bg-white w-max rounded-lg p-2 text-sm flex justify-end font-medium text-lime-600">Tu ultima Cotizacion</p>
            <article class="flex items-end justify-between rounded-lg border border-gray-100 bg-white p-6">
                <div class="flex items-center gap-4">
                    <span class="hidden rounded-full bg-gray-100 p-2 text-gray-600 sm:block">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    </span>
                    <div>
                        <p class="text-sm text-gray-500">Marca: ${datosLocal.tipoMarca}, Año: ${datosLocal.year}</p>
                        <p class="text-sm text-gray-500">Tipo de seguro: ${datosLocal.seguro}</p>
                        <p class="text-2xl font-medium text-gray-900">€${datosLocal.total}</p>
                    </div>
                </div>
                <div class="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span class="text-xs font-medium"> % </span>
                </div>
            </article> 
        </div>
        `
        localStorage.setItem('cotizacion', JSON.stringify(localsave))
    } else {
        localStorage.setItem('cotizacion', JSON.stringify(localsave))
    }
}

