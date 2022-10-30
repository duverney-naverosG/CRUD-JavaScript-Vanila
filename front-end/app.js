//SELECIONAMOS LOS ELEMENTOS NECESARIOS
const containerMedicamentos = document.getElementById("container-cards");
const form = document.getElementById("form");
const form2 = document.getElementById("form2");
const id = document.getElementById("id");
const nombre = document.getElementById("nombreMedicamento");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const foto = document.getElementById("enlaceMedicamento");
const stock = document.getElementById("stock");
//EN ESTE ARREGLO SE VAN A GUARDAR LOS MEDICAMENTOS DE LA API
let medicamentos = [];

//FUNCION QUE MUESTRA LOS MEDICAMENTOS EN EL FRONDEND
const dibujar = async () => {
  containerMedicamentos.innerHTML = "";
  await fetch("http://localhost:3500/api/medicamentos", {
    method: "GET",
    headers: { "Content-type": "application/json;charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((json) => (medicamentos = json))
    .catch((err) => console.log(err));

  console.log(medicamentos);

  medicamentos.forEach((medicamento) => {
    containerMedicamentos.innerHTML += `<div class="col mb-5">
        <div class="card h-100">
            <!-- Product image-->
            <h5 class="fw-semibold fst-italic text-success text-center mt-2">${medicamento.nombre}</h5>
            <!-- Product details-->
            <div class="card-body p-4">
            <img class="card-img-top" src="${medicamento.foto}" alt="..." />
                <div class="text-center mt-2">
                    <!-- Product name-->
                    <!-- Product price-->
                    <p class="fst-italic">${medicamento.descripcion}</p>
                    <p class="text-success"> $ ${medicamento.precio}</p>
                    <p class="text-italic"> STOCK ${medicamento.stock}</p>
                    <input id="prodId"  type="hidden" value="${medicamento.id}">
                </div>
            </div>
            <!-- Product actions-->
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center">
                    <button class="btn btn-warning mt-auto " data-bs-toggle="modal" data-bs-target="#exampleModal2" data-id="${medicamento.id}">editar</button>
                    <button class="btn btn-danger mt-auto" value="${medicamento.id}">eliminar</button>
                </div>
            </div>
        </div>
        </div>`;
  });
};

/*AGREGAMOS EVENTOS AL DIV
en este div hay dos botones; los cuales ejercen distintas funcionalidades
*/
containerMedicamentos.addEventListener("mouseover", (e) => {
    
    //evento para eliminar un medicamentos
  e.path[1].childNodes[3].addEventListener("click", (event) => {
    fetch(`http://localhost:3500/api/medicamentos/${event.path[0].value}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        dibujar();
      })
      .catch((err) => console.log(err));
  });

  //evento para manejar editar un medicamentos
  e.path[1].childNodes[1].addEventListener("click", (e) => {
    //recortamos el signo peso ($ 4500) para que solo quede el numero y lo pasamos a numero
    let precioFinal = parseInt(e.path[3].childNodes[7].childNodes[3].childNodes[7].innerText.slice(1));
    //recortamos la palanra STOCK para que solo quede el numero y lo pasamos a numero
    let stockFinal = parseInt(e.path[3].childNodes[7].childNodes[3].childNodes[9].innerText.slice(5));

    id.value = e.path[3].childNodes[7].childNodes[3].childNodes[11].value
    nombre.value = e.path[3].childNodes[3].innerText;
    descripcion.value = e.path[3].childNodes[7].childNodes[3].childNodes[5].innerText;
    precio.value = precioFinal;
    foto.value = e.path[4].childNodes[1].childNodes[7].childNodes[1].src;
    stock.value = stockFinal;
  });
});

//form para agregar un medicamento
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const datos = {
    nombre: e.path[0][1].value,
    descripcion: e.path[0][2].value,
    precio: e.path[0][3].value,
    foto: e.path[0][4].value,
    stock: e.path[0][5].value,
  };

  form.reset();

  fetch("http://localhost:3500/api/medicamentos/", {
    method: "POST",
    body: JSON.stringify(datos),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
  dibujar();
});

//form para editar un medicamento
form2.addEventListener("submit", (e) => {
    e.preventDefault();
    const datos = {
      nombre :e.path[0][2].value,
      descripcion: e.path[0][3].value,
      precio: e.path[0][4].value,
      foto: e.path[0][5].value,
      stock: e.path[0][6].value,
    };
  
    fetch(`http://localhost:3500/api/medicamentos/${e.path[0][1].value}`, {
        method: "PUT",
        body: JSON.stringify(datos),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
    form2.reset();
    dibujar();
});

//cargar los medicamentos apenas carga el dom
document.addEventListener("DOMContentLoaded", () => {
  dibujar();
});
