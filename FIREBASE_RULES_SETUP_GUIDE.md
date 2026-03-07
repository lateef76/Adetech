# 🔐 Firebase Security Rules - Setup Guide

## 📋 Table of Contents
1. Firestore Rules
2. Storage Rules
3. Testing
4. Environment Variables

---

## 🔒 Step 1: Apply Firestore Security Rules

### Instructions:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **Adetech** project
3. Navigate to **Firestore Database** > **Rules** tab
4. Click **Edit Rules**
5. **Clear all existing rules** (Select All > Delete)
6. Copy the **FIRESTORE SECURITY RULES** from `FIREBASE_RULES.txt`
7. Paste into the editor
8. Click **Publish**
9. Wait for deployment (usually 1-2 minutes)

### Firestore Rules Cover:
- ✅ **Users Collection** - Profile management
- ✅ **Clients Collection** - Phase 4 complete
- ✅ **Products Collection** - Phase 3 ready
- ✅ **Receipts Collection** - Phase 5 ready
- ✅ **Invoices Collection** - Legacy support
- ✅ **Categories Collection** - Admin only
- ✅ **Suppliers Collection** - For future phases

---

## 📦 Step 2: Apply Firebase Storage Rules

### Instructions:
1. Stay in **Firebase Console** > Select your project
2. Navigate to **Storage** (not Firestore)
3. Click **Rules** tab
4. **Clear all existing rules**
5. Copy the **FIREBASE STORAGE SECURITY RULES** from `FIREBASE_RULES.txt`
6. Paste into the editor
7. Click **Publish**
8. Wait for deployment

### Storage Rules Cover:
- ✅ **Product Images** - 5MB max, public read
- ✅ **Receipt PDFs** - 10MB max, private
- ✅ **Profile Pictures** - 2MB max, public read

---

## 🧪 Step 3: Test Rules (Optional but Recommended)

### Test in Firebase Console:

#### 1. **Firestore Rules Simulator**
- Go to **Firestore** > **Rules** tab
- Click **Test my rules**
- Create test scenarios:

```
Scenario 1: User reads own data
- Collection: users
- Operation: read
- UID: your-test-uid
- Expected: ✅ ALLOW

Scenario 2: User writes to another user's data
- Collection: users
- Operation: write
- UID: different-uid
- Expected: ❌ DENY

Scenario 3: Create a client
- Collection: clients
- Operation: create
- Expected: ✅ ALLOW (if authenticated)

Scenario 4: Delete a finalized receipt
- Collection: receipts
- Operation: delete
- Status: "paid"
- Expected: ❌ DENY (only drafts can be deleted)
```

#### 2. **Storage Rules Simulator**
- Similar testing available in Storage > Rules

---

## 🔑 Step 4: Environment Variables

Make sure `.env.local` contains:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## ✅ Verification Checklist

After deploying rules:

- [ ] Firestore rules published successfully
- [ ] Storage rules published successfully
- [ ] Rules simulator shows expected results
- [ ] Login page works
- [ ] Can create a client (Clients page)
- [ ] Can upload product images
- [ ] Can create receipts (Phase 5)

---

## 🚨 Important Security Notes

### What's Protected:
✅ Users can only read their own profile
✅ Users can only modify their own data
✅ Admins can override restrictions
✅ File uploads limited by size and type
✅ Receipts can only be deleted if in "draft" status
✅ Categories managed by admins only

### What's Public:
🔓 Product images (via Storage)
🔓 Profile pictures (via Storage)
🔓 Category names (for display)

### Data Validation:
✅ Client type must be "professional" or "individual"
✅ Receipt status must be "draft", "sent", or "paid"
✅ Prices must be >= 0
✅ Images limited to 2-5MB
✅ PDFs limited to 10MB

---

## 🔧 Troubleshooting

### Issue: "Permission denied" when creating client
**Solution:** 
- Verify user is authenticated ✓
- Check `userId` matches `request.auth.uid` ✓
- Confirm `client_type` is valid ✓

### Issue: "Cannot upload image"
**Solution:**
- Check file size (max 5MB for products)
- Verify file type (images only)
- Ensure path format: `products/{userId}/{filename}`

### Issue: Rules showing as unpublished
**Solution:**
- Wait 1-2 minutes for deployment
- Refresh browser
- Check console for errors

---

## 📚 Collections Reference

### Users
```json
{
  "userId": "auth_uid",
  "email": "user@example.com",
  "displayName": "User Name",
  "role": "user|admin",
  "created_at": "timestamp"
}
```

### Clients (Phase 4) ✅
```json
{
  "clientId": "auto",
  "userId": "owner_id",
  "name": "Client Name",
  "client_type": "professional|individual",
  "email": "optional",
  "phone": "optional",
  "tax_id": "optional",
  "total_purchases": 0,
  "created_at": "timestamp"
}
```

### Receipts (Phase 5)
```json
{
  "receiptId": "auto",
  "userId": "owner_id",
  "clientId": "client_id",
  "receiptNumber": "RCP-2026-001",
  "status": "draft|sent|paid",
  "items": [...],
  "total": 0,
  "created_at": "timestamp"
}
```

### Products (Phase 3)
```json
{
  "productId": "auto",
  "userId": "owner_id",
  "name": "Product Name",
  "price": 0,
  "stock_quantity": 0,
  "image_url": "optional",
  "created_at": "timestamp"
}
```

---

## 📞 Support

- Firebase Docs: https://firebase.google.com/docs/rules
- Firestore Security: https://firebase.google.com/docs/firestore/security/start
- Storage Security: https://firebase.google.com/docs/storage/security

---

## 🎯 Status

| Collection | Rules | Status |
|-----------|-------|--------|
| users | ✅ | Ready |
| clients | ✅ | Phase 4 Done |
| products | ✅ | Phase 3 Ready |
| receipts | ✅ | Phase 5 Ready |
| invoices | ✅ | Legacy |
| categories | ✅ | Ready |
| suppliers | ✅ | Future |

**Last Updated:** 3/7/2026  
**Version:** 2.0
