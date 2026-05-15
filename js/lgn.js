let admin = JSON.parse(
    localStorage.getItem("admin")
)

if(!admin){
    admin = {
        email: "admin@campusparking.com",
        password: "Admin123"
    }
    localStorage.setItem(
        "admin",
        JSON.stringify(admin)
    )
}

const loginBtn = document.querySelector("#login-btn")
const loginModal = document.getElementById("loginModal")
const closeModal = document.getElementById("closeModal")
const loginForm = document.getElementById("loginForm")
const message = document.getElementById("message")

loginBtn.addEventListener("click", () => {
    loginModal.style.display = "flex"
})

closeModal.addEventListener("click", () => {
    loginModal.style.display = "none"
})

loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    if (email === admin.email && password === admin.password) {
        message.style.color = "green"
        message.textContent = "Acceso concedido"
        setTimeout(() => {
            window.location.href = "dashboard.html"
        }, 1000)
    } else {
        message.style.color = "red"
        message.textContent = "Credenciales incorrectas"
    }
})
