
const historyBody = document.getElementById("historyBody")
const searchHistory = document.getElementById("searchHistory")

let parkingHistory = JSON.parse(
    localStorage.getItem("history")
) || []

function renderHistory(filter = "") {
    historyBody.innerHTML = ""
    const history = JSON.parse(
        localStorage.getItem("history")
    ) || []
    
    const filteredHistory = history.filter(vehicle =>
        vehicle.placa
            .toLowerCase()
            .includes(filter.toLowerCase())
    )
    filteredHistory.forEach(vehicle => {
        historyBody.innerHTML += `
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

searchHistory.addEventListener("input", e => {
    renderHistory(e.target.value)
})

renderHistory()