# poo# POO - PostMail
# 📦 API POSTMAIL - Gestión de Envíos con Créditos 🚚💳

Este proyecto es una API REST hecha con **Node.js + Express + MongoDB** que permite a los usuarios:

* Comprar créditos
* Registrar envíos
* Eliminar envíos (con reembolso de créditos)
* Ver sus envíos y créditos disponibles
* Consultar productos disponibles

---

## 💠 Tecnologías usadas

* Node.js
* Express
* MongoDB + Mongoose
* Postman para pruebas (opcional)

---

## Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Yahir-Enrique/POO-PostMail.git
cd postmail-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear archivo `.env`

Configúralo así:

```
MONGODB_URI=mongodb://localhost:27017/postmail
PORT=3000
```

> Cambia el URI si estás usando Atlas u otra base.

### 4. Iniciar el servidor

```bash
npm start
```

> El servidor corre en: `http://localhost:3000`

---

## 🥪 Endpoints disponibles

### 🔹 Usuarios

* `GET /usuario/:id/credito`
  Muestra los créditos de un usuario

* `POST /usuario/:id/comprar-creditos`
  Compra créditos (paquetes válidos: `30`, `40`, `60`)

  **Body JSON:**

  ```json
  { "paquete": "30" }
  ```

---

### 🔹 Envíos

* `POST /envios`
  Registra un nuevo envío

  **Body JSON:**

  ```json
  {
    "usuarioId": "USR001",
    "producto": "ID_DEL_PRODUCTO"
  }
  ```

* `GET /envios/:usuarioId`
  Muestra todos los envíos de un usuario

* `DELETE /envios/:envioId`
  Elimina un envío y reembolsa créditos según peso

---

### 🔹 Productos

* `GET /productos`
  Muestra todos los productos disponibles

* `POST /productos` *(Si está habilitado)*
  Crea un nuevo producto

  **Ejemplo JSON:**

  ```json
  {
    "nombre": "Laptop",
    "descripcion": "Una laptop gamer ROG",
    "peso": 4
  }
  ```

---

## Lógica de créditos

Cada usuario tiene una cantidad de **créditos**.
Para registrar un envío, se **descuentan créditos** según el peso del producto.
Si el peso es **≤ 3kg**, cuesta **1 crédito**
Si es **> 3kg**, cuesta `Math.ceil(peso / 3)` créditos
Al eliminar un envío, los créditos se **reembolsan**.

---

## 📁 Estructura del proyecto

```
postmail-api
├── models/
│   ├── usuario.js
│   ├── producto.js
│   └── envio.js
├── services/
│    ├── envioService.js
│    └── database.js
├── routes/
│   └── api.js
├── .env
├── index.js
└── package.json
```

---

## Notas finales

* Puedes usar **MongoDB Compass** para ver la base local.

---

## Autor

Hecho con amor y sufrimiento severo por Yahir Enrique Romero Flores
Desde Lolotique, El Salvador
