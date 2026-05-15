const statCards = document.querySelectorAll(".card h2")

function updateStats(){

    const activeVehicles = vehicles.length

    const activeCars = vehicles.filter(
        vehicle => vehicle.tipo === "Carro"
    ).length

    const activeMotos = vehicles.filter(
        vehicle => vehicle.tipo === "Moto"
    ).length

    const occupiedSlots = vehicles.length

// Actualizamos
    statCards[0].textContent = activeVehicles
    statCards[1].textContent = activeCars
    statCards[2].textContent = activeMotos
    statCards[3].textContent = occupiedSlots
}