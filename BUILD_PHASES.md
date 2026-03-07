# 🚀 **Adetech Quincaillerie - Phase-by-Phase Build Guide**

---

## **📌 OVERVIEW**

This document provides detailed, actionable steps for building each phase of the Adetech Invoice System. Follow these steps sequentially to avoid errors and ensure a solid foundation.

**Timeline**: 12 weeks | **Total Phases**: 11 (0-10)

---

## **PHASE 0: Project Setup & Firebase Configuration** ⚙️
### Duration: Week 1

### 🎯 Objectives:
- Set up the complete development environment
- Configure Firebase backend
- Initialize all required tools and configurations
- Test the foundation

---

### **STEP 0.1: Create and Configure Vite Project**

#### Tasks:
1. **Create Vite project with React + TypeScript**
   ```bash
   npm create vite@latest adetech -- --template react-ts
   cd adetech
   ```

2. **Update `vite.config.ts`**
   - Enable hot module replacement (HMR)
   - Add React plugin configuration
   - Set output directory to `dist`

3. **Verify project structure:**
   ```
   adetech/
   ├── src/
   │   ├── App.tsx
   │   ├── main.tsx
   │   └── index.css
   ├── index.html
   ├── package.json
   ├── tsconfig.json
   ├── vite.config.ts
   └── README.md
   ```

#### Testing:
- [ ] Run `npm run dev` and verify app loads on localhost
- [ ] Check TypeScript compilation has no errors
- [ ] Verify React DevTools extension loads

---

### **STEP 0.2: Install All Dependencies**

#### Tasks:
1. **Install production dependencies (one command)**
   ```bash
   npm install react-router-dom firebase react-hook-form zod @hookform/resolvers lucide-react class-variance-authority clsx tailwind-merge framer-motion @tanstack/react-table @tanstack/react-query date-fns react-day-picker zustand sonner recharts fuse.js pdfjs-dist tesseract.js jspdf jspdf-autotable react-dropzone papaparse uuid i18next react-i18next i18next-browser-languagedetector qrcode.react
   ```

2. **Install dev dependencies**
   ```bash
   npm install -D tailwindcss postcss autoprefixer @types/node @types/react @types/react-dom @types/uuid eslint prettier eslint-config-prettier @vitejs/plugin-react
   ```

3. **Verify all installs**
   ```bash
   npm list --depth=0
   ```

#### Testing:
- [ ] No peer dependency warnings
- [ ] `node_modules` folder created
- [ ] `package-lock.json` updated

---

### **STEP 0.3: Configure TailwindCSS**

#### Tasks:
1. **Initialize Tailwind**
   ```bash
   npx tailwindcss init -p
   ```

2. **Update `tailwind.config.ts`**
   ```typescript
   import type { Config } from "tailwindcss"
   import defaultTheme from "tailwindcss/defaultConfig"

   const config = {
     darkMode: ["class"],
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           border: "hsl(var(--border))",
           input: "hsl(var(--input))",
           ring: "hsl(var(--ring))",
           background: "hsl(var(--background))",
           foreground: "hsl(var(--foreground))",
           primary: {
             DEFAULT: "hsl(var(--primary))",
             foreground: "hsl(var(--primary-foreground))",
           },
         },
       },
     },
     plugins: [require("tailwindcss-animate")],
   } satisfies Config

   export default config
   ```

3. **Update `src/index.css`**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

#### Testing:
- [ ] Tailwind classes work in components
- [ ] CSS file compiles without errors
- [ ] Hot reload works with CSS changes

---

### **STEP 0.4: Configure shadcn/ui**

#### Tasks:
1. **Initialize shadcn/ui**
   ```bash
   npx shadcn-ui@latest init
   ```
   - Choose Typescript: Yes
   - Choose styling: Default
   - Choose base color: Blue

2. **Add all required shadcn/ui components**
   ```bash
   npx shadcn-ui@latest add button card dialog dropdown-menu form input label select sheet table tabs textarea alert avatar badge checkbox combobox command popover progress radio-group scroll-area switch tooltip
   ```

3. **Verify component files**
   - Check `src/components/ui/` folder
   - Verify all 22 components are present

#### Testing:
- [ ] Import a shadcn component and render it
- [ ] Verify styling applies correctly
- [ ] Check dark mode toggling works

---

### **STEP 0.5: Set Up Environment Variables**

#### Tasks:
1. **Create `.env.local` file**
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

2. **Create `.env.example` (for team)**
   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```

3. **Update `.gitignore`**
   ```
   .env.local
   .env.*.local
   node_modules/
   dist/
   ```

#### Testing:
- [ ] `.env.local` is in .gitignore
- [ ] Can access env vars in code: `import.meta.env.VITE_FIREBASE_API_KEY`
- [ ] Variables are not logged to console

---

### **STEP 0.6: Create Firebase Project**

#### Tasks:
1. **Create free Firebase account** at firebase.google.com

2. **Create new project**
   - Project name: `adetech-invoice`
   - Enable Google Analytics (optional)
   - Accept Firebase terms

3. **Copy credentials to `.env.local`**
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

4. **Enable Auth methods**
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Disable other providers for now

#### Testing:
- [ ] Can connect to Firebase from app
- [ ] No auth errors in console

---

### **STEP 0.7: Create Firestore Collections**

#### Tasks:
1. **Create `profiles` collection**
   - Store user profile data
   - Document ID: User UID from Firebase Auth
   - Fields: email, role (admin/staff), created_at

2. **Create `categories` collection**
   - Documents: 'plomberie', 'electricite', 'outillage', 'quincaillerie', 'peinture', 'materiaux'
   - Fields: name, description, created_at

3. **Create `products` collection**
   - Fields: name, category_id, wholesale_price, retail_price, quantity, unit, image_url, created_at, updated_at

4. **Create `clients` collection**
   - Fields: name, phone, email, address, city, tax_id, client_type, created_at

5. **Create `invoices` collection**
   - Fields: invoice_number (unique), client_id, created_by, date, subtotal, discount, tax, total, status (draft/issued/paid), created_at

6. **Create `invoice_items` subcollection** (under invoices)
   - Fields: invoice_id, product_id, quantity, unit_price, line_total

7. **Create `settings` collection**
   - Document ID: 'company'
   - Fields: shop_name, currency, currency_symbol, phone, email, address, tax_id, logo_url, default_language, created_at, updated_at

#### Testing:
- [ ] All collections created in Firebase Console
- [ ] Can add documents via Firebase Console
- [ ] Firestore security rules are set correctly

---

### **STEP 0.8: Create Firebase Storage Buckets**

#### Tasks:
1. **Create `products` storage path**
   - Path: `gs://your-project.appspot.com/products/`
   - For product images (jpg, png, webp)

2. **Create `invoices` storage path**
   - Path: `gs://your-project.appspot.com/invoices/`
   - For PDF files (require authentication)

3. **Create `logos` storage path**
   - Path: `gs://your-project.appspot.com/logos/`
   - For shop logo (public access)

#### Testing:
- [ ] Can upload files via Firebase Console
- [ ] Storage security rules are properly configured
- [ ] File access works as expected

---

### **STEP 0.9: Set Up Project Folder Structure**

#### Tasks:
1. **Create folder structure**
   ```
   src/
   ├── components/
   │   ├── ui/              (shadcn components)
   │   ├── layout/
   │   ├── auth/
   │   ├── dashboard/
   │   ├── products/
   │   ├── clients/
   │   ├── invoices/
   │   └── common/
   ├── pages/
   │   ├── Login.tsx
   │   ├── Dashboard.tsx
   │   ├── Products.tsx
   │   ├── Clients.tsx
   │   ├── Invoices.tsx
   │   └── Settings.tsx
   ├── hooks/
   │   ├── useAuth.ts
   │   ├── useProducts.ts
   │   ├── useClients.ts
   │   └── useInvoices.ts
   ├── services/
   │   ├── firebase.ts
   │   ├── auth.ts
   │   ├── products.ts
   │   ├── clients.ts
   │   └── invoices.ts
   ├── store/
   │   ├── authStore.ts
   │   ├── invoiceStore.ts
   │   └── settingsStore.ts
   ├── types/
   │   ├── database.ts
   │   ├── invoice.ts
   │   └── common.ts
   ├── utils/
   │   ├── formatters.ts
   │   ├── validators.ts
   │   ├── constants.ts
   │   └── helpers.ts
   ├── i18n/
   │   ├── en.json
   │   ├── fr.json
   │   └── config.ts
   ├── App.tsx
   ├── main.tsx
   └── index.css
   ```

