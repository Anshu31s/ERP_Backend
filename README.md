
# School ERP System

## Overview

This **School Enterprise Resource Planning (ERP) System** is a comprehensive platform designed to streamline administrative tasks and improve efficiency in managing student, teacher, and school data. The system integrates key features like attendance tracking, grade management, fee payments, analytics, and user-specific access to provide an all-in-one solution for schools.

## Features

- **Student & Teacher Management**: Easily manage all student and teacher profiles, including detailed records and performance data.
- **Attendance Tracking**: Record and monitor daily attendance for students.
- **Grade Management**: Teachers can upload grades privately, ensuring secure access only to the concerned student.
- **Result Viewing**: Students have exclusive access to view their grades. Teachers do not have the ability to view other students' grades.
- **Automated Student Promotion**: Automatically promote students to the next grade based on their current year's performance.
- **Active/Inactive Users**: Mark students or teachers as inactive, preventing their inclusion in ongoing sessions or reports.
- **Syllabus & Result Download**: View and download syllabus and results directly through the ERP.
- **Fee Management**: Manage fee payments with alerts for overdue fees and payment statuses.
- **Report Analytics & Graphs**: Get a visual representation of school data through user-friendly analytics and reports.
- **User-Specific Access**: Role-based access control with permissions for **Admins**, **Teachers**, and **Students**.
  - **Admin**: Full control over all features and data, including CRUD operations for students, teachers, and school settings.
  - **Teacher**: Limited access to mark attendance, upload grades, and manage syllabi.
  - **Student**: Access to grades, attendance, fee payments, syllabus, and resources.

## Technologies Used

### Frontend
- **React**: Framework for building dynamic user interfaces.
- **Redux**: State management for predictable application behavior.
- **Redux Persist**: Maintains the state across sessions (page reloads).
- **Tailwind CSS**: Utility-first CSS framework for rapid and responsive design.
- **Zod**: Schema validation for data handling and form validation.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building APIs.
- **JWT (JSON Web Tokens)**: Secure authentication mechanism.
- **Mongoose**: MongoDB object modeling tool.
- **Cookie Parser**: Middleware for parsing cookies.
- **Bcrypt**: Password hashing for secure authentication.
- **CSURF (CSRF Protection)**: Cross-site request forgery protection middleware.
- **Nodemailer**: Emailing service for notifications and communication.
- **UUID**: Utility for generating unique identifiers.

### Database
- **MongoDB**: NoSQL database used for scalable data storage and querying.

### Payments
- **Razorpay**: Payment gateway for managing school fees and transactions securely.

## Installation

### Prerequisites
- **Node.js**: Ensure Node.js is installed on your machine.
- **MongoDB**: Install and set up MongoDB, or use a cloud service like MongoDB Atlas.

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/Anshu31s/School-ERP-Model.git
    cd school-erp-system
    ```

2. Install the dependencies for both the frontend and backend:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root of the project.
    - Add the following variables:
      ```bash
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      COOKIE_SECRET=your_cookie_secret
      RAZORPAY_KEY=your_razorpay_key
      RAZORPAY_SECRET=your_razorpay_secret
      ```

4. Start the development server:
    ```bash
    npm run dev  # Frontend
    npm start    # Backend
    ```

## Usage

1. **Admin**: Has full control over all modules, including managing students, teachers, grades, attendance, fees, and system settings.
2. **Teacher**: Can mark attendance, upload grades, and manage syllabus-related resources.
3. **Student**: Can view their grades, attendance records, pay fees, download the syllabus, and access other educational resources.

### UI Features:
- **Enhanced User Interface**: Incorporate features like dark mode and personalized dashboards for a more intuitive experience.
- **Mobile Compatibility**: Ensure mobile responsiveness to allow seamless access via smartphones and tablets.

Feel free to expand on any specific areas or add custom features based on the school’s requirements!
