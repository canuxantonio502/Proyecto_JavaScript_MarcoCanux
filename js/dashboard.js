const addBtn = document.querySelector(".add-btn")
const vehicleModal = document.getElementById("vehicleModal")
const closeVehicleModal = document.getElementById("closeVehicleModal")
const vehicleForm = document.getElementById("vehicleForm")
const vehicleMessage = document.getElementById("vehicleMessage")
const tableBody = document.querySelector("tbody")
const carSlotsContainer = document.getElementById("carSlots")
const motoSlotsContainer = document.getElementById("motoSlots")
const slotModal = document.getElementById("slotModal")
const closeSlotModal = document.getElementById("closeSlotModal")
const slotInfo = document.getElementById("slotInfo")

// Almacenamos en LocalStorage
let vehicles = JSON.parse(localStorage.getItem("vehicles")) || []

addBtn.addEventListener("click", () => {
    vehicleModal.style.display = "flex"
})

closeVehicleModal.addEventListener("click", () => {
    vehicleModal.style.display = "none"
})

closeSlotModal.addEventListener("click", () => {
    slotModal.style.display = "none"
})

// Generamos los Slots
function generateSlot(type) {
    const carros = [
        "C-01", "C-02", "C-03", "C-04", "C-05",
        "C-06", "C-07", "C-08", "C-09", "C-10"
    ]
    const motos = [
        "M-01", "M-02", "M-03", "M-04", "M-05",
        "M-06", "M-07", "M-08", "M-09", "M-10"
    ]
    const usedSlots = vehicles.map(vehicle => vehicle.slot)
    const availableSlots = (type === "Carro" ? carros : motos)
        .filter(slot => !usedSlots.includes(slot))
    return availableSlots[0] || null
}

// Validamos la placa
function validatePlate(plate, type){
    let regex
    if(type === "Carro"){
        regex = /^P[0-9]{3}[A-Z]{3}$/
    }else if(type === "Moto"){
        regex = /^M[0-9]{3}[A-Z]{3}$/
    }
    return regex.test(plate)
}

// Renderizamos el vehículo en la tabla
function renderVehicles() {
    tableBody.innerHTML = ""
    vehicles.forEach(vehicle => {
        tableBody.innerHTML += `
            <tr>
                <td>${vehicle.placa}</td>
                <td>${vehicle.tipo}</td>
                <td>${vehicle.fecha}</td>
                <td>${vehicle.horaEntrada}</td>
                <td>${vehicle.slot}</td>
                <td>
                    <button id="deleteBt" onclick="deleteVehicle('${vehicle.placa}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `
    })
    renderSlots()
}

// Guardamos em LocalStorage
function saveVehicles() {
    localStorage.setItem("vehicles", JSON.stringify(vehicles))
}

// Eliminamos
function deleteVehicle(plate) {
    vehicles = vehicles.filter(vehicle => vehicle.placa !== plate)
    saveVehicles()
    renderVehicles()
    slotModal.style.display = "none"
}

// ================= REGISTRAR =================
vehicleForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const placa = document.getElementById("placa").value.toUpperCase()
    const tipo = document.getElementById("tipo").value
    if(!validatePlate(placa, tipo)) {
        vehicleMessage.style.color = "red"
        vehicleMessage.textContent = "Formato inválido"
        return
    }

    const existPlate = vehicles.some(
        vehicle => vehicle.placa === placa
    )
    if (existPlate) {
        vehicleMessage.style.color = "red"
        vehicleMessage.textContent = "La placa ya existe"
        return
    }

    const slot = generateSlot(tipo)
    if (!slot) {
        vehicleMessage.style.color = "red"
        vehicleMessage.textContent = "No hay espacios disponibles"
        return
    }

    const now = new Date()
    const fecha = now.toLocaleDateString()
    const horaEntrada = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })

    const vehicle = {
        placa,
        tipo,
        fecha,
        horaEntrada,
        slot,
        estado: "Dentro"
    }

    vehicles.push(vehicle)
    saveVehicles()
    renderVehicles()
    vehicleMessage.style.color = "green"
    vehicleMessage.textContent = "Vehículo registrado"
    vehicleForm.reset()
    setTimeout(() => {
        vehicleModal.style.display = "none"
        vehicleMessage.textContent = ""
    }, 1000)
})

//Iniciamos
renderVehicles()

// Renderizamos el Slot correspondiente
function renderSlots() {
    carSlotsContainer.innerHTML = ""
    motoSlotsContainer.innerHTML = ""
    const carSlots = [
        "C-01", "C-02", "C-03", "C-04", "C-05",
        "C-06", "C-07", "C-08", "C-09", "C-10"
    ]
    const motoSlots = [
        "M-01", "M-02", "M-03", "M-04", "M-05",
        "M-06", "M-07", "M-08", "M-09", "M-10"
    ]

    carSlots.forEach(slot => {
        const vehicle = vehicles.find(v => v.slot === slot)
        const div = document.createElement("div")
        div.classList.add("space")
        if (vehicle) {
            div.classList.add("occupied")
        } else {
            div.classList.add("free")
        }
        div.textContent = slot
        div.addEventListener("click", () => {
            if (vehicle) {
                showVehicleInfo(vehicle)
            }
        })
        carSlotsContainer.appendChild(div)
    })

    motoSlots.forEach(slot => {
        const vehicle = vehicles.find(v => v.slot === slot)
        const div = document.createElement("div")
        div.classList.add("space")
        if (vehicle) {
            div.classList.add("occupied")
        } else {
            div.classList.add("free")
        }
        div.textContent = slot
        div.addEventListener("click", () => {
            if (vehicle) {
                showVehicleInfo(vehicle)
            }
        })
        motoSlotsContainer.appendChild(div)
    })
}

// Modal que muestra la información del vehículo
function showVehicleInfo(vehicle) {
    slotModal.style.display = "flex"
    slotInfo.innerHTML = `
        <div class="slot-info">
            <p><strong>Placa:</strong> ${vehicle.placa}</p>
            <p><strong>Tipo:</strong> ${vehicle.tipo}</p>
            <p><strong>Fecha:</strong> ${vehicle.fecha}</p>
            <p><strong>Hora entrada:</strong> ${vehicle.horaEntrada}</p>
            <p><strong>Slot:</strong> ${vehicle.slot}</p>
            <div class="slot-actions">
                <button class="delete-btn" onclick="deleteVehicle('${vehicle.placa}')">
                    Eliminar
                </button>
            </div>
        </div>
    `
}