#### Testing:
- [ ] All folders created
- [ ] TypeScript paths working (if configured)

---

### **STEP 0.10: Set Up Routing Structure**

#### Tasks:
1. **Create `src/App.tsx`**
   ```typescript
   import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
   import { useAuth } from './hooks/useAuth'
   import Login from './pages/Login'
   import Dashboard from './pages/Dashboard'
   import Products from './pages/Products'
   import Clients from './pages/Clients'
   import Invoices from './pages/Invoices'
   import Settings from './pages/Settings'

   function App() {
     const { user, loading } = useAuth()

     if (loading) return <div>Loading...</div>

     return (
       <BrowserRouter>
         <Routes>
           <Route path="/login" element={<Login />} />
           {user ? (
             <>
               <Route path="/" element={<Dashboard />} />
               <Route path="/products" element={<Products />} />
               <Route path="/clients" element={<Clients />} />
               <Route path="/invoices" element={<Invoices />} />
               <Route path="/settings" element={<Settings />} />
               <Route path="*" element={<Navigate to="/" />} />
             </>
           ) : (
             <Route path="*" element={<Navigate to="/login" />} />
           )}
         </Routes>
       </BrowserRouter>
     )
   }

   export default App
   ```

2. **Create Firebase client** `src/services/firebase.ts`
   ```typescript
   import { initializeApp } from 'firebase/app'
   import { getAuth } from 'firebase/auth'
   import { getFirestore } from 'firebase/firestore'
   import { getStorage } from 'firebase/storage'

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID,
   }

   const app = initializeApp(firebaseConfig)
   export const auth = getAuth(app)
   export const db = getFirestore(app)
   export const storage = getStorage(app)
   ```

3. **Create auth hook** `src/hooks/useAuth.ts`
   ```typescript
   import { useEffect, useState } from 'react'
   import { auth } from '../services/firebase'
   import { User } from 'firebase/auth'

   export function useAuth() {
     const [user, setUser] = useState<User | null>(null)
     const [loading, setLoading] = useState(true)

     useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged((user) => {
         setUser(user)
         setLoading(false)
       })

       return () => unsubscribe()
     }, [])

     return { user, loading }
   }
   ```

#### Testing:
- [ ] App compiles without errors
- [ ] Routes are reachable
- [ ] Auth state is accessible throughout app

---

### **STEP 0.11: Initialize i18n (Internationalization)**

#### Tasks:
1. **Create i18n configuration** `src/i18n/config.ts`
   ```typescript
   import i18n from 'i18next'
   import { initReactI18next } from 'react-i18next'
   import LanguageDetector from 'i18next-browser-languagedetector'
   import frTranslations from './fr.json'
   import enTranslations from './en.json'

   i18n
     .use(LanguageDetector)
     .use(initReactI18next)
     .init({
       resources: {
         fr: { translation: frTranslations },
         en: { translation: enTranslations },
       },
       fallbackLng: 'fr',
       interpolation: { escapeValue: false },
     })

   export default i18n
   ```

2. **Create translation files**
   - `src/i18n/fr.json` (French)
   - `src/i18n/en.json` (English)

3. **Import i18n in `main.tsx`**
   ```typescript
   import './i18n/config'
   ```

#### Testing:
- [ ] i18n initializes without errors
- [ ] Can switch languages
- [ ] Translations load correctly

---

### **STEP 0.12: Test Complete Setup**

#### Final Testing Checklist:
- [ ] `npm run dev` starts without errors
- [ ] No TypeScript compilation errors
- [ ] Firebase connection established
- [ ] Can perform a test auth operation
- [ ] All UI libraries imported and working
- [ ] i18n language toggle works
- [ ] Dark mode toggle works
- [ ] Responsive layout works on mobile

#### Deliverable:
✅ **Complete project foundation with all tools configured and ready for development**

---

---

## **PHASE 1: Authentication & Layout** 🔐
### Duration: Week 2

### 🎯 Objectives:
- Build login/registration system
- Create main app layout with sidebar
- Implement session management
- Add mobile responsiveness

---

### **STEP 1.1: Create Auth Pages**

#### Tasks:
1. **Create Login Page** `src/pages/Login.tsx`
   - Email input field
   - Password input field
   - Login button
   - "Register" link
   - Error messages
   - Loading state

2. **Create Registration Page** `src/pages/Register.tsx`
   - Email input field
   - Password input field (with strength indicator)
   - Confirm password field
   - Register button
   - Admin check (first user is admin)
   - Back to Login link

3. **Create Password Reset Page** `src/pages/ForgotPassword.tsx`
   - Email input field
   - Submit button
   - Confirmation message

#### Implementation with Firebase:
```typescript
// src/services/auth.ts
import { auth } from './firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth'

export async function login(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { data: result, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function register(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { data: result, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function logout() {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error) {
    return { error }
  }
}
```

#### Testing:
- [ ] Login with valid credentials
- [ ] Register new account
- [ ] Password reset email sent
- [ ] Error messages display for invalid inputs
- [ ] Form validation works
- [ ] Loading states show correctly

---

### **STEP 1.2: Create Main Layout**

#### Tasks:
1. **Create Sidebar Component** `src/components/layout/Sidebar.tsx`
   - Logo/shop name
   - Navigation links (Dashboard, Products, Clients, Invoices, Settings)
   - Collapse/expand button (mobile)
   - Current page highlight
   - Lucide icons for each menu item

2. **Create Header Component** `src/components/layout/Header.tsx`
   - Shop name display
   - Dark/light mode toggle
   - Language selector (FR/EN)
   - User menu (profile, logout)
   - Mobile menu button

3. **Create Layout Wrapper** `src/components/layout/MainLayout.tsx`
   - Combine Sidebar + Header
   - Responsive grid layout
   - Mobile drawer for sidebar

#### Testing:
- [ ] Navigation works on all pages
- [ ] Mobile drawer opens/closes
- [ ] Active link is highlighted
- [ ] Layout is responsive

---

### **STEP 1.3: Add Dark Mode Toggle**

#### Tasks:
1. **Install dark mode support** (TailwindCSS handles this)

2. **Create theme toggle hook** `src/hooks/useTheme.ts`
   - Detect system preference
   - Save to localStorage
   - Toggle between light/dark

3. **Add theme toggle to Header**

#### Testing:
- [ ] Theme toggle works
- [ ] Theme persists after page reload
- [ ] All components respect theme
- [ ] CSS applies correctly in both modes

---

### **STEP 1.4: Create User Menu**

#### Tasks:
1. **Create User Menu Component** `src/components/layout/UserMenu.tsx`
   - User avatar (from Lucide)
   - Dropdown with:
     - Profile
     - Settings
     - Logout

2. **Implement Logout Functionality**
   - Clear session
   - Redirect to login
   - Show success toast

#### Testing:
- [ ] User menu opens/closes
- [ ] Logout works
- [ ] User redirected to login
- [ ] Session cleared

---

### **STEP 1.5: Add Protected Routes**

#### Tasks:
1. **Create ProtectedRoute Component** `src/components/auth/ProtectedRoute.tsx`
   ```typescript
   import { Navigate } from 'react-router-dom'
   import { useAuth } from '../hooks/useAuth'

   interface Props {
     children: React.ReactNode
   }

   export function ProtectedRoute({ children }: Props) {
     const { user, loading } = useAuth()

     if (loading) return <div>Loading...</div>
     if (!user) return <Navigate to="/login" />

     return <>{children}</>
   }
   ```

2. **Wrap routes with ProtectedRoute**

#### Testing:
- [ ] Unauthenticated users redirected to login
- [ ] Authenticated users can access pages
- [ ] Route protection works

---

### **STEP 1.6: Implement Auto-Logout**

#### Tasks:
1. **Create useSessionTimeout hook** `src/hooks/useSessionTimeout.ts`
   - Track user inactivity
   - Auto logout after 30 minutes
   - Show warning before logout
   - Reset timer on user activity

2. **Apply to MainLayout**

#### Testing:
- [ ] Timer starts on page load
- [ ] Inactivity triggers logout
- [ ] User activity resets timer
- [ ] Warning dialog shows

---

### **STEP 1.7: Test Complete Auth Flow**

#### Testing Checklist:
- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] Session persists after page reload
- [ ] Protected routes work
- [ ] Auto-logout works
- [ ] Layout is responsive
- [ ] Dark mode works
- [ ] Language switcher works

#### Deliverable:
✅ **Complete authentication system with layout and navigation**

---

---

