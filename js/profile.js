const adminBtn = document.getElementById("admin")
const profileModal = document.getElementById("profileModal")
const closeProfileModal = document.getElementById("closeProfileModal")
const profileForm = document.getElementById("profileForm")
const profileMessage = document.getElementById("profileMessage")
const newEmail = document.getElementById("newEmail")
const newPassword = document.getElementById("newPassword")

let admin = JSON.parse(
    localStorage.getItem("admin")
)

adminBtn.addEventListener("click", () => {
    profileModal.style.display = "flex"
    newEmail.value = admin.email
    newPassword.value = admin.password
})

closeProfileModal.addEventListener("click", () => {
    profileModal.style.display = "none"
})

profileForm.addEventListener("submit", e => {
    e.preventDefault()
    admin.email = newEmail.value
    admin.password = newPassword.value
    localStorage.setItem(
        "admin",
        JSON.stringify(admin)
    )
    profileMessage.style.color = "green"
    profileMessage.textContent =
        "Credenciales actualizadas"
    setTimeout(() => {
        window.location.href = "../index.html"
    },1500)
})