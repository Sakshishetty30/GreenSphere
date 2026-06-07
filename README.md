# 🌿 GreenSphere: Next-Gen Botanical eCommerce & Telemetry Portal

GreenSphere is a premium, ultra-modern Next.js eCommerce and digital garden telemetry platform. It is engineered for rare, genetically modified botanical specimens equipped with simulated live sensory bio-telemetry. Users can purchase flora specimens, track soil hydration, access diagnostic ledgers, and consult a neural botany assistant.

---

## 🚀 Step-by-Step Getting Started Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher (recommended: `v20.x` or higher)
- **npm**: `v9.x` or higher (bundled with Node.js)

### 2. Dependency Installation
Navigate to the project root directory and run the following command to download and install all required modules (including Next.js, React, Tailwind CSS, and Lucide icons):
```bash
npm install
```

### 3. Running the Development Server
GreenSphere uses Next.js with **Turbopack** for near-instant hot reloading. Start the development server using:
```bash
npm run dev
```
Once started:
- Open your browser to [http://localhost:3000](http://localhost:3000) to view the landing page.
- Modifying files under the `src` directory will hot-reload changes in real-time.

### 4. Running a Production Build
To create an optimized production bundle and compile the application's TypeScript:
```bash
# Compile and build the Next.js production build
npm run build

# Start the compiled production build locally
npm run start
```

---

## 📁 Workspace Architecture

```
Greensphere/
├── src/
│   ├── app/                 # Next.js App Router Pages and Layouts
│   │   ├── admin/           # Administrative Inventory & Sales Ledgers
│   │   ├── checkout/        # Checkout Flow & Address Inputs
│   │   ├── dashboard/       # User Portal (Garden Tracker, Orders, Wishlist)
│   │   ├── products/        # Catalog Filter Grid and Details View
│   │   ├── globals.css      # Custom Styling System Variables
│   │   └── layout.tsx       # Core HTML Shell & Global Font Optimizers
│   ├── components/          # Reusable UI Components & Charts
│   │   ├── ui/              # Primitive Layout Elements (Charts, Widgets)
│   │   ├── AiBot.tsx        # Neural Chatbot Core & Diagnostics Simulator
│   │   └── Navbar.tsx       # Ambient Glowing Header and Navigation
│   └── context/
│       └── AppContext.tsx   # Global Context Provider (Mock DB & Methods)
```

---

## 🔒 Security Hardening & Crash Prevention

This project includes hardened index boundaries and safety falls to protect client-side execution from database state issues.
- **Index Out-of-Bounds Protection**: Recommendations and chatbot searches that retrieve arrays (e.g. `products[2]`) now automatically check array length and object existence before access. If an admin deletes products, the site gracefully renders placeholders instead of raising an unhandled `TypeError` and throwing a blank page.
- **Strict HTTPS Media**: All Unspslash media elements load via encrypted HTTPS links.
- **Local Storage Deserialization**: Context state deserializers catch parsing failures and gracefully fallback to default botanical data arrays.