## **PHASE 2: Dashboard Home** 📊
### Duration: Week 3

### 🎯 Objectives:
- Display key business metrics
- Create dashboard charts
- Show recent activity
- Implement quick actions

---

### **STEP 2.1: Create Dashboard Layout**

#### Tasks:
1. **Create Dashboard Page** `src/pages/Dashboard.tsx`
   - Welcome section
   - Stats cards grid (4 columns, responsive)
   - Charts section
   - Recent invoices list
   - Low stock alerts

#### Testing:
- [ ] Page loads
- [ ] Layout is responsive
- [ ] All sections visible

---

### **STEP 2.2: Build Stats Cards**

#### Tasks:
1. **Create StatsCard Component** `src/components/dashboard/StatsCard.tsx`
   - Icon (from Lucide)
   - Title
   - Value
   - Subtitle (change indicator)
   - Color variants

2. **Display Key Stats**
   - Today's Sales (FCFA)
   - Total Invoices
   - Low Stock Count
   - Monthly Revenue

#### Implementation:
```typescript
// Example stats query with Firestore
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'

const getStats = async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Today's sales
  const invoicesRef = collection(db, 'invoices')
  const q = query(invoicesRef, where('status', '==', 'paid'), where('date', '>=', today))
  const snapshot = await getDocs(q)
  const todaySales = snapshot.docs.map(doc => doc.data().total).reduce((a, b) => a + b, 0)

  // Total invoices count
  const allInvoices = await getDocs(invoicesRef)
  const totalInvoices = allInvoices.size

  // Low stock count
  const productsRef = collection(db, 'products')
  const lowStockQ = query(productsRef, where('quantity', '<', 10))
  const lowStockSnapshot = await getDocs(lowStockQ)
  const lowStock = lowStockSnapshot.size

  return { todaySales, totalInvoices, lowStock }
}
```

#### Testing:
- [ ] Stats cards display
- [ ] Numbers update correctly
- [ ] Currency formatting correct (FCFA)

---

### **STEP 2.3: Create Charts**

#### Tasks:
1. **Install Recharts components**
   - BarChart (Monthly Revenue)
   - PieChart (Top Products)
   - LineChart (Sales Trend)

2. **Create MonthlyRevenueChart** `src/components/dashboard/MonthlyRevenueChart.tsx`
   - Display revenue by month
   - X-axis: Months
   - Y-axis: Amount in FCFA
   - Tooltip with values

3. **Create TopProductsChart** `src/components/dashboard/TopProductsChart.tsx`
   - Pie chart of best sellers
   - Show product names
   - Percentage of total sales

4. **Create SalesTrendChart** `src/components/dashboard/SalesTrendChart.tsx`
   - Line chart of daily sales
   - Last 30 days
   - Trend indicator

#### Implementation Example:
```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export function MonthlyRevenueChart({ data }) {
  return (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
      <Bar dataKey="revenue" fill="#3b82f6" />
    </BarChart>
  )
}
```

#### Testing:
- [ ] Charts render without errors
- [ ] Data displays correctly
- [ ] Responsive on all screen sizes
- [ ] Tooltips show (hover)

---

### **STEP 2.4: Recent Invoices List**

#### Tasks:
1. **Create InvoicesList** `src/components/dashboard/InvoicesList.tsx`
   - Show last 5 invoices
   - Columns: Number, Client, Date, Amount, Status
   - Status badge (Draft, Issued, Paid)
   - Click to view/edit
   - Color-coded status

#### Testing:
- [ ] List displays
- [ ] Data correct
- [ ] Status badges show correctly
- [ ] Click navigation works

---

### **STEP 2.5: Low Stock Alerts**

#### Tasks:
1. **Create LowStockAlert** `src/components/dashboard/LowStockAlert.tsx`
   - Show products with qty < 10
   - Product name, current qty, ideal qty
   - Alert icon (Lucide)
   - Link to Products page

#### Testing:
- [ ] Shows low stock items
- [ ] Correct quantities
- [ ] Link works

---

### **STEP 2.6: Quick Actions Bar**

#### Tasks:
1. **Create QuickActions** `src/components/dashboard/QuickActions.tsx`
   - Button: New Invoice
   - Button: Add Product
   - Button: Add Client
   - Icons from Lucide
   - Navigate to respective pages

#### Testing:
- [ ] Buttons visible
- [ ] Navigation works

---

### **STEP 2.7: Test Complete Dashboard**

#### Testing Checklist:
- [ ] All data loads
- [ ] Charts render
- [ ] Stats update
- [ ] Currency format correct (FCFA)
- [ ] Responsive on all devices
- [ ] Dark mode works
- [ ] Language switching updates all text
- [ ] No console errors

#### Deliverable:
✅ **Fully functional dashboard with real-time statistics and charts**

---

---

## **PHASE 3: Product Management (Stock)** 📦
### Duration: Week 4

### 🎯 Objectives:
- Create product CRUD operations
- Implement stock tracking
- Add search and filtering
- Create category management

---

### **STEP 3.1: Products Page Structure**

#### Tasks:
1. **Create Products Page** `src/pages/Products.tsx`
   - Header with "Add Product" button
   - Search bar (Fuse.js)
   - Category filter dropdown
   - Products table
   - Action buttons (Edit, Delete, View History)

#### Testing:
- [ ] Page loads
- [ ] Layout correct
- [ ] Buttons clickable

---

### **STEP 3.2: Create Products Table**

#### Tasks:
1. **Create ProductsTable** `src/components/products/ProductsTable.tsx`
   - Columns:
     - Product Name
     - Category
     - Wholesale Price (FCFA)
     - Retail Price (FCFA)
     - Stock Quantity
     - Unit
     - Actions (Edit, Delete)
   - Sorting by column
   - Pagination (React Table)
   - Highlight low stock (red for < 10)

#### Implementation:
```typescript
import { useReactTable, getCoreRowModel, createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Product>()

const columns = [
  columnHelper.accessor('name', { header: 'Product' }),
  columnHelper.accessor('category.name', { header: 'Category' }),
  columnHelper.accessor('wholesale_price', { 
    header: 'Wholesale Price',
    cell: (value) => `${value.toLocaleString('fr-FR')} FCFA`
  }),
  columnHelper.accessor('retail_price', {
    header: 'Retail Price',
    cell: (value) => `${value.toLocaleString('fr-FR')} FCFA`
  }),
  columnHelper.accessor('quantity', {
    header: 'Stock',
    cell: (value) => (
      <span className={value < 10 ? 'text-red-600 font-bold' : ''}>
        {value} {product.unit}
      </span>
    )
  }),
]
```

#### Testing:
- [ ] Table renders
- [ ] Sorting works
- [ ] Pagination works
- [ ] Low stock highlighting works
- [ ] Currency format correct

---

### **STEP 3.3: Add Product Form**

#### Tasks:
1. **Create AddProductDialog** `src/components/products/AddProductDialog.tsx`
   - Modal dialog (shadcn/ui)
   - Form fields:
     - Name (text input)
     - Category (select dropdown)
     - Wholesale Price (FCFA)
     - Retail Price (FCFA)
     - Initial Quantity
     - Unit (dropdown: pièce, mètre, kg, litre)
     - Image upload (optional)
   - Validation with Zod
   - Auto-focus on name field
   - Clear form after submit

2. **Create ProductForm** `src/components/products/ProductForm.tsx`
   - Reusable form for add/edit
   - React Hook Form + Zod validation
   - Error messages
   - Submit and Cancel buttons

#### Validation Schema (Zod):
```typescript
import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Product name required'),
  category_id: z.string().uuid('Valid category required'),
  wholesale_price: z.number().min(0, 'Price must be positive'),
  retail_price: z.number().min(0, 'Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  unit: z.enum(['pièce', 'mètre', 'kg', 'litre']),
})
```

#### Testing:
- [ ] Form opens on "Add Product"
- [ ] Validation works
- [ ] Product added to database
- [ ] Success toast shows
- [ ] Table updates
- [ ] Image upload works (optional)

---

### **STEP 3.4: Edit Product**

#### Tasks:
1. **Create EditProductDialog**
   - Load product data into form
   - Pre-fill all fields
   - Update on submit
   - Delete button (with confirmation)

#### Testing:
- [ ] Form pre-fills correctly
- [ ] Edit updates database
- [ ] Delete works (with warning)
- [ ] Table refreshes

---

### **STEP 3.5: Search Products**

#### Tasks:
1. **Implement Product Search** `src/hooks/useProductSearch.ts`
   - Use Fuse.js for fuzzy search
   - Real-time search as user types
   - Search by: name, category, unit
   - Debounced (300ms)

