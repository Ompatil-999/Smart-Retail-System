# 🛒 Smart Retail System

### Full-Stack Multi-Store Retail Management SaaS

A production-grade retail management system that enables store owners to manage products, customers, billing, and offers efficiently using a centralized platform.

---

## 🚀 Features

* 🔐 JWT Authentication (Login/Register)
* 🏪 Multi-store support (tenant-based architecture)
* 📦 Product & Category Management
* 👥 Customer Management
* 🧾 Billing & Invoice Generation
* 🎯 Offers & Discounts
* 📊 Dashboard Analytics

---

## 🛠 Tech Stack

### Backend

* Java 17
* Spring Boot
* Spring Security (JWT)
* Hibernate / JPA

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

### Database

* MySQL

### Tools

* Maven
* Postman (API Testing)
* Git & GitHub

---

## 📸 Screenshots

### Billing System

![Billing](./screenshots/billing.png)

### Dashboard

![Dashboard](./screenshots/dashboard.png)

---

## ⚙️ Run Locally

### 1. Clone Repository

```bash
git clone https://github.com/Ompatil-999/Smart-Retail-System.git
cd Smart-Retail-System
```

---

### 2. Database Setup

```bash
mysql -u root -p < schema.sql
```

---

### 3. Environment Variables

Create a `.env` file inside the `backend` folder:

```
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password

MAIL_USERNAME=your-email
MAIL_PASSWORD=your-app-password

JWT_SECRET=your-secret-key
```

---

### 4. Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:
http://localhost:8080

---

### 5. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
http://localhost:5173

---

## 🔗 API Example

**POST** `/api/v1/auth/login`

```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

---

## 🧠 Architecture

```
Controller → Service → Repository → Entity
```

* Clean layered architecture
* DTO + Mapper pattern
* Multi-tenant design using `store_id`

---

## 📌 Project Status

✔ Fully functional (runs locally)
⚠ Deployment in progress

---

## 👤 Author

**Om Patil**

---

## ⭐ Support

If you found this project useful, consider giving it a star ⭐
