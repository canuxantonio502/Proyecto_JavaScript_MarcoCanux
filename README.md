# ParkingControl 🚗🏍️

**ParkingControl** es un sistema web de gestión y control de parqueo desarrollado con tecnologías frontend nativas. Está enfocado en la administración eficiente de vehículos, el control dinámico de espacios y el cálculo automático de cobros en tiempo real.

---

## 📌 Características Principales

### Sistema de Autenticación
*   Inicio de sesión exclusivo para el rol de Administrador.
*   Validación segura de credenciales.
*   Opción para actualizar correo y contraseña de acceso.
*   Persistencia de sesión mediante `LocalStorage`.

### Gestión de Vehículos (CRUD)
*   Registro, lectura, actualización y eliminación de vehículos.
*   Filtro y visualización en tiempo real de vehículos activos.
*   **Validación de placas guatemaltecas:**
    *   **Carros:** Formato `P123ABC`
    *   **Motos:** Formato `M123ABC`

### Control de Parqueo
*   *Slots* dinámicos separados por tipo de vehículo (Carros / Motos).
*   Monitoreo visual de espacios ocupados y libres.
*   Asignación automática de *slots* disponibles.
*   Sistema de prevención de espacios duplicados.
*   Interfaz interactiva para la visualización del estado del parqueo.

### Control de Tiempo y Cobro
*   Registro automatizado de la hora de entrada y salida.
*   Cálculo exacto del tiempo de permanencia.
*   Cálculo automático de la tarifa basada en la siguiente estructura de cobro:

| Vehículo | Tarifa por Hora |
| :--- | :--- |
| **🚗 Carro** | Q10.00 / hr |
| **🏍️ Moto** | Q5.00 / hr |

### Historial de Parqueo
*   Registro persistente de todas las salidas procesadas.
*   Motor de búsqueda optimizado por número de placa.
*   Desglose detallado por registro: Hora de entrada, hora de salida, tiempo total transcurrido y total pagado.

---

## 🛠️ Tecnologías Utilizadas

*   **HTML5** 
*   **CSS3**
*   **JavaScript**
*   **LocalStorage**
*   **GitHuab**

---

## 📂 Estructura del Proyecto

```text
project/
│
├── index.html
├── dashboard.html
│
├── css/
│   ├── index-style.css
│   └── dashboard-style.css
│
├── js/
│   ├── login.js
│   ├── dashboard.js
│   ├── history.js
│   ├── stats.js
│   ├── profile.js
│   └── earnings.js
│
└── assets/
```
---

### :feather: Autores

He aquí los responsables de que este proyecto se haya podido llevar a cabo:

* **Antonio Canux** - *Único colaborador* - [canuxantonio502](https://github.com/canuxantonio502)