#### Implementation:
```typescript
import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'

export function useProductSearch(products: Product[], query: string) {
  const [results, setResults] = useState(products)

  useEffect(() => {
    if (!query) {
      setResults(products)
      return
    }

    const fuse = new Fuse(products, {
      keys: ['name', 'category.name', 'unit'],
      threshold: 0.3
    })

    const searchResults = fuse.search(query).map(({ item }) => item)
    setResults(searchResults)
  }, [query, products])

  return results
}
```

#### Testing:
- [ ] Search works
- [ ] Results filter correctly
- [ ] Debounce works (no lag with rapid typing)

---

### **STEP 3.6: Category Filter**

#### Tasks:
1. **Create CategoryFilter** `src/components/products/CategoryFilter.tsx`
   - Dropdown select
   - "All Categories" option
   - Filter products by selection

#### Testing:
- [ ] Filter works
- [ ] Table updates
- [ ] "All Categories" shows everything

---

### **STEP 3.7: Stock Adjustment**

#### Tasks:
1. **Create StockAdjustmentDialog**
   - Input new quantity
   - Show previous quantity
   - Reason dropdown (Restock, Adjustment, Sale, Damaged)
   - Timestamp recorded
   - Create history entry

2. **Create StockHistoryTable**
   - Show all adjustments
   - Date, Quantity, Reason, User

#### Testing:
- [ ] Quantity updates
- [ ] History tracks changes
- [ ] Correct user recorded

---

### **STEP 3.8: Test Complete Product Management**

#### Testing Checklist:
- [ ] Add product works
- [ ] Edit product works
- [ ] Delete product works (with dialog)
- [ ] Search filters products
- [ ] Category filter works
- [ ] Stock highlighting works
- [ ] Currency format correct
- [ ] Images upload and display
- [ ] Responsive layout
- [ ] Pagination works
- [ ] No errors in console

#### Deliverable:
✅ **Complete product management system with stock tracking**

---

---

## **PHASE 4: Client Management** 👥
### Duration: Week 5

### 🎯 Objectives:
- Create client database
- Implement client CRUD
- Add purchase history
- Client grouping (professionals/individuals)

---

### **STEP 4.1: Clients Page Structure**

#### Tasks:
1. **Create Clients Page** `src/pages/Clients.tsx`
   - Header with "Add Client" button
   - Search bar
   - Type filter (All, Professionals, Individuals)
   - Clients table
   - Action buttons (Edit, Delete, View History)

#### Testing:
- [ ] Page loads
- [ ] Layout correct

---

### **STEP 4.2: Create Clients Table**

#### Tasks:
1. **Create ClientsTable** `src/components/clients/ClientsTable.tsx`
   - Columns:
     - Name
     - Phone
     - Email
     - City
     - Type (Professional/Individual)
     - Total Purchases
     - Actions

#### Testing:
- [ ] Table renders
- [ ] Data displays correctly

---

### **STEP 4.3: Add Client Form**

#### Tasks:
1. **Create AddClientDialog** `src/components/clients/AddClientDialog.tsx`
   - Form fields:
     - Full Name (required)
     - Phone
     - Email
     - Address
     - City
     - Client Type (dropdown)
     - Tax ID / IFU (for professionals)
   - Validation
   - Phone number format
   - Email validation

#### Validation Schema:
```typescript
export const clientSchema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().optional(),
  email: z.string().email('Valid email required').optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  client_type: z.enum(['professional', 'individual']),
  tax_id: z.string().optional(),
})
```

#### Testing:
- [ ] Form validation works
- [ ] Client added to database
- [ ] Success message shows
- [ ] Table updates

---

### **STEP 4.4: Search & Filter Clients**

#### Tasks:
1. **Implement Client Search** `src/hooks/useClientSearch.ts`
   - Fuse.js search
   - Search by: name, phone, email, city
   - Type filter (Professional/Individual)

#### Testing:
- [ ] Search works
- [ ] Filter works

---

### **STEP 4.5: Client Purchase History**

#### Tasks:
1. **Create ClientDetailsDialog**
   - Show client info
   - Table of all invoices
   - Total spent
   - Last purchase date
   - Edit client button

#### Testing:
- [ ] History displays
- [ ] Total calculations correct
- [ ] Data loads fast

---

### **STEP 4.6: Test Complete Client Management**

#### Testing Checklist:
- [ ] Add client works
- [ ] Edit client works
- [ ] Delete client works
- [ ] Search works
- [ ] Filter works
- [ ] Purchase history shows
- [ ] Currency format correct
- [ ] Responsive layout
- [ ] No errors in console

#### Deliverable:
✅ **Full client database with history tracking**

---

---

## **PHASE 5: Invoice Creator - Core** 📄
### Duration: Week 6-7

### 🎯 Objectives:
- Build invoice creation interface
- Implement real-time calculations
- Add draft/save functionality
- Create invoice preview

---

### **STEP 5.1: Invoice Creator Layout**

#### Tasks:
1. **Create Invoice Creator Page** `src/pages/InvoiceCreator.tsx`
   - Header section (invoice number, date)
   - Client section (selector)
   - Items section (table with add row button)
   - Calculations section (subtotal, discount, tax, total)
   - Action buttons (Save Draft, Preview, Print, PDF)

#### Testing:
- [ ] Layout loads
- [ ] All sections visible

---

### **STEP 5.2: Invoice Header Section**

#### Tasks:
1. **Create InvoiceHeader** `src/components/invoices/InvoiceHeader.tsx`
   - Invoice Number (auto-generated: FACT-2024-001)
   - Date picker (default: today)
   - Due date picker
   - Company info display (shop name, logo, address)
   - Currency display

2. **Auto-generate Invoice Number**
   ```typescript
   import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
   import { db } from '../services/firebase'

   const generateInvoiceNumber = async () => {
     const invoicesRef = collection(db, 'invoices')
     const q = query(invoicesRef, orderBy('created_at', 'desc'), limit(1))
     const snapshot = await getDocs(q)
     
     const lastNumber = snapshot.docs.length > 0 
       ? parseInt(snapshot.docs[0].data().invoice_number.split('-')[2] || '0')
       : 0
     
     const newNumber = String(lastNumber + 1).padStart(3, '0')
     return `FACT-${new Date().getFullYear()}-${newNumber}`
   }
   ```

#### Testing:
- [ ] Invoice number generates
- [ ] Date picker works
- [ ] Company info displays

---

### **STEP 5.3: Client Selector**

#### Tasks:
1. **Create ClientSelector** `src/components/invoices/ClientSelector.tsx`
   - Combobox (shadcn) with search
   - Show: Name, Phone, Email
   - Quick add client option
   - Display selected client info below

#### Testing:
- [ ] Search finds clients
- [ ] Selection updates
- [ ] Client info displays

---

### **STEP 5.4: Invoice Items Section**

#### Tasks:
1. **Create InvoiceItemsTable** `src/components/invoices/InvoiceItemsTable.tsx`
   - Columns:
     - Product (autocomplete)
     - Description
     - Quantity
     - Unit Price (choose between wholesale/retail)
     - Unit
     - Line Total
     - Delete button
   - Add row button
   - Editable cells (inline editing)

2. **Product Autocomplete**
   - Show product name, wholesale price, retail price
   - User selects price type (toggle)
   - Auto-fill fields on selection

#### Implementation:
```typescript
// Inline editable cell
import { useState } from 'react'

function EditableCell({ value, onChange }) {
  const [isEditing, setIsEditing] = useState(false)

  return isEditing ? (
    <input
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setIsEditing(false)}
    />
  ) : (
    <div onClick={() => setIsEditing(true)}>{value}</div>
  )
}
```

#### Testing:
- [ ] Add item row works
- [ ] Product autocomplete works
- [ ] Inline editing works
- [ ] Delete row works
- [ ] Unit selection works

---

### **STEP 5.5: Real-Time Calculations**

#### Tasks:
1. **Create useInvoiceCalculations hook** `src/hooks/useInvoiceCalculations.ts`
   - Calculate subtotal
   - Apply discount (% or fixed amount)
   - Calculate tax (if applicable)
   - Calculate total
   - Update in real-time as items change

