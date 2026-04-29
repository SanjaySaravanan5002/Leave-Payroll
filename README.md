# Leave and Payroll Management System

A complete MERN stack enterprise application for employee management, leave workflows, monthly payroll processing, payslips, reports, audit logs, email notifications, and RBAC dashboards.

## Tech Stack

- MongoDB + Mongoose
- Express.js + Node.js
- React + Vite
- JWT authentication
- bcrypt password hashing
- node-cron payroll automation
- Nodemailer email notifications

## Project Structure

```text
backend/   Express API, MongoDB models, controllers, services, cron jobs
frontend/  React app, protected routes, role dashboards, API client
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Configure environment files:

- `backend/.env`
- `frontend/.env`

The backend already includes a local development MongoDB URI:

```env
MONGO_URI=mongodb://127.0.0.1:27017/leave_payroll_management
```

For MongoDB Atlas, replace it with:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/leave_payroll_management?retryWrites=true&w=majority
```

3. Seed demo users:

```bash
npm run seed
```

4. Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Demo Login

After seeding:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@company.com | Admin@123 |
| HR Manager | hr@company.com | Hr@12345 |
| Employee | employee@company.com | Employee@123 |

## Important API Endpoints

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`
- `POST /api/leaves`
- `GET /api/leaves`
- `PUT /api/leaves/:id`
- `POST /api/payroll/process`
- `GET /api/payroll/:employeeId`
- `GET /api/reports/summary`
- `GET /api/audit-logs`

## Business Logic

- Employees apply for Casual, Sick, or Paid leave.
- Leave balances are tracked per employee.
- HR/Admin approve or reject leave requests.
- Approved leave days reduce leave balance.
- Payroll uses:

```text
Net Salary = Basic Salary + Allowances - Leave Deductions
```

- Cron automatically processes payroll on the first day of every month at 02:00.
- Payslips can be downloaded from the frontend as HTML files.

