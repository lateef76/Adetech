# 📋 **Adetech Quincaillerie - Invoice System Planning**

## **Complete Development Phases (Free Tier)**

---

## **🏪 BUSINESS INFORMATION**

| Item | Value |
|------|-------|
| **Shop Name** | Adetech Quincaillerie |
| **Default Currency** | West African CFA (FCFA/XOF) |
| **Primary Language** | French |
| **Secondary Language** | English |
| **Industry** | Hardware/Building Materials |

---

## **📦 FREE TIER SERVICES (Summary)**

| Service | Tool | Free Tier Limits |
|---------|------|------------------|
| Hosting | Vercel/Netlify | 100GB bandwidth, SSL, CDN |
| Database | Supabase | 500MB PostgreSQL |
| Storage | Supabase | 1GB file storage |
| Auth | Supabase | Unlimited users |
| Icons | Lucide React | 1000+ free icons |
| Charts | Recharts | MIT license |
| PDF | PDF.js | 100% free |
| OCR | Tesseract.js | 100% free |
| UI | shadcn/ui | 100% free |
| Search | Fuse.js | 100% free |

---

## **📋 COMPLETE PHASES OVERVIEW**

| Phase | Focus | Duration |
|-------|-------|----------|
| 0 | Project Setup & Supabase Configuration | Week 1 |
| 1 | Authentication & Layout | Week 2 |
| 2 | Dashboard Home | Week 3 |
| 3 | Product Management (Stock) | Week 4 |
| 4 | Client Management | Week 5 |
| 5 | Invoice Creator - Core | Week 6-7 |
| 6 | PDF & Image Extraction | Week 8 |
| 7 | Settings & Internationalization | Week 9 |
| 8 | Invoice List & Reports | Week 10 |
| 9 | Print Features (Stamp/Signature/Watermark) | Week 11 |
| 10 | Polish, Testing & Deployment | Week 12 |

---

## **PHASE 0: Project Setup & Supabase Configuration**
### Duration: Week 1

### Tasks:
- [ ] Create Supabase project (free tier)
- [ ] Set up database tables structure
- [ ] Configure authentication (email/password)
- [ ] Set up storage buckets for images
- [ ] Initialize React + TypeScript + Vite project
- [ ] Install TailwindCSS + shadcn/ui
- [ ] Set up project folder structure
- [ ] Configure environment variables
- [ ] Set up routing structure

### Deliverable:
✅ Project foundation with Supabase connected and ready for development

---

## **PHASE 1: Authentication & Layout**
### Duration: Week 2

### Authentication:
- [ ] Login page with email/password
- [ ] Registration page (admin only)
- [ ] Password reset functionality
- [ ] Protected routes
- [ ] Session management
- [ ] Auto-logout on inactivity

### Layout:
- [ ] Sidebar navigation (collapsible)
- [ ] Header with shop name "Adetech Quincaillerie"
- [ ] Mobile responsive drawer
- [ ] Dark/light mode toggle
- [ ] User menu (profile, logout)

### Deliverable:
✅ Login system + Main app layout with navigation

---

## **PHASE 2: Dashboard Home**
### Duration: Week 3