#### Implementation:
```typescript
export function useInvoiceCalculations(items: InvoiceItem[], discount: number, tax: number) {
  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0)
  const discountAmount = typeof discount === 'number' && discount > 0
    ? discount > 100
      ? discount // Fixed amount
      : (subtotal * discount) / 100 // Percentage
    : 0
  
  const taxableAmount = subtotal - discountAmount
  const taxAmount = (taxableAmount * tax) / 100
  const total = taxableAmount + taxAmount

  return { subtotal, discountAmount, taxAmount, total }
}
```

#### Testing:
- [ ] Subtotal calculates correctly
- [ ] Discount applies (% and fixed)
- [ ] Tax calculates correctly
- [ ] Total updates in real-time
- [ ] Currency format correct

---

### **STEP 5.6: Calculations Display**

#### Tasks:
1. **Create CalculationsSummary** `src/components/invoices/CalculationsSummary.tsx`
   - Display in right sidebar
   - Subtotal
   - Discount input (% or FCFA toggle)
   - Tax input (%)
   - Grand Total (highlighted)
   - Real-time updates

#### Testing:
- [ ] All values display
- [ ] Inputs update calculations
- [ ] Format correct

---

### **STEP 5.7: Save Draft Functionality**

#### Tasks:
1. **Implement Save as Draft**
   - Save incomplete invoice
   - Can be edited later
   - Status: "Draft"
   - Show confirmation toast

2. **Load Draft Invoice**
   - Create "Load Draft" button on home
   - Show list of drafts
   - Click to continue editing

#### Testing:
- [ ] Draft saves
- [ ] Draft loads
- [ ] Can edit draft
- [ ] Correct status in database

---

### **STEP 5.8: Invoice Preview**

#### Tasks:
1. **Create InvoicePreview** `src/components/invoices/InvoicePreview.tsx`
   - Professional invoice layout
   - All invoice details
   - Formatted numbers
   - Print-ready styling
   - Modal or sidebar display

#### Testing:
- [ ] Preview shows all data
- [ ] Layout is clean
- [ ] Currency format correct
- [ ] Page breaks work for print

---

### **STEP 5.9: Mark as Paid**

#### Tasks:
1. **Add Mark as Paid button**
   - Change status from "Issued" to "Paid"
   - Timestamp recorded
   - Update stats on dashboard

#### Testing:
- [ ] Status changes
- [ ] Timestamp recorded
- [ ] Dashboard updates

---

### **STEP 5.10: Test Complete Invoice Creator**

#### Testing Checklist:
- [ ] Invoice number auto-generates
- [ ] Date picker works
- [ ] Client selector works
- [ ] Add item works
- [ ] Product autocomplete works
- [ ] Inline editing works
- [ ] Delete item works
- [ ] Calculations update in real-time
- [ ] Discount applies correctly
- [ ] Tax calculates correctly
- [ ] Save draft works
- [ ] Preview displays correctly
- [ ] Currency format correct (FCFA)
- [ ] Responsive on all devices
- [ ] No console errors

#### Deliverable:
✅ **Fully functional invoice creation system with real-time calculations**

---

---

## **PHASE 6: PDF & Image Extraction** 📸
### Duration: Week 8

### 🎯 Objectives:
- Implement PDF & image upload
- Extract text using OCR
- Parse data into invoice items
- Manual correction interface

---

### **STEP 6.1: Upload Section**

#### Tasks:
1. **Create FileUploadZone** `src/components/extraction/FileUploadZone.tsx`
   - Drag & drop area
   - File browser button
   - Supported formats: PDF, JPG, PNG
   - File size limit: 10MB
   - Preview uploaded file

#### Implementation (react-dropzone):
```typescript
import { useDropzone } from 'react-dropzone'

function FileUploadZone() {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    maxSize: 10485760, // 10MB
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag files here or click to browse</p>
    </div>
  )
}
```

#### Testing:
- [ ] Drag & drop works
- [ ] File browser works
- [ ] File size validated
- [ ] Formats validated

---

### **STEP 6.2: PDF Text Extraction**

#### Tasks:
1. **Create PDF extraction service** `src/services/extraction.ts`
   - Use pdf.js
   - Extract all text from PDF
   - Maintain line structure
   - Handle multi-page PDFs

#### Implementation:
```typescript
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise

  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map(item => 'str' in item ? item.str : '').join(' ')
    text += pageText + '\n'
  }

  return text
}
```

#### Testing:
- [ ] PDF text extracts
- [ ] Text is readable
- [ ] Multi-page works
- [ ] Special characters handled

---

### **STEP 6.3: Image OCR**

#### Tasks:
1. **Create OCR service** `src/services/ocr.ts`
   - Use Tesseract.js
   - Support French & English
   - Extract text from images
   - Show progress

#### Implementation:
```typescript
import Tesseract from 'tesseract.js'

export async function extractTextFromImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(file, ['fra', 'eng'], {
      logger: (m) => onProgress?.(m.progress * 100)
    })
      .then(({ data: { text } }) => resolve(text))
      .catch(reject)
  })
}
```

#### Testing:
- [ ] Image OCR works
- [ ] French text recognized
- [ ] English text recognized
- [ ] Progress shows
- [ ] Accuracy is acceptable (>80%)

---

### **STEP 6.4: Data Parsing**

#### Tasks:
1. **Create text parser** `src/services/parser.ts`
   - Extract items from text
   - Find quantities, prices, product names
   - Match prices to FCFA format
   - Use regex patterns

#### Implementation:
```typescript
export function parseInvoiceItems(text: string) {
  const items = []
  
  // Pattern: Product name - Quantity - Price
  const regex = /([^-]+?)\s*[-–]\s*(\d+[\.,]\d*|[\d\s]+)\s*[-–]\s*(\d+[\s.,]*\d*)\s*(?:FCFA|CFA|F)?/gi
  
  let match
  while ((match = regex.exec(text)) !== null) {
    items.push({
      product_name: match[1].trim(),
      quantity: parseFloat(match[2].replace(',', '.')),
      price: parseFloat(match[3].replace(/[\s.]/g, '').replace(',', '.')),
    })
  }

  return items
}
```

#### Testing:
- [ ] Parses items correctly
- [ ] Extracts quantities
- [ ] Extracts prices
- [ ] Matches FCFA format

---

### **STEP 6.5: Extracted Data Review**

#### Tasks:
1. **Create ExtractionReview** `src/components/extraction/ExtractionReview.tsx`
   - Display extracted items in table
   - Columns: Product, Quantity, Price, Date
   - Editable cells for correction
   - Select/deselect checkboxes
   - "Add Selected to Invoice" button

#### Testing:
- [ ] Items display
- [ ] Checkboxes work
- [ ] Inline editing works
- [ ] Button click adds items

---

### **STEP 6.6: Extraction Progress**

#### Tasks:
1. **Add ProgressIndicator**
   - Show upload progress
   - OCR progress (for images)
   - Parsing progress
   - Cancel option

#### Testing:
- [ ] Progress shows
- [ ] Updates correctly
- [ ] Cancel works

---

### **STEP 6.7: Integration with Invoice Creator**

#### Tasks:
1. **Create "Extract Items" feature**
   - New button in Invoice Creator: "Add from PDF/Image"
   - Opens file upload modal
   - Extracts data
   - Shows review UI
   - Adds to invoice items

#### Testing:
- [ ] Flow works end-to-end
- [ ] Items added to invoice
- [ ] Calculations update

---

### **STEP 6.8: Test Complete Extraction**

#### Testing Checklist:
- [ ] PDF upload works
- [ ] Image upload works
- [ ] PDF text extraction works
- [ ] OCR works (FR & EN)
- [ ] Data parsing works
- [ ] Review UI works
- [ ] Editing works
- [ ] Add to invoice works
- [ ] Progress shows
- [ ] Error handling works
- [ ] No console errors

#### Deliverable:
✅ **Smart document extraction with OCR and intelligent parsing**

---

---

## **PHASE 7: Settings & Internationalization** ⚙️
### Duration: Week 9

### 🎯 Objectives:
- Create settings panel
- Configure company information
- Implement language switching
- Currency formatting

---

### **STEP 7.1: Settings Page**

#### Tasks:
1. **Create Settings Page** `src/pages/Settings.tsx`
   - Tab-based layout:
     - Company Info
     - Currency & Format
     - Language
     - Invoice Defaults
     - Backup & Export (future)

#### Testing:
- [ ] Page loads
- [ ] Tabs work

---

### **STEP 7.2: Company Settings**

#### Tasks:
1. **Create CompanySettings** `src/components/settings/CompanySettings.tsx`
   - Shop name
   - Address
   - Phone
   - Email
   - Logo upload
   - Tax ID (IFU/NINEA)
   - Invoice footer text
   - Default payment terms (days)

