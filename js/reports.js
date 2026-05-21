const selectBtn = document.getElementById("selectDate")
const dateModal = document.getElementById("dateModal")
const closeDateModal = document.getElementById("closeDateModal")
const dateForm = document.getElementById("dateForm")

dateForm.addEventListener("submit", e => {
    e.preventDefault()
    const startDate = document.getElementById("startDate").value
    const endDate = document.getElementById("endDate").value

    if (!startDate || !endDate) return

    generateReport(startDate, endDate)
    
    dateModal.style.display = "none"
    dateForm.reset()
})

selectBtn.addEventListener("click", () => {
    dateModal.style.display = "flex"
})

closeDateModal.addEventListener("click", () => {
    dateModal.style.display = "none"
})

function generateReport(start, end) {
    const history = JSON.parse(localStorage.getItem("history")) || []
    
    const startTimestamp = new Date(start + "T00:00:00").getTime()
    const endTimestamp = new Date(end + "T23:59:59").getTime()

    const filteredHistory = history.filter(vehicle => {
        const time = vehicle.timestmap || vehicle.timestamp
        return time >= startTimestamp && time <= endTimestamp
    })

    // Calculamos las estadísticas del reporte
    let totalVehicles = filteredHistory.length
    let totalEarnings = 0

    filteredHistory.forEach(vehicle => {
        const monto = parseInt(vehicle.totalPagado.replace("Q", ""))
        if (!isNaN(monto)) totalEarnings += monto
    })

    const reportCards = document.querySelectorAll("#reportes .card")
    
    if (reportCards.length >= 3) {
        reportCards[0].innerHTML = `<h3>Vehículos Registrados</h3><h2 style="font-size: 2.5rem; margin: 10px 0;">${totalVehicles}</h2><p>En el rango seleccionado</p>`
        reportCards[1].innerHTML = `<h3>Ganancias Totales</h3><h2 style="font-size: 2.5rem; margin: 10px 0;">Q${totalEarnings}</h2><p>En el rango seleccionado</p>`
        reportCards[2].innerHTML = `<h3>Rango de Fechas</h3><h4 style="margin: 10px 0;">De: ${start} <br> A: ${end}</h4>`
    }

    const reportTableBody = document.getElementById("reportTableBody")
    if (reportTableBody) {
        reportTableBody.innerHTML = ""
        filteredHistory.forEach(vehicle => {
            reportTableBody.innerHTML += `
                <tr>
                    <td>${vehicle.placa}</td>
                    <td>${vehicle.tipo}</td>
                    <td>${vehicle.horaEntrada}</td>
                    <td>${vehicle.horaSalida}</td>
                    <td>${vehicle.tiempoTotal}</td>
                    <td>${vehicle.totalPagado}</td>
                </tr>
            `
        })
    }
}
