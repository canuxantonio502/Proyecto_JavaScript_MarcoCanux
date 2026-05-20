const totalEarnings = document.getElementById("totalEarnings")

function updateEarnings(){
    const parkingHistoryData = JSON.parse(
        localStorage.getItem("history")
    ) || []
    let total = 0
    parkingHistoryData.forEach(vehicle => {
        const monto = parseInt(
            vehicle.totalPagado.replace("Q","")
        )
        if(!isNaN(monto)){
            total += monto
        }
    })
    totalEarnings.textContent = `Q${total}`
}

updateEarnings()