#### Implementation:
```typescript
export const companySettingsSchema = z.object({
  shop_name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  logo_url: z.string().optional(),
  tax_id: z.string().optional(),
  invoice_footer: z.string().optional(),
  payment_terms_days: z.number().default(30),
})
```

#### Testing:
- [ ] Form loads
- [ ] Values save
- [ ] Logo uploads
- [ ] Changes apply elsewhere

---

### **STEP 7.3: Currency Settings**

#### Tasks:
1. **Create CurrencySettings** `src/components/settings/CurrencySettings.tsx`
   - Primary currency: FCFA (XOF)
   - Currency symbol options: FCFA / CFA / F CFA
   - Decimal format: 1.000,00 or 1,000.00
   - Thousands separator toggle
   - Secondary currencies (USD, EUR) for reference

#### Testing:
- [ ] Currency displays correctly
- [ ] Format updates everywhere
- [ ] Symbol preference works

---

### **STEP 7.4: Language Settings**

#### Tasks:
1. **Create LanguageSettings** `src/components/settings/LanguageSettings.tsx`
   - Language selector: French; English
   - Preview text in each language
   - Save preference
   - Apply immediately

2. **Update i18n configuration**
   - Add French and English translation files
   - Translate all UI strings
   - Format currency in each language

#### Translation Files Structure:
```json
// src/i18n/fr.json
{
  "navigation": {
    "dashboard": "Accueil",
    "products": "Produits",
    "clients": "Clients",
    "invoices": "Factures"
  },
  "invoice": {
    "subtotal": "Sous-total",
    "discount": "Remise",
    "tax": "TVA",
    "total": "Total TTC"
  }
}
```

#### Testing:
- [ ] Language switching works
- [ ] All UI text translates
- [ ] Preference saves
- [ ] Applies on reload

---

### **STEP 7.5: Invoice Defaults**

#### Tasks:
1. **Create InvoiceDefaultsSettings** `src/components/settings/InvoiceDefaultsSettings.tsx`
   - Default discount (%)
   - Default tax rate (%)
   - Invoice number prefix (FACT-)
   - Next invoice number
   - Due date default (days after invoice date)
   - Default payment type (Cash, Check, Transfer)

#### Testing:
- [ ] Settings save
- [ ] New invoices use defaults
- [ ] Can override per invoice

---

### **STEP 7.6: Create Settings Store**

#### Tasks:
1. **Create Zustand settings store** `src/store/settingsStore.ts`
   - Load settings from database
   - Update settings
   - Persist to localStorage
   - Use in components via custom hook

#### Implementation:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Settings {
  shop_name: string
  currency: string
  language: string
  invoice_prefix: string
}

export const useSettingsStore = create<Settings>()(
  persist(
    (set) => ({
      shop_name: 'Adetech Quincaillerie',
      currency: 'XOF',
      language: 'fr',
      invoice_prefix: 'FACT-',
    }),
    { name: 'settings-storage' }
  )
)
```

#### Testing:
- [ ] Settings store initializes
- [ ] Settings load from DB
- [ ] Settings persist
- [ ] Updates in components

---

### **STEP 7.7: Apply Settings Throughout App**

#### Tasks:
1. **Use currency format in components**
   - Create `useCurrencyFormat` hook
   - Apply to all price displays

2. **Use language setting**
   - Already via i18next

3. **Use company name**
   - Apply to header, invoices, etc.

#### Testing:
- [ ] Currency format updates everywhere
- [ ] Language updates everywhere
- [ ] Company name updates everywhere

---

### **STEP 7.8: Test Complete Settings**

#### Testing Checklist:
- [ ] Company settings save/load
- [ ] Currency format updates everywhere
- [ ] Language switching works (FR/EN)
- [ ] All UI text translates
- [ ] Invoice defaults apply to new invoices
- [ ] Logo displays everywhere
- [ ] Settings persist after reload
- [ ] Responsive layout
- [ ] No console errors

#### Deliverable:
✅ **Fully configured settings panel with multilingual interface**

---

---

## **PHASE 8: Invoice List & Reports** 📊
### Duration: Week 10

### 🎯 Objectives:
- Create invoice history list
- Implement filters and search
- Generate reports
- Export functionality

---

### **STEP 8.1: Invoices List Page**

#### Tasks:
1. **Create Invoices Page** `src/pages/Invoices.tsx`
   - Header with "New Invoice" button, "Export" button
   - Search bar
   - Filter section (Status, Date Range)
   - Invoices table
   - Action buttons (View, Edit, Download PDF, Delete)

#### Testing:
- [ ] Page loads
- [ ] Layout correct
- [ ] Buttons visible

---

### **STEP 8.2: Invoices Table**

#### Tasks:
1. **Create InvoicesTable** `src/components/invoices/InvoicesTable.tsx`
   - Columns:
     - Invoice Number
     - Client Name
     - Date
     - Amount (FCFA)
     - Status (Draft, Issued, Paid) - color coded
     - Actions
   - Sorting by column
   - Pagination
   - Click row to open details

#### Testing:
- [ ] Table renders
- [ ] Sorting works
- [ ] Pagination works
- [ ] Status badges display

---

### **STEP 8.3: Search & Filter**

#### Tasks:
1. **Create InvoiceSearchBar** `src/components/invoices/InvoiceSearchBar.tsx`
   - Search by invoice number or client name
   - Use Fuse.js

2. **Create InvoiceFilters** `src/components/invoices/InvoiceFilters.tsx`
   - Status filter (All, Draft, Issued, Paid)
   - Date range picker
   - Combine filters

#### Testing:
- [ ] Search works
- [ ] Filter works
- [ ] Combined filtering works

---

### **STEP 8.4: Invoice Details View**

#### Tasks:
1. **Create InvoiceDetailsModal** `src/components/invoices/InvoiceDetailsModal.tsx`
   - Show full invoice details
   - All items
   - Calculations
   - Client information
   - Edit button
   - Print button
   - Download PDF button
   - Delete button

#### Testing:
- [ ] Modal opens
- [ ] Details display
- [ ] All buttons functional

---

### **STEP 8.5: Invoice Edit**

#### Tasks:
1. **Create invoice edit functionality**
   - Open invoice in creator
   - Modify items
   - Save changes
   - Only for draft/issued invoices

#### Testing:
- [ ] Edit opens invoice
- [ ] Changes save
- [ ] Calculations update

---

### **STEP 8.6: Reports Section**

#### Tasks:
1. **Create ReportsPage** `src/pages/Reports.tsx`
   - Tab-based layout for different reports

2. **Daily Sales Report**
   - Date selector
   - Total sales (FCFA)
   - Number of invoices
   - Average invoice value
   - Top products sold

3. **Monthly Revenue Report**
   - Chart of revenue by month
   - Total for selected period
   - Trend indicator

4. **Top Products Report**
   - List of best sellers
   - Quantity sold
   - Revenue per product
   - Chart visualization

5. **Client Sales Report**
   - Client name
   - Total spent
   - Number of invoices
   - avg invoice value
   - Last purchase date

#### Testing:
- [ ] Each report loads
- [ ] Data displays correctly
- [ ] Charts render
- [ ] Date selectors work

---

### **STEP 8.7: Export Functionality**

#### Tasks:
1. **Create CSV export** (using papaparse)
   - Export invoices to CSV
   - Export reports to CSV
   - Include all relevant data
   - Proper column headers

2. **Create Excel export** (optional)
   - Use XLSX library if needed
   - Proper formatting

#### Implementation:
```typescript
import Papa from 'papaparse'

export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}
```

#### Testing:
- [ ] CSV exports
- [ ] File downloads
- [ ] Data complete
- [ ] Format correct

---

### **STEP 8.8: Test Complete Invoice Management**

#### Testing Checklist:
- [ ] List displays all invoices
- [ ] Search works
- [ ] Filter works (status, date)
- [ ] Pagination works
- [ ] View details works
- [ ] Edit invoice works
- [ ] Delete works (with dialog)
- [ ] All reports load
- [ ] Reports display correct data
- [ ] Charts render
- [ ] Export to CSV works
- [ ] Currency format correct
- [ ] Responsive layout
- [ ] Dark mode works
- [ ] No console errors

#### Deliverable:
✅ **Complete invoice history with advanced filtering, reports, and export**

---

---

## **PHASE 9: Print Features** 🖨️
### Duration: Week 11

### 🎯 Objectives:
- Create print-ready invoice layout
- Implement watermarks
- Add signature and stamp areas
- Print functionality

---

### **STEP 9.1: Invoice Print Layout**

#### Tasks:
1. **Create PrintInvoice** `src/components/invoices/PrintInvoice.tsx`
   - Professional invoice template
   - Company header with logo
   - Client information
   - Invoice details (number, date)
   - Itemized table with totals
   - Footer with terms/company info

#### Implementation:
```typescript
import { useReactToPrint } from 'react-to-print'