### Dashboard Components:
- [ ] Welcome card with shop name
- [ ] Stats cards (today's sales, total invoices, low stock count)
- [ ] Quick actions bar (new invoice, add product)
- [ ] Recent invoices list (last 5)
- [ ] Low stock alerts section
- [ ] Top selling products chart
- [ ] Monthly revenue chart (in FCFA)
- [ ] Today's summary card

### Deliverable:
✅ Functional dashboard with real-time statistics and alerts

---

## **PHASE 3: Product Management (Stock)**
### Duration: Week 4

### Products Page:
- [ ] Product list table
- [ ] Add product form (name, category, wholesale/retail in FCFA)
- [ ] Edit product functionality
- [ ] Delete with confirmation
- [ ] Search products (fuse.js)
- [ ] Filter by category
- [ ] Stock quantity display
- [ ] Low stock highlighting
- [ ] Stock adjustment history

### Product Categories:
1. Plomberie (Plumbing)
2. Électricité (Electrical)
3. Outillage (Tools)
4. Quincaillerie (Hardware)
5. Peinture (Paint)
6. Matériaux (Materials)

### Deliverable:
✅ Complete product management system with stock tracking

---

## **PHASE 4: Client Management**
### Duration: Week 5

### Clients Page:
- [ ] Client list table
- [ ] Add client form (name, phone, email, address, city)
- [ ] Tax ID field (Numéro IFU/Contribuable)
- [ ] Edit/delete clients
- [ ] Search clients
- [ ] Client purchase history
- [ ] Quick client selection for invoices
- [ ] Client grouping (professionals/individuals)

### Deliverable:
✅ Full client database with history tracking

---

## **PHASE 5: Invoice Creator - Core**
### Duration: Week 6-7

### Invoice Header:
- [ ] Invoice number generator (FACT-2024-001 format)
- [ ] Date picker (default today)
- [ ] Client selector with search
- [ ] Company info display (Adetech Quincaillerie)
- [ ] Customer info section

### Items Section:
- [ ] Add item row
- [ ] Product autocomplete while typing
- [ ] Display both prices (wholesale/retail in FCFA)
- [ ] Choose price type toggle
- [ ] Quantity input
- [ ] Unit display (pièce, mètre, kg, litre)
- [ ] Line total calculation
- [ ] Delete item row
- [ ] Inline editing capability

### Calculations:
- [ ] Subtotal (Sous-total)
- [ ] Discount input (Remise % or fixed FCFA)
- [ ] Tax calculation (TVA if applicable)
- [ ] Grand total (Total TTC)
- [ ] Amount in words (optional)
- [ ] Real-time updates

### Save & Actions:
- [ ] Save as draft
- [ ] Mark as paid
- [ ] Preview invoice
- [ ] Print
- [ ] Download as PDF
- [ ] Email to client

### Deliverable:
✅ Fully functional invoice creation system with real-time calculations

---

## **PHASE 6: PDF & Image Extraction**
### Duration: Week 8

### Upload Section:
- [ ] Drag & drop zone
- [ ] File browser button
- [ ] Support PDF, JPG, PNG
- [ ] Preview uploaded file

### Extraction Features:
- [ ] PDF text extraction (pdf.js)
- [ ] Image OCR (Tesseract.js - French/English)
- [ ] Progress indicator
- [ ] Parse extracted text into items
- [ ] Extract prices in FCFA format

### Review & Transfer:
- [ ] Display extracted items in table
- [ ] Edit extracted data
- [ ] Select/deselect items
- [ ] "Add to Invoice" button
- [ ] "Add All" option
- [ ] Manual correction option

### Deliverable:
✅ Smart invoice import from PDF/images with intelligent data extraction

---

## **PHASE 7: Settings & Internationalization**
### Duration: Week 9

### Company Settings:
- [ ] Shop name (Adetech Quincaillerie)
- [ ] Address, phone, email
- [ ] Logo upload
- [ ] Tax ID (IFU/NINEA)
- [ ] Invoice footer text
- [ ] Default payment terms

### Currency Settings:
- [ ] Default: FCFA (XOF)
- [ ] Currency symbol: FCFA or CFA
- [ ] Format: 1.000 FCFA (thousands separator)
- [ ] Other currency options (USD, EUR) for reference

### Language Settings:
- [ ] French (primary)
- [ ] English (secondary)
- [ ] Language toggle in header
- [ ] All UI translations

### Invoice Defaults:
- [ ] Default discount
- [ ] Default tax rate
- [ ] Invoice numbering prefix
- [ ] Next invoice number
- [ ] Due date default (e.g., 30 days)

### Deliverable:
✅ Fully configured settings panel + multilingual interface

---

## **PHASE 8: Invoice List & Reports**
### Duration: Week 10

### Invoice List:
- [ ] Table with all invoices
- [ ] Search by number/client
- [ ] Filter by status (paid/unpaid/draft)
- [ ] Filter by date range
- [ ] Sort by date/amount
- [ ] Pagination
- [ ] Export to CSV

### Invoice Details:
- [ ] View full invoice
- [ ] Edit invoice
- [ ] Duplicate invoice
- [ ] Delete invoice
- [ ] Status update
- [ ] Payment tracking

### Reports:
- [ ] Daily sales report
- [ ] Monthly revenue (FCFA)
- [ ] Top products report
- [ ] Client sales report
- [ ] Stock movement report
- [ ] Export as PDF/Excel

### Deliverable:
✅ Complete invoice history + analytics dashboard

---

## **PHASE 9: Print Features**
### Duration: Week 11

### Invoice Print Layout:
- [ ] Clean printable design
- [ ] Company header with logo
- [ ] Client information
- [ ] Itemized table
- [ ] Totals section
- [ ] Terms and conditions

### Optional Print Elements:
- [ ] Watermark option (e.g., "PAID", "ACQUITTÉ")
- [ ] Watermark text customizable
- [ ] Signature block
- [ ] Stamp box (for physical stamp after printing)
- [ ] Toggle each option on/off

### Print Actions:
- [ ] Print preview
- [ ] Direct print
- [ ] Save as PDF
- [ ] Print multiple copies

### Deliverable:
✅ Professional print-ready invoices with custom watermarks

---

## **PHASE 10: Polish, Testing & Deployment**
### Duration: Week 12

### UI/UX Polish:
- [ ] Page transitions (framer-motion)
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Confirmation dialogs
- [ ] Empty states
- [ ] Error boundaries

### Responsive Testing:
- [ ] Mobile phones
- [ ] Tablets
- [ ] Desktop
- [ ] Print layout testing

### Feature Testing:
- [ ] Test all CRUD operations
- [ ] Test PDF extraction
- [ ] Test OCR with different images
- [ ] Test currency formatting
- [ ] Test language switching

### Deployment:
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Set up custom domain (optional)
- [ ] SSL certificate (auto)
- [ ] Final launch

### Deliverable:
✅ Production-ready, tested application deployed to Vercel

---

## **🎯 PHASE SUMMARY**

| Phase | Focus | Key Deliverable |
|-------|-------|-----------------|
| 0 | Setup | Project foundation |
| 1 | Auth & Layout | Login + Sidebar |
| 2 | Dashboard | Home screen with stats |
| 3 | Products | Stock management |
| 4 | Clients | Customer database |
| 5 | Invoice Creator | Core invoicing |
| 6 | Extraction | PDF/Image to invoice |
| 7 | Settings | Shop config + i18n |
| 8 | Lists & Reports | Invoice history |
| 9 | Print Features | Watermark/Signature/Stamp |
| 10 | Polish & Deploy | Launch ready |

**Total Timeline: 12 Weeks (3 Months)**

---

## **💰 FREE TIER CAPACITY FOR ADETECH QUINCAILLERIE**

| Resource | Limit | What It Means |
|---------|-------|---------------|
| Database | 500MB | ~15,000 invoices |
| Storage | 1GB | ~1,000 product photos |
| Bandwidth | 100GB/mo | ~10,000 visits/mo |
| Users | Unlimited | As many staff as needed |
| Cost | **0 FCFA** | 100% free forever |

---

## **🛠️ TECH STACK SUMMARY**

### Frontend:
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State**: Zustand + TanStack Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion

### Backend & Database:
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage

### Additional Libraries:
- **PDF Processing**: pdf.js, jsPDF, jsPDF-autotable
- **OCR**: Tesseract.js
- **Search**: Fuse.js
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns, react-day-picker
- **File Upload**: react-dropzone
- **Notifications**: Sonner
- **Internationalization**: i18next, react-i18next
- **QR Codes**: qrcode.react

---

## **📦 ALL PACKAGES - Adetech Quincaillerie Invoice System**

### Installation Command:
```bash
npm install react-router-dom @supabase/supabase-js react-hook-form zod @hookform/resolvers lucide-react class-variance-authority clsx tailwind-merge framer-motion @tanstack/react-table @tanstack/react-query date-fns react-day-picker zustand sonner recharts fuse.js pdfjs-dist tesseract.js jspdf jspdf-autotable react-dropzone papaparse uuid i18next react-i18next i18next-browser-languagedetector qrcode.react
```

### Dev Dependencies:
```bash
npm install -D tailwindcss postcss autoprefixer @types/node @types/react @types/react-dom @types/uuid eslint prettier eslint-config-prettier @vitejs/plugin-react
```

### Initialize Tailwind & shadcn/ui:
```bash
# Initialize Tailwind
npx tailwindcss init -p

# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add all shadcn/ui components
npx shadcn-ui@latest add button card dialog dropdown-menu form input label select sheet table tabs textarea alert avatar badge checkbox combobox command popover progress radio-group scroll-area switch tooltip
```

---

### **Production Dependencies (35 packages)**

#### **1. Routing & Navigation**
| Package | Version | Purpose |
|---------|---------|---------|
| `react-router-dom` | Latest | Page routing and navigation |

#### **2. State Management & Data Fetching**
| Package | Version | Purpose |
|---------|---------|---------|
| `zustand` | Latest | Lightweight state management |
| `@tanstack/react-query` | Latest | Data fetching and caching |
| `@tanstack/react-table` | Latest | Headless table component |

#### **3. Form Handling & Validation**
| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | Latest | Performant form handling |
| `zod` | Latest | TypeScript-first schema validation |
| `@hookform/resolvers` | Latest | Integration for zod validation |

#### **4. Database & Authentication**
| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | Latest | Supabase client library |

#### **5. UI Components & Styling**
| Package | Version | Purpose |
|---------|---------|---------|
| `class-variance-authority` | Latest | CSS class composition |
| `clsx` | Latest | Conditional CSS classes |
| `tailwind-merge` | Latest | Tailwind CSS merge utility |
| `lucide-react` | Latest | Icon library (1000+ icons) |

#### **6. Animations & Interactions**
| Package | Version | Purpose |
|---------|---------|---------|
| `framer-motion` | Latest | Smooth animations and transitions |

#### **7. Date & Time**
| Package | Version | Purpose |
|---------|---------|---------|
| `date-fns` | Latest | Modern date utility library |
| `react-day-picker` | Latest | Calendar date picker component |

#### **8. Notifications & Feedback**
| Package | Version | Purpose |
|---------|---------|---------|
| `sonner` | Latest | Toast notification library |

#### **9. Charts & Visualization**
| Package | Version | Purpose |
|---------|---------|---------|
| `recharts` | Latest | Composable charting library (MIT) |

#### **10. Search & Filtering**
| Package | Version | Purpose |
|---------|---------|---------|
| `fuse.js` | Latest | Lightweight fuzzy-search library |

#### **11. PDF & Document Processing**
| Package | Version | Purpose |
|---------|---------|---------|
| `pdfjs-dist` | Latest | PDF text extraction |
| `jspdf` | Latest | Generate PDF files |
| `jspdf-autotable` | Latest | Table plugin for jsPDF |
| `tesseract.js` | Latest | OCR for images (French/English) |

#### **12. File Handling**
| Package | Version | Purpose |
|---------|---------|---------|
| `react-dropzone` | Latest | Drag & drop file upload |
| `papaparse` | Latest | CSV parsing and generation |

#### **13. Internationalization (i18n)**
| Package | Version | Purpose |
|---------|---------|---------|
| `i18next` | Latest | i18n framework |
| `react-i18next` | Latest | React integration for i18next |
| `i18next-browser-languagedetector` | Latest | Auto-detect browser language |

#### **14. Utilities**
| Package | Version | Purpose |
|---------|---------|---------|
| `uuid` | Latest | Generate unique IDs |
| `qrcode.react` | Latest | QR code generation |

---

### **Dev Dependencies (8 packages)**

| Package | Purpose |
|---------|---------|
| `tailwindcss` | CSS framework |
| `postcss` | CSS post-processing |
| `autoprefixer` | Vendor prefixes for CSS |
| `@types/node` | TypeScript types for Node.js |
| `@types/react` | TypeScript types for React |
| `@types/react-dom` | TypeScript types for React DOM |
| `@types/uuid` | TypeScript types for uuid |
| `@vitejs/plugin-react` | Vite plugin for React |
| `eslint` | Code linting |
| `prettier` | Code formatting |
| `eslint-config-prettier` | Disable eslint rules that conflict with prettier |

---

### **shadcn/ui Components (22 components)**

```
button
card
dialog
dropdown-menu
form
input
label
select
sheet
table
tabs
textarea
alert
avatar
badge
checkbox
combobox
command
popover
progress
radio-group
scroll-area
switch
tooltip
```

**Total: ~35 npm packages + 22 shadcn/ui components = Complete feature-rich system**

---

### **Package Installation Summary**

| Category | Count | Details |
|----------|-------|---------|
| Production Dependencies | 35 | Core libraries for app functionality |
| Dev Dependencies | 11 | Build tools, linting, types |
| shadcn/ui Components | 22 | Pre-built, customizable UI components |
| **Total** | **~68** | **Complete tech foundation** |

---

### **Installation Command (One-Liner)**

```bash
npm create vite@latest adetech-invoice -- --template react-ts && cd adetech-invoice && npm install react-router-dom @supabase/supabase-js react-hook-form zod @hookform/resolvers lucide-react class-variance-authority clsx tailwind-merge framer-motion @tanstack/react-table @tanstack/react-query date-fns react-day-picker zustand sonner recharts fuse.js pdfjs-dist tesseract.js jspdf jspdf-autotable react-dropzone papaparse uuid i18next react-i18next i18next-browser-languagedetector qrcode.react && npm install -D tailwindcss postcss autoprefixer @types/node @types/react @types/react-dom @types/uuid eslint prettier eslint-config-prettier @vitejs/plugin-react && npx tailwindcss init -p && npx shadcn-ui@latest init && npx shadcn-ui@latest add button card dialog dropdown-menu form input label select sheet table tabs textarea alert avatar badge checkbox combobox command popover progress radio-group scroll-area switch tooltip
```

### Deployment:
- **Hosting**: Vercel
- **Domain**: Optional custom domain
- **SSL**: Automatic (Vercel)

---

## **📊 DATABASE SCHEMA OVERVIEW**

### Core Tables:
1. **users** - Shop staff
2. **products** - Inventory
3. **clients** - Customer database
4. **invoices** - Generated invoices
5. **invoice_items** - Line items per invoice
6. **categories** - Product categories
7. **settings** - Shop configuration

### Storage Buckets:
- `products/` - Product images
- `invoices/` - PDF files
- `logos/` - Shop logo

---

## **✅ BEST PRACTICES TO FOLLOW**

### Code Organization:
- ✅ Component-based structure
- ✅ Separate concerns (hooks, utilities, services)
- ✅ Environment variables for config
- ✅ TypeScript strict mode enabled

### Database:
- ✅ Primary keys on all tables
- ✅ Foreign key relationships
- ✅ Proper indexes on search fields
- ✅ Row-level security policies

### Performance:
- ✅ Lazy load components (React.lazy)
- ✅ Optimize images
- ✅ Cache API responses
- ✅ Debounce search inputs

### Accessibility:
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Color contrast compliance

### Error Handling:
- ✅ Try-catch blocks on async operations
- ✅ User-friendly error messages
- ✅ Error boundaries for React crashes
- ✅ Loading states for async operations

### Testing:
- ✅ Manual testing checklist for each feature
- ✅ Cross-browser testing
- ✅ Mobile responsiveness testing
- ✅ Print layout preview

### Security:
- ✅ Input validation on forms
- ✅ SQL injection prevention (via Supabase)
- ✅ XSS protection
- ✅ Environment variables for secrets
- ✅ HTTPS enforced on deployment

---

## **📌 GETTING STARTED**

1. **Week 1**: Complete Phase 0 to have the foundation ready
2. **Weeks 2-11**: Follow each phase sequentially
3. **Week 12**: Polish and deploy
4. **Post-Launch**: Monitor, gather feedback, plan improvements

---

## **🚀 SUCCESS METRICS**

- ✅ All features complete and tested
- ✅ Zero critical bugs at launch
- ✅ Mobile responsive on all devices
- ✅ Invoice generation < 2 seconds
- ✅ PDF extraction accuracy > 90%
- ✅ All language strings translated (FR/EN)
- ✅ Database optimized for free tier limits

---

**Last Updated**: March 2026 | **Status**: Ready for Development
