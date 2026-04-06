# 🛒 Smart Retail System

### Full-Stack Multi-Store Retail Management SaaS

A production-grade retail management system that helps store owners manage products, customers, billing, and invoices efficiently.

---

## 🚀 Features

* 🔐 JWT Authentication (Login/Register)
* 🏪 Multi-store support (tenant-based)
* 📦 Product & Category Management
* 👥 Customer Management
* 🧾 Billing & Invoice Generation
* 🎯 Offers & Discounts
* 📊 Dashboard Analytics

---

## 🛠 Tech Stack

### Backend

* Java 17
* Spring Boot 3.2
* Spring Security (JWT)
* Hibernate / JPA

### Frontend

* React 18
* Vite 5
* Tailwind CSS v4
* Axios

### Database

* MySQL 8+

### Tools

* Maven 3.8+
* Node.js 18+
* Git & GitHub

---

## 📸 Screenshots

### 🔐 Login Page

![Login](./screenshots/login.png)

---

### 📊 Dashboard

![Dashboard](./screenshots/dashboard.png)

---

### 🧾 Billing System

![Billing](./screenshots/billing.png)

---

### 📦 Product Management

![Products](./screenshots/product.png)

---

### 🧾 Invoice Preview

![Invoice](./screenshots/invoice.png)

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

Create `.env` inside `backend`:

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

Backend → http://localhost:8080

---

### 5. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend → http://localhost:5173

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

## 📌 Status

✔ Fully functional (runs locally)
⚠ Deployment in progress

---

## 👤 Author

**Om Patil**

---

## ⭐ Support

If you found this useful, give it a star ⭐