export function PrintInvoice({ invoice }) {
  const printRef = useRef<HTMLDivElement>(null)
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${invoice.number}`,
  })

  return (
    <>
      <div ref={printRef} className="print-only">
        {/* Invoice content */}
      </div>
      <button onClick={handlePrint}>Print</button>
    </>
  )
}
```

#### Testing:
- [ ] Layout displays correctly
- [ ] All data present
- [ ] Formatting clean
- [ ] Page breaks work
- [ ] Print preview works

---

### **STEP 9.2: Watermark Feature**

#### Tasks:
1. **Create WatermarkSettings** `src/components/invoices/WatermarkSettings.tsx`
   - Toggle watermark on/off
   - Watermark text input (PAID, ACQUITTÉ, DRAFT, etc.)
   - Position (center, diagonal)
   - Opacity slider
   - Color picker

2. **Add watermark to invoice**
   - Overlay text on invoice
   - CSS: `position: fixed`, opacity, transform

#### Implementation:
```typescript
function InvoiceWithWatermark({ invoice, watermark }) {
  return (
    <div className="relative">
      {watermark.enabled && (
        <div
          className="fixed inset-0 pointer-events-none flex items-center justify-center"
          style={{
            opacity: watermark.opacity / 100,
            transform: 'rotate(-45deg)',
            zIndex: 10,
          }}
        >
          <span className="text-6xl font-bold text-gray-400">
            {watermark.text}
          </span>
        </div>
      )}
      {/* Invoice content */}
    </div>
  )
}
```

#### Testing:
- [ ] Watermark displays
- [ ] Toggle works
- [ ] Customization works
- [ ] Prints correctly
- [ ] Opacity works

---

### **STEP 9.3: Signature Block**

#### Tasks:
1. **Create SignatureBlock** `src/components/invoices/SignatureBlock.tsx`
   - Designated area for signature
   - Label: "Authorized Signature"
   - Date line
   - Name line below signature

#### Testing:
- [ ] Block displays
- [ ] Space for writing
- [ ] Prints correctly

---

### **STEP 9.4: Stamp Box**

#### Tasks:
1. **Create StampBox** `src/components/invoices/StampBox.tsx`
   - Rectangle area labeled "Stamp"
   - Can be toggled on/off
   - For company stamp after printing

#### Testing:
- [ ] Box displays
- [ ] Toggle works
- [ ] Prints correctly

---

### **STEP 9.5: Print Options**

#### Tasks:
1. **Create PrintOptions** `src/components/invoices/PrintOptions.tsx`
   - Checkboxes:
     - Include watermark?
     - Include signature block?
     - Include stamp box?
     - Include company info?
   - Show preview as options change
   - Print button
   - Save as PDF button

#### Testing:
- [ ] Options update preview
- [ ] Print works with options
- [ ] Save as PDF works
- [ ] All combinations work

---

### **STEP 9.6: PDF Generation**

#### Tasks:
1. **Use jsPDF to save as PDF**
   - Convert invoice to PDF
   - Maintain formatting
   - Include all selected options
   - File naming: `Invoice-{number}.pdf`

#### Implementation:
```typescript
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function downloadInvoicePDF(invoiceElement: HTMLElement, filename: string) {
  const canvas = await html2canvas(invoiceElement)
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const imgWidth = 210 // A4 width in mm
  const pageHeight = 297 // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
  pdf.save(filename)
}
```

#### Testing:
- [ ] PDF generates
- [ ] Formatting preserved
- [ ] File downloads
- [ ] Watermark included if selected

---

### **STEP 9.7: Print Multiple Copies**

#### Tasks:
1. **Add quantity selector**
   - Input: Number of copies
   - Print button
   - Repeats invoice for each copy

#### Testing:
- [ ] Multiple copies print
- [ ] Count correct
- [ ] Quality maintained

---

### **STEP 9.8: Test Complete Print Features**

#### Testing Checklist:
- [ ] Invoice prints cleanly
- [ ] Layout is professional
- [ ] Watermark displays and prints
- [ ] Watermark toggle works
- [ ] Signature block displays
- [ ] Stamp box displays
- [ ] Print options work
- [ ] Print preview shows correctly
- [ ] PDF downloads
- [ ] PDF formatting correct
- [ ] Multiple copies work
- [ ] Responsive print layout
- [ ] Works in all browsers
- [ ] No console errors

#### Deliverable:
✅ **Professional print features with watermarks, signatures, and PDF export**

---

---

## **PHASE 10: Polish, Testing & Deployment** 🚀
### Duration: Week 12

### 🎯 Objectives:
- UI/UX refinement
- Comprehensive testing
- Performance optimization
- Deploy to production

---

### **STEP 10.1: UI/UX Polish**

#### Tasks:
1. **Add Page Transitions** (using Framer Motion)
   - Smooth fade-in/fade-out
   - Slide transitions between pages
   - Consistent animation duration (300ms)

2. **Create Loading Skeletons**
   - Table skeleton
   - Card skeleton
   - Form skeleton
   - Use shadcn Skeleton component

3. **Toast Notifications** (using Sonner)
   - Success messages (green)
   - Error messages (red)
   - Warning messages (yellow)
   - Auto-dismiss after 3 seconds
   - Action buttons for undo

4. **Confirmation Dialogs**
   - Delete operations
   - Mark as paid
   - Logout
   - Use shadcn Dialog

5. **Empty States**
   - No invoices message with "Create first invoice" button
   - No products message with "Add first product" button
   - No clients message
   - Relevant icon and message

6. **Error Boundaries** `src/components/ErrorBoundary.tsx`
   - Catch React errors
   - Display fallback UI
   - Error detail in dev mode
   - Reload button

#### Testing:
- [ ] Transitions smooth
- [ ] Skeletons load quickly
- [ ] Toasts display/dismiss
- [ ] Dialogs confirm actions
- [ ] Empty states helpful
- [ ] Error boundaries work

---

### **STEP 10.2: Responsive Testing**

#### Tasks:
1. **Test Mobile (375px width)**
   - All pages functional
   - Touch friendly (buttons 44px+)
   - No horizontal scroll
   - Mobile menu works
   - Forms fit screen

2. **Test Tablet (768px width)**
   - Layout optimized
   - Tables collapsible
   - Sidebar visible/hidden appropriately

3. **Test Desktop (1920px width)**
   - Full layout
   - Multi-column layouts
   - Sidebar visible

4. **Test Print Layout**
   - Invoice prints on A4
   - No header/footer in print
   - Correct page breaks
   - QR code visible if used

#### Tools:
- Firefox DevTools
- Chrome DevTools
- Safari DevTools
- Real devices

#### Testing:
- [ ] Mobile: 375px, 414px, 414px
- [ ] Tablet: 768px, 1024px
- [ ] Desktop: 1366px, 1920px
- [ ] Print: A4 page
- [ ] Landscape & Portrait modes
- [ ] Touch gestures work
- [ ] No layout breaks

---

### **STEP 10.3: Feature Testing**

#### Tasks:
1. **Authentication**
   - [ ] Register new account
   - [ ] Login with email/password
   - [ ] Invalid credentials rejected
   - [ ] Password reset email sent
   - [ ] Session persists
   - [ ] Auto-logout works
   - [ ] Logout clears session

2. **Products**
   - [ ] Add product
   - [ ] Edit product
   - [ ] Delete product
   - [ ] Search products
   - [ ] Filter by category
   - [ ] Stock quantities update
   - [ ] Low stock highlighting
   - [ ] Image upload/display
   - [ ] CSV export

3. **Clients**
   - [ ] Add client
   - [ ] Edit client
   - [ ] Delete client
   - [ ] Search clients
   - [ ] View purchase history
   - [ ] Filter by type

4. **Invoices**
   - [ ] Create invoice
   - [ ] Add items
   - [ ] Product autocomplete
   - [ ] Inline editing
   - [ ] Real-time calculations
   - [ ] Discount applies
   - [ ] Tax calculates
   - [ ] Save draft
   - [ ] Edit draft
   - [ ] Mark as paid
   - [ ] Print invoice
   - [ ] Download PDF
   - [ ] Watermark renders
   - [ ] Signature block displays
   - [ ] Stamp box displays

5. **PDF Extraction**
   - [ ] Upload PDF
   - [ ] Extract text
   - [ ] Upload image
   - [ ] OCR (French)
   - [ ] OCR (English)
   - [ ] Review extracted items
   - [ ] Add to invoice
   - [ ] Edit extracted data

6. **Calculations**
   - [ ] Subtotal correct
   - [ ] Discount % correct
   - [ ] Discount FCFA correct
   - [ ] Tax calculation correct
   - [ ] Total correct
   - [ ] Currency format FCFA
   - [ ] Thousands separator correct

7. **Currency & Language**
   - [ ] All prices in FCFA
   - [ ] Format: 1.000,00 FCFA
   - [ ] Language toggle FR/EN
   - [ ] All UI text translates
   - [ ] French translations accurate
   - [ ] English translations accurate
   - [ ] Currency symbol consistent

8. **Settings**
   - [ ] Company info saves
   - [ ] Logo uploads
   - [ ] Watermark settings work
   - [ ] Currency format updates
   - [ ] Language changes apply
   - [ ] Defaults apply to invoices

9. **Reports**
   - [ ] Daily sales report
   - [ ] Monthly revenue chart
   - [ ] Top products report
   - [ ] Client sales report
   - [ ] Charts accurate
   - [ ] Export to CSV
   - [ ] Data complete

10. **Dashboard**
    - [ ] Stats cards update
    - [ ] Charts render
    - [ ] Recent invoices show
    - [ ] Low stock alerts show
    - [ ] Quick actions work

#### Testing Checklist:
- [ ] All CRUD operations work
- [ ] All calculations correct
- [ ] All data persists
- [ ] No data loss scenarios
- [ ] Error messages helpful
- [ ] Success messages clear

---

### **STEP 10.4: Performance Optimization**

#### Tasks:
1. **Code Splitting**
   - Lazy load route components
   - Separate bundles by route

2. **Image Optimization**
   - Compress images
   - Use WebP where supported
   - Responsive images

3. **Bundle Analysis**
   - Analyze with Vite
   - Identify large packages
   - Tree-shake unused code

4. **API Optimization**
   - Pagination on lists
   - Infinite scroll if needed
   - Cache frequently accessed data

#### Implementation:
```typescript
// Lazy load route
import { lazy, Suspense } from 'react'

const Products = lazy(() => import('./pages/Products'))

// In routes
<Suspense fallback={<div>Loading...</div>}>
  <Products />
</Suspense>
```

#### Testing:
- [ ] App loads quickly
- [ ] Page transitions fast
- [ ] Bundle size reasonable
- [ ] No memory leaks
- [ ] Lighthouse score 90+

---

### **STEP 10.5: Browser Compatibility**

#### Tasks:
1. **Test on:**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)
   - Mobile Safari (iOS)
   - Chrome Android

