const addBtn = document.querySelector(".add-btn")
const vehicleModal = document.getElementById("vehicleModal")
const closeVehicleModal = document.getElementById("closeVehicleModal")
const vehicleForm = document.getElementById("vehicleForm")
const vehicleMessage = document.getElementById("vehicleMessage")
const tableBody = document.querySelector("tbody")
const carSlotsContainer = document.getElementById("carSlots")
const motoSlotsContainer = document.getElementById("motoSlots")
const truckSlotsContainer = document.getElementById("truckSlots")
const slotModal = document.getElementById("slotModal")
const closeSlotModal = document.getElementById("closeSlotModal")
const slotInfo = document.getElementById("slotInfo")
const cards = document.getElementsByClassName("cards")

// Almacenamos en LocalStorage
let vehicles = JSON.parse(localStorage.getItem("vehicles")) || []
let parkingHistoryData = JSON.parse(
    localStorage.getItem("history")
) || []
let editPlate = null

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
        "P-01", "P-02", "P-03", "P-04", "P-05",
        "P-06", "P-07", "P-08", "P-09", "P-10",
        "P-11", "P-12", "P-13", "P-14", "P-15"
    ]
    const motos = [
        "M-01", "M-02", "M-03", "M-04", "M-05",
        "M-06", "M-07", "M-08", "M-09", "M-10",
        "M-11", "M-12", "M-13", "M-14", "M-15"
    ]
    const camiones = [
        "C-01", "C-02", "C-03", "C-04", "C-05",
        "C-06", "C-07", "C-08", "C-09", "C-10",
        "C-11", "C-12", "C-13", "C-14", "C-15"
    ]
    const usedSlots = vehicles.map(vehicle => vehicle.slot)
    const availableSlots = (type === "Carro" ? carros : type === "Moto" ? motos : camiones)
        .filter(slot => !usedSlots.includes(slot))
    return availableSlots[0] || null
}

// Validamos la placa
function validatePlate(plate, type) {
    let regex
    if (type === "Carro") {
        regex = /^P[0-9]{3}[A-Z]{3}$/
    } else if (type === "Moto") {
        regex = /^M[0-9]{3}[A-Z]{3}$/
    } else if (type === "Camión") {
        regex = /^C[0-9]{3}[A-Z]{3}$/
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
    updateStats()
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

function editVehicle(plate) {
    const vehicle = vehicles.find(
        vehicle => vehicle.placa === plate
    )

    if (!vehicle) return

    editPlate = plate
    vehicleModal.style.display = "flex"
    slotModal.style.display = "none"

    document.getElementById("placa").value = vehicle.placa
    document.getElementById("tipo").value = vehicle.tipo
    document.querySelector(".save-btn").textContent =
        "Guardar cambios"
}

// Registramos la salida del vehículo
function vehicleExit(plate) {
    const vehicle = vehicles.find(
        vehicle => vehicle.placa === plate
    )
    if (!vehicle) return

    let historyList = JSON.parse(
        localStorage.getItem("history")
    ) || [] 

    const exitDate = new Date()
    let entryDate = new Date()

    if (vehicle.timestamp) {
        entryDate = new Date(vehicle.timestamp)
    } else {
        const [hours, minutes] =
            vehicle.horaEntrada.split(":")
        entryDate.setHours(parseInt(hours, 10) || 0)
        entryDate.setMinutes(parseInt(minutes, 10) || 0)
        if (exitDate < entryDate) {
            entryDate.setDate(entryDate.getDate() - 1)
        }
    }
    const diffMs = exitDate - entryDate
    let diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
    if (isNaN(diffHours) || diffHours <= 0) diffHours = 1 

    let rate = 0
    if (vehicle.tipo === "Carro") {
        rate = 10
    } else if (vehicle.tipo === "Moto") {
        rate = 5
    } else {
        rate = 20
    }

    const total = diffHours * rate

    vehicle.horaSalida = exitDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })

    vehicle.tiempoTotal = `${diffHours} hora(s)`
    vehicle.totalPagado = `Q${total}`
    vehicle.estado = "Finalizado"
    alert(`Vehículo: ${vehicle.placa}
Tiempo total: ${vehicle.tiempoTotal}
Total: ${vehicle.totalPagado}`)

    historyList.push(vehicle)
    localStorage.setItem(
        "history",
        JSON.stringify(historyList)
    )
    renderHistory()
    vehicles = vehicles.filter(
        v => v.placa !== plate
    )
    saveVehicles()
    renderVehicles()
    updateEarnings()
    slotModal.style.display = "none"
}

// ================= REGISTRAR =================
vehicleForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const placa = document.getElementById("placa").value.toUpperCase()
    const tipo = document.getElementById("tipo").value
    if (!validatePlate(placa, tipo)) {
        vehicleMessage.style.color = "red"
        vehicleMessage.textContent = "Formato inválido"
        return
    }

    const existPlate = vehicles.some(vehicle => {
        if (editPlate) {
            return vehicle.placa === placa &&
                vehicle.placa !== editPlate
        }
        return vehicle.placa === placa
    })

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
        timestmap: now.getTime(),
        slot,
        estado: "Dentro"
    }

    if (editPlate) {
        const index = vehicles.findIndex(
            vehicle => vehicle.placa === editPlate
        )
        vehicles[index] = {
            ...vehicles[index],
            placa,
            tipo
        }
        editPlate = null
    } else {
        vehicles.push(vehicle)
    }

    saveVehicles()
    renderVehicles()
    vehicleMessage.style.color = "green"
    vehicleMessage.textContent =
        editPlate
            ? "Vehículo actualizado"
            : "Vehículo registrado"
    vehicleForm.reset()
    document.querySelector(".save-btn").textContent =
        "Registrar"
    editPlate = null
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
    truckSlotsContainer.innerHTML = ""

    const carSlots = [
        "P-01", "P-02", "P-03", "P-04", "P-05",
        "P-06", "P-07", "P-08", "P-09", "P-10",
        "P-11", "P-12", "P-13", "P-14", "P-15"
    ]
    const motoSlots = [
        "M-01", "M-02", "M-03", "M-04", "M-05",
        "M-06", "M-07", "M-08", "M-09", "M-10",
        "M-11", "M-12", "M-13", "M-14", "M-15"
    ]
    const truckSlots = [
        "C-01", "C-02", "C-03", "C-04", "C-05",
        "C-06", "C-07", "C-08", "C-09", "C-10",
        "C-11", "C-12", "C-13", "C-14", "C-15"
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

    truckSlots.forEach(slot => {
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
        truckSlotsContainer.appendChild(div)
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
                <button class="edit-btn" onclick="editVehicle('${vehicle.placa}')">
                    Editar
                </button>
                <button class="edit-btn" onclick="vehicleExit('${vehicle.placa}')">
                    Salida
                </button>
                <button class="delete-btn" onclick="deleteVehicle('${vehicle.placa}')">
                    Eliminar
                </button>
            </div>
        </div>
    `
}