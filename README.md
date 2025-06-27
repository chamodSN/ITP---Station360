# 🚗 Station360 – Online Vehicle Service Management System

A comprehensive **MERN stack** web application developed as a second-year, second-semester ITP project at **SLIIT**. Station360 provides vehicle service management functionality with separate dashboards for Admin, Employees, and Users.

![Image](https://github.com/user-attachments/assets/b9c65b14-7eea-4b3d-9951-7ba716741b85)

---

## 👥 Team Members & Responsibilities

| Name                | Responsibility |
|---------------------|----------------|
| **Chamod Nethmina** *(Leader)* | Service and Booking Management |
| **Anudi Induwari**  | Inventory and Notification Management |
| **Lihini Nethmini** | Employee Management (except registration, leave, attendance, schedule) |
| **Akila Herath**    | User and Employee Registration, Vehicle Registration, Authentication |
| **Kavindya Sithumini** | Financial and Customer Support Management |

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Three separate UIs – Admin, Employee, User)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Other:** Cloudinary, Multer, EmailJS, Nodemailer, Puppeteer, Chart.js, PDF generation, Cron Jobs

---

## 📁 Project Structure

- /BACKEND -> All backend logic (APIs, Models, Controllers)
- /frontend -> User-facing UI
- /employee -> Employee dashboard UI
- /admin -> Admin dashboard UI


---

## 🔄 Workflow Overview

### 1. **User and Vehicle Management** *(Akila Herath)*

- Email verification during registration.
- Forgot password flow with email-based reset.
- Users can manage their own vehicles.
- Admin can view, register, update, or delete users & vehicles.
- PDF reports for user registration data.

### 2. **Service & Booking Management** *(Chamod Nethmina)*

- Admin defines services with duration/specifications.
- Time slots are auto-generated based on service duration.
- Users can:
  - Select service, vehicle, preferred date, and time slot.
  - Receive booking confirmation via email.
  - See vehicle service history
- Admin dashboard:
  - Booking categories: Upcoming, Completed, Late.
  - Bookings are locked after a deadline.
  - Booking cancellation includes email with reason.
  - PDF reports and data visualizations via charts.

### 3. **Inventory & Notifications** *(Anudi Induwari)*

- Add/update/delete inventory.
- Auto reorder low-stock items with email to suppliers.
- Expiry management with FIFO stock-out logic.
- Inventory valuation reports in PDF.
- Notification management with priority & visibility settings.

### 4. **Financial & Customer Support** *(Kavindya Sithumini)*

- Track expenses, employee salaries, and income from services.
- Email billing after service completion.
- Admin salary configuration per employee.
- Monthly attendance-based salary generation.
- Contact form: user messages are emailed to admin.

### 5. **Employee & Schedule Management** *(Lihini Nethmini)*

- Employee auto-assignment based on availability & leave.
- Attendance system with check-in, leave marking.
- Admin dashboard shows real-time employee data.
- Leave application and approval workflow.
- PDF export for attendance data.

---

## 📊 Dashboards

- **Admin Dashboard:** Bookings, Inventory, Salaries, Incomes/Expenses with Pie/Bar/Line Charts
- **Employee Dashboard:** Attendance, Work Assignments
- **User Dashboard:** Vehicle info, Bookings, Notifications, Vehicle Service History

---

## Mongodb Database Model

![Image](https://github.com/user-attachments/assets/5b85b886-3152-4d72-ae69-fe55e4f2fdee)

---

## 📦 External Libraries

### Frontend

```json
"axios": "^1.8.4",
"chart.js": "^4.4.9",
"date-fns": "^4.1.0",
"framer-motion": "^12.9.2",
"lucide-react": "^0.503.0",
"react": "^19.0.0",
"react-chartjs-2": "^5.3.0",
"react-datepicker": "^8.3.0",
"react-dom": "^19.0.0",
"react-icons": "^5.5.0",
"react-router-dom": "^7.4.0",
"react-toastify": "^11.0.5",
"zustand": "^5.0.3",
"@emailjs/browser": "^4.4.1" // only for customer support
```
### BACKEND
```json
"bcrypt": "^5.1.1",
"bcryptjs": "^3.0.2",
"cloudinary": "^2.6.0",
"cookie-parser": "^1.4.7",
"cors": "^2.8.5",
"dotenv": "^16.5.0",
"express": "^4.21.2",
"html-pdf": "^3.0.1",
"jsonwebtoken": "^9.0.2",
"moment": "^2.30.1",
"mongoose": "^8.14.1",
"multer": "^1.4.5-lts.1",
"node-cron": "^3.0.3",
"nodemailer": "^6.10.1",
"nodemon": "^3.1.10",
"puppeteer": "^24.8.0",
"speakeasy": "^2.0.0",
"validator": "^13.15.0"
```
## 📄 How to Run Locally

---


### 1. Clone the repository:

```json
git clone url
```

### 2. Install backend dependencies:

```json
cd BACKEND
npm install
```

### 3. Setup .env file in /BACKEND

```json
MONGODB_URI=
CLOUDYNARY_NAME=
CLOUDYNARY_API_KEY=
CLOUDYNARY_SECRET_KEY=
EMAIL_USER=
EMAIL_PASS=
JWT_SECRET=
VITE_BACKEND_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

### 4. Install frontend dependencies:

```json
cd ../frontend && npm install
cd ../employee && npm install
cd ../admin && npm install
```

### 5. Run each frontend app on different ports

```json
npm run dev
```

### 6. Run backend server:

```json
cd ../BACKEND
npm start server
```

---


## ✅ Features Summary


### 🔒 Secure Authentication with Email Verification
### 📅 Smart Time Slot Generation for Bookings
### 📦 Dynamic Inventory with Auto Reorder
### 💰 Income/Expense Tracking with Payroll Integration
### 👥 User/Employee/Admin Role Separation
### 📧 Auto Email Notifications (Booking, Billing, Contact Us)
### 📈 Visual Dashboards with Charts
### 📄 PDF Report Generation

---

## 📬 Contact


Created as a part of the **SLIIT ITP** module.  
For inquiries, please contact team leader **Chamod Nethmina** at [chamodnethminaprofessional@gmail.com](mailto:chamodnethminaprofessional@gmail.com).
