# **Project Plan: Personal Financial Budgeting Site**

## **Overview**

A responsive, user-friendly web app to help individuals manage their personal finances. Users can enter income, expenses, and savings goals, and view their financial trends through charts and summaries. The app also includes a **High-Yield Savings Calculator** to estimate interest earnings. The project begins with building the **React frontend locally**, followed by integrating backend functionality and persistent data storage.

---

## **Phase 1: Frontend Development (Local Only)**

### **Goals**

* Build a fully functional budgeting interface using **React**  
* Include real-time data visualizations (charts, summaries)  
* Add a **High-Yield Savings Calculator**  
* Prepare frontend for future integration with backend

### **Tech Stack**

* **React** (preferably with Vite)  
* **Charting**: Chart.js or Recharts  
* **Styling**: Tailwind CSS or styled-components  
* **Routing**: react-router-dom

---

### **Step 1.1: Project Setup**

* Scaffold React app using Vite  
* Install dependencies:  
  * `react-router-dom`  
  * `chart.js` or `recharts`  
  * `tailwindcss` (optional)  
* Set up file structure and routing  
* Create layout: Navbar, Sidebar (optional), Footer

---

### **Step 1.2: Core UI Features**

* **Dashboard Page**  
  * Total income, expenses, net balance  
  * Pie chart: expenses by category  
  * Line/bar chart: monthly trends  
* **Add Entry Page**  
  * Form to input: amount, category, type (income/expense/saving), date, notes  
  * Data saved in local state (initial phase)  
* **Budget Overview Page**  
  * List view of all entries  
  * Filtering by category/type/date  
  * Summary view at top  
* **Goal Tracker Page**  
  * Set savings goals  
  * Progress bars to show goal completion  
* **Dark Mode Toggle** *(nice UX touch)*

---

### **Step 1.3: High-Yield Savings Calculator Page**

* **Inputs**:  
  * Current savings amount  
  * Interest rate (APY)  
  * Optional: Months to project  
* **Calculations**:  
  * Monthly rate \= `(APY / 100) / 12`  
  * `future_value = principal * (1 + monthly_rate) ^ months`  
  * `interest_earned = future_value - principal`  
* **Outputs**:  
  * Estimated monthly earnings  
  * Total interest over time  
  * Final projected amount  
* **Chart**: Line chart showing growth across months  
* **Optional**: Compare different APYs or add recurring deposits

---

## **Phase 2: Backend \+ Database Integration**

### **Goals**

* Enable persistent data storage  
* Add user accounts and login/logout functionality  
* Sync budget entries and savings data with a backend  
* Secure API endpoints and data access

---

### **Step 2.1: Tech Stack Options**

**Option A: Firebase Stack**

* **Auth**: Firebase Authentication  
* **Database**: Firestore  
* **Hosting (Optional)**: Firebase Hosting

**Option B: Custom Backend**

* **Backend**: Python (FastAPI/Flask) or Node.js (Express)  
* **Database**: PostgreSQL or MongoDB Atlas  
* **Auth**: JWT-based  
* **Hosting**: Azure Functions, Render, or Vercel (for APIs)

---

### **Step 2.2: Authentication**

* User Registration (email \+ password)  
* Login/Logout  
* Store user session using localStorage/context  
* Protect routes in frontend  
* Optional: OAuth with Google for easier sign-in

---

### **Step 2.3: API Development**

Endpoints:

* `POST /entries` – Add new entry  
* `GET /entries` – Fetch all entries for a user  
* `PUT /entries/:id` – Update an entry  
* `DELETE /entries/:id` – Delete entry  
* `GET /summary` – Monthly totals & chart data  
* `GET/POST /goals` – Manage savings goals  
* `POST /savings-calculator` – Save calculator projections (optional)

---

### **Step 2.4: React Integration**

* Replace local state with API-based state  
* Sync form submissions with backend  
* Fetch and render graphs using backend data  
* Loading and error handling states

---

### **Step 2.5: Backend Deployment**

* Host backend API with:  
  * **Azure Functions** (if you want serverless)  
  * **Render** (easy for REST APIs)  
  * **Firebase** (for Firestore-native integration)  
* Secure environment variables and secrets

---

## **Phase 3: Stretch Features**

* Export data as CSV or Excel  
* PDF reports of monthly summaries  
* Budget alerts or reminders  
* Notification system (email or in-app)  
* Compare different savings strategies in calculator  
* Data syncing across devices

---

## **Deliverables**

*  Fully responsive frontend with budgeting tools  
*  High-Yield Savings Calculator  
*  Local development-ready React app  
*  Secure backend with authentication  
*  Persistent user data storage  
*  Graphs and financial insights  
*  Optional stretch features (exports, reports, etc.)

