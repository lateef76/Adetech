# 🔥 Firebase Complete Configuration Guide

**Last Updated:** March 7, 2026  
**Project:** Adetech Quincaillerie  
**Status:** Ready to Deploy

---

## 📋 Table of Contents

1. [Firebase Security Rules](#firebase-security-rules---complete-code)
2. [Collections Reference](#collections-reference)
3. [Composite Indexes](#composite-indexes)
4. [Step-by-Step Firebase Setup](#step-by-step-firebase-setup)
5. [Troubleshooting](#troubleshooting)

---

## 🔐 Firebase Security Rules - Complete Code

**Copy-paste this ENTIRE code into Firebase Console > Firestore > Rules tab**


```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    // Check if user is authenticated
    function isAuthed() {
      return request.auth != null;
    }
    
    // Check if user owns the resource (for create/update)
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Check if user owns the document (for read/update/delete)
    function isDocOwner() {
      return request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // ============================================
    // USERS COLLECTION
    // ============================================
    
    match /users/{userId} {
      // Users can read their own profile
      allow read: if isOwner(userId);
      
      // Users create their own profile on signup
      allow create: if isOwner(userId);
      
      // Users update their own profile only
      allow update: if isOwner(userId);
      
      // No deletes allowed by default
      allow delete: if false;
    }
    
    // ============================================
    // CLIENTS COLLECTION - Phase 4
    // ============================================
    
    match /clients/{clientId} {
      // Users can read their own clients
      allow read: if isDocOwner();
      
      // Users can create clients
      allow create: if isAuthed() && isOwner(request.resource.data.userId);
      
      // Users can update their own clients
      allow update: if isDocOwner();
      
      // Users can delete their own clients
      allow delete: if isDocOwner();
    }
    
    // ============================================
    // PRODUCTS COLLECTION - Phase 3
    // ============================================
    
    match /products/{productId} {
      // Users can read their own products
      allow read: if isDocOwner();
      
      // Users can create products
      allow create: if isAuthed() && isOwner(request.resource.data.userId);
      
      // Users can update their own products
      allow update: if isDocOwner();
      
      // Users can delete their own products
      allow delete: if isDocOwner();
    }
    
    // ============================================
    // RECEIPTS/INVOICES COLLECTION - Phase 5
    // ============================================
    
    match /receipts/{receiptId} {
      // Users can read their own receipts
      allow read: if isDocOwner();
      
      // Users can create receipts
      allow create: if isAuthed() && isOwner(request.resource.data.userId);
      
      // Users can update their own receipts
      allow update: if isDocOwner();
      
      // Users can delete their own receipts
      allow delete: if isDocOwner();
    }
    
    // Legacy invoices support (mapped to receipts)
    match /invoices/{invoiceId} {
      allow read: if isDocOwner();
      allow create: if isAuthed() && isOwner(request.resource.data.userId);
      allow update: if isDocOwner();
      allow delete: if isDocOwner();
    }
    
    // ============================================
    // COMPANY SETTINGS COLLECTION
    // ============================================
    
    match /company_settings/{settingsId} {
      // Users can read their own settings
      allow read: if isDocOwner();
      
      // Users can create their own settings
      allow create: if isAuthed() && isOwner(request.resource.data.userId);
      
      // Users can update their own settings
      allow update: if isDocOwner();
      
      // Users can delete their own settings
      allow delete: if isDocOwner();
    }
    
    // ============================================
    // CATEGORIES COLLECTION
    // ============================================
    
    match /categories/{categoryId} {
      // Everyone can read categories
      allow read: if isAuthed();
      
      // Only deny writes for now (add admin role later if needed)
      allow write: if false;
    }
    
    // ============================================
    // SUPPLIERS COLLECTION (Future Phase)
    // ============================================
    
    match /suppliers/{supplierId} {
      // Users can read their own suppliers
      allow read: if isDocOwner();
      
      // Users can create suppliers
      allow create: if isAuthed() && isOwner(request.resource.data.userId);
      
      // Users can update their own suppliers
      allow update: if isDocOwner();
      
      // Users can delete their own suppliers
      allow delete: if isDocOwner();
    }
    
    // ============================================
    // CATCH-ALL DENY (EVERYTHING ELSE BLOCKED)
    // ============================================
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 📦 Collections Reference

### **1. RECEIPTS Collection** 🧾

| Field | Type | Required | Indexed | Description |
|-------|------|----------|---------|-------------|
| `id` | string | ✅ | N/A | Document ID (auto-generated by Firebase) |
| `userId` | string | ✅ | ✅ | Owner/Creator UID (for security) |
| `receiptNumber` | string | ✅ | ❌ | Invoice/Receipt number |
| `clientId` | string | ✅ | ✅ | Reference to client document |
| `clientName` | string | ✅ | ❌ | Client name (snapshot) |
| `clientEmail` | string | ❌ | ❌ | Client email (snapshot) |
| `items` | array | ✅ | ❌ | Array of line items with qty, price, total |
| `subtotal` | number | ✅ | ❌ | Sum of all items |
| `tax` | number | ✅ | ❌ | Calculated tax amount |
| `taxRate` | number | ❌ | ❌ | Tax rate percentage (0-100) |
| `total` | number | ✅ | ❌ | subtotal + tax |
| `status` | string | ✅ | ✅ | draft, issued, paid, cancelled, pending |
| `paymentMethod` | string | ❌ | ✅ | cash, card, bank_transfer, check, other |
| `issueDate` | timestamp | ✅ | ✅ | Date receipt issued |
| `dueDate` | timestamp | ❌ | ❌ | Due date for payment |
| `paymentDate` | timestamp | ❌ | ❌ | Date payment received |
| `notes` | string | ❌ | ❌ | Additional notes/terms |
| `createdAt` | timestamp | ✅ | ❌ | Document creation time |
| `updatedAt` | timestamp | ✅ | ❌ | Last update time |

**Security:** Users can only access their own receipts (`userId == auth.uid`)

---

### **2. CLIENTS Collection** 👥

| Field | Type | Required | Indexed | Description |
|-------|------|----------|---------|-------------|
| `id` | string | ✅ | N/A | Document ID (auto-generated) |
| `userId` | string | ✅ | ✅ | Owner/Creator UID (for security) |
| `name` | string | ✅ | ❌ | Client full name |
| `email` | string | ❌ | ❌ | Client email address |
| `phone` | string | ❌ | ❌ | Client phone number |
| `address` | string | ❌ | ❌ | Street address |
| `city` | string | ❌ | ❌ | City |
| `client_type` | string | ❌ | ✅ | professional, individual |
| `tax_id` | string | ❌ | ❌ | Tax ID (for professionals) |
| `total_purchases` | number | ❌ | ❌ | Total amount spent |
| `last_purchase_date` | timestamp | ❌ | ❌ | Date of last purchase |
| `created_at` | timestamp | ✅ | ✅ | Document creation time |
| `updated_at` | timestamp | ❌ | ✅ | Last update time |

**Security:** Users can only access their own clients (`userId == auth.uid`)

---

### **3. COMPANY_SETTINGS Collection** 🏢

| Field | Type | Required | Indexed | Description |
|-------|------|----------|---------|-------------|
| `id` | string | ✅ | N/A | Document ID (auto-generated) |
| `userId` | string | ✅ | ✅ | Owner/Creator UID (for security) |
| `companyName` | string | ✅ | ❌ | Official business name |
| `companyAddress` | string | ❌ | ❌ | Business address |
| `companyPhone` | string | ❌ | ❌ | Business phone |
| `companyEmail` | string | ❌ | ❌ | Business email |
| `companyWebsite` | string | ❌ | ❌ | Business website |
| `companyLogo` | string | ❌ | ❌ | Logo URL (stored in Cloud Storage) |
| `taxId` | string | ❌ | ❌ | Business tax ID |
| `registrationNumber` | string | ❌ | ❌ | Business registration number |
| `currency` | string | ❌ | ❌ | Default currency (CFA, USD, EUR, etc.) |
| `createdAt` | timestamp | ✅ | ❌ | Document creation time |
| `updatedAt` | timestamp | ✅ | ❌ | Last update time |

**Default Currency:** CFA  
**Security:** Users can only access their own settings (`userId == auth.uid`)

---

### **4. PRODUCTS Collection** 📦

| Field | Type | Required | Indexed | Description |
|-------|------|----------|---------|-------------|
| `id` | string | ✅ | N/A | Document ID (auto-generated) |
| `userId` | string | ✅ | ✅ | Owner/Creator UID (for security) |
| `name` | string | ✅ | ❌ | Product name |
| `sku` | string | ❌ | ❌ | Stock keeping unit |
| `description` | string | ❌ | ❌ | Product description |
| `price` | number | ✅ | ❌ | Unit price |
| `stock` | number | ✅ | ❌ | Current stock quantity |
| `minStock` | number | ❌ | ❌ | Minimum stock level for alert |
| `category` | string | ❌ | ❌ | Product category |
| `createdAt` | timestamp | ✅ | ❌ | Document creation time |
| `updatedAt` | timestamp | ✅ | ❌ | Last update time |

**Security:** Users can only access their own products (`userId == auth.uid`)

---

### **5. USERS Collection** 👤

| Field | Type | Required | Indexed | Description |
|-------|------|----------|---------|-------------|
| `uid` | string | ✅ | N/A | Firebase Authentication UID |
| `email` | string | ✅ | ❌ | Email address |
| `displayName` | string | ❌ | ❌ | User's display name |
| `photoURL` | string | ❌ | ❌ | Profile photo URL |
| `createdAt` | timestamp | ✅ | ❌ | Account creation time |
| `updatedAt` | timestamp | ✅ | ❌ | Last update time |

**Security:** Users can only read/write their own profile

---

## 🔑 Composite Indexes

### **Required Indexes** (Must Create)

#### **Index 1: Receipts by User + Issue Date** ⭐ CRITICAL
```
Collection: receipts
Fields:
  - userId (Ascending)
  - issueDate (Descending)
```
**Used by:** Get all receipts for logged-in user  
**Query:** `where("userId", "==", userId).orderBy("issueDate", "desc")`

---

#### **Index 2: Clients by User + Created Date** ⭐ CRITICAL
```
Collection: clients
Fields:
  - userId (Ascending)
  - created_at (Descending)
```
**Used by:** Get all clients for logged-in user  
**Query:** `where("userId", "==", userId).orderBy("created_at", "desc")`

---

### **Recommended Indexes** (Should Create)

#### **Index 3: Receipts by User + Client + Date**
```
Collection: receipts
Fields:
  - userId (Ascending)
  - clientId (Ascending)
  - issueDate (Descending)
```
**Used by:** Get all receipts for a specific client  
**Query:** `where("userId", "==", userId).where("clientId", "==", clientId).orderBy("issueDate", "desc")`

---

#### **Index 4: Clients by User + Type + Date**
```
Collection: clients
Fields:
  - userId (Ascending)
  - client_type (Ascending)
  - created_at (Descending)
```
**Used by:** Filter clients by type (professional/individual)  
**Query:** `where("userId", "==", userId).where("client_type", "==", type).orderBy("created_at", "desc")`

---

#### **Index 5: Receipts by User + Status + Date** (Optional)
```
Collection: receipts
Fields:
  - userId (Ascending)
  - status (Ascending)
  - issueDate (Descending)
```
**Used by:** Filter receipts by payment status  
**Query:** `where("userId", "==", userId).where("status", "==", status).orderBy("issueDate", "desc")`

---

## 📝 Step-by-Step Firebase Setup

### **Step 1: Copy and Publish Security Rules**

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your **Adetech** project
3. Go to **Firestore Database** → **Rules** tab
4. **Delete** the default rules
5. **Copy the entire code** from [Firebase Security Rules](#firebase-security-rules---complete-code) section above
6. **Paste** into the Rules editor
7. Click **Publish**
8. Wait for confirmation message ✅

---

### **Step 2: Create Required Composite Indexes**

**Two ways to create indexes:**

#### **Option A: Automatic (Recommended)**

1. Run your app: `npm run dev`
2. Try to load the Receipts page or Clients page
3. You'll see an error: `The query requires an index`
4. **Click the link** in the error message
5. Firebase Console opens automatically
6. Click **Create Index**
7. Wait 2-5 minutes (page refreshes automatically)
8. Repeat for each index needed

#### **Option B: Manual**

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your **Adetech** project
3. Go to **Firestore Database** → **Indexes** tab
4. Click **Create Index**
5. Fill in the details from the index above:
   - **Collection ID:** (e.g., `receipts`)
   - **Field:** Add fields one by one
   - **Order:** Ascending/Descending toggle
6. Click **Create**
7. Wait for status to show **"Enabled"** (takes 2-5 minutes)
8. Repeat for each required index

**Status Check:**
- 🔴 Red/Processing = Creating (wait)
- 🟢 Green/Enabled = Ready to use

---

### **Step 3: Verify Environment Variables**

Ensure your `.env.local` file contains:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Get these from: **Firebase Console** → **Project Settings** → **General** tab

---

### **Step 4: Test Configuration**

1. Start dev server: `npm run dev`
2. Create a test user account (sign up)
3. Navigate to **Settings** → add company details → save
4. Create a test client in **Clients** page
5. Create a test receipt in **Receipts** page
6. Refresh the page - data should persist ✅
7. Check **Firestore Console** - documents should appear

---

## 🆘 Troubleshooting

### Error: "Missing or insufficient permissions"

**Cause:** Security rules are not allowing the operation

**Solutions:**
1. Verify rules are published (Firebase Console → Rules → status shows green)
2. Ensure you're signed in with a Firebase user
3. Check that `userId` field matches `auth.uid`
4. Verify `userId` is set on all documents

**Debug:**
- Open browser DevTools Console
- Look for Firebase error messages
- Copy error message and paste in Firebase Console search bar

---

### Error: "The query requires an index"

**Cause:** Firestore needs a composite index for your query

**Solution:**
1. Click the link in the error message (opens Firebase Console)
2. Click **Create Index**
3. Wait 2-5 minutes
4. Refresh your app

**If link doesn't appear:**
- Create the index manually (see Step 2: Option B)
- Make sure the Collection ID and Fields match exactly

---

### Error: "Collection not found"

**Cause:** You're querying a collection that doesn't exist

**Solution:**
1. Verify collection name spelling (case-sensitive)
2. Check Firestore Console to see actual collection names
3. Create at least one document in the collection to initialize it

---

### Error: "Invalid API key"

**Cause:** Firebase credentials in `.env.local` are incorrect

**Solution:**
1. Go to **Firebase Console** → **Project Settings**
2. Copy all config values correctly
3. Ensure no extra spaces or quotes
4. Save `.env.local` and restart dev server: `npm run dev`

---

### Receipts/Clients page shows "No data"

**Cause #1:** Index is still being created
- Solution: Wait 2-5 minutes and refresh

**Cause #2:** You haven't created any documents yet
- Solution: Create a test receipt/client first

**Cause #3:** Query is being blocked by security rules
- Solution: Check Firebase Console Logs tab for errors

---

### Firebase Console shows empty collections

**Cause:** Data hasn't been synced yet

**Solution:**
1. Verify you're looking at the right project
2. Create a test document from the app
3. Go back to Firebase Console and refresh
4. Document should appear in collection

---

## ✅ Firebase Setup Checklist

- [ ] **Step 1:** Copy and publish security rules
  - [ ] Logged into Firebase Console
  - [ ] Rules copied from this guide
  - [ ] Rules pasted and published ✅

- [ ] **Step 2:** Create required indexes
  - [ ] Index 1 created: receipts (userId, issueDate)
  - [ ] Index 2 created: clients (userId, created_at)
  - [ ] Index 3 created: receipts (userId, clientId, issueDate) - Recommended
  - [ ] Index 4 created: clients (userId, client_type, created_at) - Recommended

- [ ] **Step 3:** Verify environment variables
  - [ ] `.env.local` has all Firebase config
  - [ ] No typos or missing values
  - [ ] Dev server restarted

- [ ] **Step 4:** Test configuration
  - [ ] Can sign up with email/password
  - [ ] Can create company settings
  - [ ] Can create clients
  - [ ] Can create receipts
  - [ ] Data persists after page refresh
  - [ ] Can see data in Firebase Console

---

## 📊 Quick Reference: Collection Relationships

```
USER (Firebase Auth)
  ├── users/{uid}
  ├── clients/{clientId} → userId = uid
  ├── receipts/{receiptId} → userId = uid
  │   └── items[] → clientId → clients/{clientId}
  ├── products/{productId} → userId = uid
  └── company_settings/{settingId} → userId = uid
```

**Key Rule:** All documents have `userId` field that matches logged-in user's `auth.uid`

---

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/overview)
- [Composite Indexes](https://firebase.google.com/docs/firestore/index-overview)
- [Query Limitations](https://firebase.google.com/docs/firestore/queries)

---

## 📞 Need Help?

If you encounter issues:

1. **Check this guide** for troubleshooting
2. **Check console logs** (F12 → Console tab)
3. **Check Firebase Logs** (Firebase Console → Firestore → Logs tab)
4. **Verify security rules** are published
5. **Verify indexes** are all enabled (not processing)

---

**Last Updated:** March 7, 2026  
**Status:** ✅ Complete and Ready for Production
