# Health Compass: Core Features & Architecture

This document outlines the technical architecture and core capabilities of the Health Compass platform.

---

## 1. System Architecture

### 🛡️ Authentication (Secure OAuth 2.0 Integration)
*   **Frontend**: Utilizes industry-standard OAuth 2.0 for a seamless, secure login experience.
*   **Backend**: Verification is performed via secure library integration. Upon successful verification, the backend issues a **JWT (JSON Web Token)** for robust session management and data protection.
*   **Benefits**: Ensures high security and data privacy, essential for medical and caregiving contexts.

### 💰 Integrated Subscription System (Simulated Environment)
*   **Implementation**: A high-fidelity payment processing environment.
*   **Checkout Logic**: Features a realistic checkout experience with real-time card validation and processing states.
*   **Tiered Access**: Implements **Role-Based Access Control (RBAC)** to manage feature availability across Free, Basic, and Pro tiers.

### 🧠 Adaptive Cognitive Assessment Engine
*   **Algorithm**: Utilizes an advanced logic engine that dynamically generates assessment questions.
*   **Calibration**: The engine automatically adjusts question complexity and terminology based on the patient's **Age**, **Education Level**, and **Occupation**.
*   **Adaptive Testing**: Implements a real-time calibration algorithm that modifies subsequent question difficulty based on user performance, ensuring accurate cognitive screening.

### 📄 Professional Clinical Reporting
*   **Reporting Engine**: Built using robust PDF generation libraries (`jspdf`).
*   **Branding**: Features a custom-designed medical interface with a Navy & Sage clinical palette.
*   **Data Analysis**: Aggregates longitudinal patient data and scoring into a structured, multi-page professional report.

### 🏥 Clinical Support Infrastructure
*   **Communication**: Integrated specialist contact system allowing direct communication between caregivers and healthcare providers.
*   **Routing**: Implements secure email headers for direct-reply capabilities.

---

## 2. Technical Stack
*   **Frontend**: React.js, Lucide Icons, Recharts (Data Visualization).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose ODM).

---

## 3. Deployment & Containerization
The platform is fully containerized using **Docker** for cross-environment stability.

### Container Ecosystem:
1.  **`mongodb`**: Secure data persistence.
2.  **`healthcompass-backend`**: Core API and business logic.
3.  **`healthcompass-frontend`**: High-performance user interface.
4.  **`healthcompass-ml`**: Specialized analysis service.

### Deployment Method:
*   Standard deployment via `docker-compose up --build`.

---

## 4. Repository Information
*   **Last Update**: Final system architecture and core feature implementation.
*   **Status**: Production-ready containerized environment.