2. **Check for:**
   - Responsive layout
   - CSS compatibility
   - JavaScript compatibility
   - Print functionality
   - Form inputs

#### Testing:
- [ ] Chrome Works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works
- [ ] Mobile browsers work
- [ ] Print works everywhere
- [ ] No JS errors

---

### **STEP 10.6: Accessibility**

#### Tasks:
1. **Keyboard Navigation**
   - [ ] Tab through all elements
   - [ ] Forms fillable with keyboard
   - [ ] Buttons clickable with Enter
   - [ ] Dropdowns work with arrow keys

2. **Screen Reader**
   - [ ] Use semantic HTML
   - [ ] Add ARIA labels where needed
   - [ ] Links have descriptive text
   - [ ] Form labels associated

3. **Color Contrast**
   - [ ] Text is readable
   - [ ] Use contrast checker tool
   - [ ] WCAG AA standard (4.5:1 for text)

4. **Focus Indicators**
   - [ ] Visible focus outline
   - [ ] Focus order logical

#### Testing with:
- NVDA (Windows)
- JAWS
- VoiceOver (Mac)
- WebAIM contrast checker

#### Testing:
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible

---

### **STEP 10.7: Final Bug Hunt**

#### Tasks:
1. **Manual testing scenarios**
   - Create full invoices from start to print
   - Extract invoices from PDF
   - Test all edge cases:
     - Large numbers (prices)
     - Long text (product names)
     - Unicode characters
     - Special characters in text

2. **Data validation**
   - Empty fields handled
   - Invalid formats rejected
   - Required fields enforced
   - Message clear

3. **Error scenarios**
   - Network fails during save
   - File too large to upload
   - Invalid file format
   - Concurrent edits
   - Session timeout

#### Testing:
- [ ] No critical bugs
- [ ] All edge cases handled
- [ ] Error messages helpful
- [ ] Recovery options clear

---

### **STEP 10.8: Deploy to Vercel**

#### Tasks:
1. **Create Vercel account** (free tier)

2. **Connect GitHub repo** (if using)
   - Push code to GitHub
   - Connect to Vercel

3. **Configure environment variables**
   - Add in Vercel dashboard:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

4. **Deploy**
   - Push to main branch triggers auto-deploy
   - Or manually deploy via Vercel CLI

5. **Configure custom domain** (optional)
   - Add DNS records
   - Enable SSL

#### Deployment Commands:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (first time)
vercel

# Deploy (subsequent times)
vercel --prod
```

#### Testing:
- [ ] App loads on Vercel URL
- [ ] No console errors
- [ ] All features work
- [ ] Database connection works
- [ ] File uploads work
- [ ] Print works
- [ ] Performance acceptable

---

### **STEP 10.9: Post-Deployment**

#### Tasks:
1. **Verify everything**
   - [ ] Sign up as new user
   - [ ] Create full invoice
   - [ ] Print invoice
   - [ ] Download PDF
   - [ ] All features work

2. **Set up monitoring** (optional)
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

3. **Document**
   - Create user guide (French/English)
   - Document features
   - Troubleshooting guide

4. **Backup & Recovery**
   - Enable Firebase automated backups
   - Test restore process
   - Document procedures

5. **Post-Launch Support**
   - Monitor for errors
   - Gather user feedback
   - Plan Phase 2 improvements

#### Checklist:
- [ ] Production app works
- [ ] Database accessible
- [ ] File uploads work
- [ ] Email works (if used)
- [ ] Users can sign up
- [ ] Users can create invoices
- [ ] Performance acceptable
- [ ] No errors logged

---

### **STEP 10.10: Final Testing Checklist**

#### Complete Testing Checklist:
- [ ] All 10 phases implemented
- [ ] All features tested
- [ ] All CRUD operations work
- [ ] Calculations 100% accurate
- [ ] Currency format consistent
- [ ] Language switching complete
- [ ] Responsive on all devices
- [ ] Accessible via keyboard
- [ ] Screen reader compatible
- [ ] Prints correctly
- [ ] PDF downloads correctly
- [ ] Performance good
- [ ] No console errors
- [ ] No Firebase errors
- [ ] Security validated
- [ ] Deployed to Vercel
- [ ] Custom domain (optional)
- [ ] Backups configured
- [ ] Monitoring configured
- [ ] User documentation complete

#### Deliverable:
✅ **Production-ready application deployed to Vercel with comprehensive testing**

---

---

## **✅ COMPLETION SUMMARY**

| Phase | Deliverable | Status |
|-------|------------|--------|
| 0 | Project foundation | ✅ |
| 1 | Auth + Layout | ✅ |
| 2 | Dashboard with stats | ✅ |
| 3 | Product management | ✅ |
| 4 | Client management | ✅ |
| 5 | Invoice creator | ✅ |
| 6 | PDF/Image extraction | ✅ |
| 7 | Settings + i18n | ✅ |
| 8 | Invoice list + Reports | ✅ |
| 9 | Print features | ✅ |
| 10 | Testing + Deployment | ✅ |

---

## **🎉 LAUNCH READY**

**Total Time: 12 weeks**
**Total Features: 50+**
**Users Supported: Unlimited (free tier)**
**Cost: 0 FCFA (completely free)**

---

## **📞 SUPPORT & NEXT STEPS**

After launch, consider:
1. Gather user feedback
2. Monitor performance
3. Plan Phase 2 improvements:
   - Mobile app (React Native)
   - Advanced reporting
   - Multi-language support (Hausa, Yoruba)
   - Integration with payment gateways
   - Inventory alerts
   - SMS notifications

---

**Document Last Updated**: March 2026
**Status**: Ready for Development
**Difficulty**: Beginner-Intermediate
**Estimated Total Effort**: 500+ hours

