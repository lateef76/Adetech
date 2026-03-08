# Firebase Configuration Guide

## Overview
This document walks you through setting up Firebase for the Adetech application.

## Step 1: Copy Security Rules

1. Open [Firebase Console](https://console.firebase.google.com)
2. Go to your project
3. Navigate to **Firestore Database** > **Rules** tab
4. Copy all content from `FIREBASE_RULES.txt` in this project
5. Paste into the Firebase Console Rules editor
6. Click **Publish**

## Step 2: Create Composite Indexes

When you first run the application, you may see errors like:
```
The query requires an index
```

This is **EXPECTED and NORMAL**. Firestore requires composite indexes for queries with multiple WHERE clauses or a WHERE + ORDER BY on different fields.

### Your Application Requires These Indexes:

#### Index 1: **Receipts by User + Issue Date** (REQUIRED)
- **Collection:** `receipts`
- **Fields:**
  - `userId` - Ascending
  - `issueDate` - Descending
- **Used by:** Get all receipts for logged-in user

#### Index 2: **Receipts by User + Client + Date** (RECOMMENDED)
- **Collection:** `receipts`
- **Fields:**
  - `userId` - Ascending
  - `clientId` - Ascending
  - `issueDate` - Descending
- **Used by:** Get receipts for specific client

#### Index 3: **Receipts by User + Status + Date** (OPTIONAL)
- **Collection:** `receipts`
- **Fields:**
  - `userId` - Ascending
  - `status` - Ascending
  - `issueDate` - Descending
- **Used by:** Filter receipts by status

#### Index 4: **Clients by User + Created Date** (REQUIRED)
- **Collection:** `clients`
- **Fields:**
  - `userId` - Ascending
  - `created_at` - Descending
- **Used by:** Get all clients for logged-in user

#### Index 5: **Clients by User + Type + Date** (RECOMMENDED)
- **Collection:** `clients`
- **Fields:**
  - `userId` - Ascending
  - `client_type` - Ascending
  - `created_at` - Descending
- **Used by:** Filter clients by type (professional/individual)

### How to Create Indexes Automatically

The easiest way is to let Firebase create them automatically:

1. Run the app: `npm run dev`
2. Try to load a page that queries (e.g., Receipts or Clients)
3. **You'll see an error message with a direct link**
4. Click the link - **Firebase Console opens automatically**
5. Click **Create Index** button
6. Wait 2-5 minutes for index creation
7. **Refresh your browser** - query should work now

### How to Create Indexes Manually

If the automatic link doesn't appear:

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database** → **Indexes** tab
4. Click **Create Index** button
5. Set:
   - **Collection ID:** (e.g., `receipts` or `clients`)
   - **Fields to index:** Add the fields from above
   - Click toggle for Ascending/Descending
6. Click **Create**
7. Wait for index to appear (takes 2-5 minutes)

**Note:** Once created, indexes are permanent. You'll only create each index once.

## Step 3: Environment Variables

Ensure your `.env.local` file has all Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 4: Test the Configuration

1. Run the development server: `npm run dev`
2. Create a user account (sign up)
3. Navigate to newly created receipt page
4. Check browser console for any Firebase errors

## Common Issues & Solutions

### Issue: "Missing or insufficient permissions"
**Solution:** 
- Verify you're signed in
- Check that security rules are published correctly
- Ensure `userId` field is set in all documents

### Issue: "The query requires an index"
**Solution:**
- Click the error message link to auto-create the index
- OR manually create composite indexes (see Step 2)
- Wait 2-5 minutes for index to become active

### Issue: "Could not retrieve document"
**Solution:**
- Verify the document exists in Firestore
- Check that the security rules allow the read operation
- Ensure `userId` matches the current user's UID

## Security Model

The application uses a simple **user ownership** model:

- Users can only read/write their own data
- All documents have a `userId` field that matches `auth.uid`
- Cross-user access is blocked at the Firestore level

## Collections Reference

| Collection | Fields | Ownership |
|-----------|--------|-----------|
| `users` | `uid`, `email`, `displayName`, `photoURL` | Self |
| `clients` | `userId`, `name`, `email`, `phone` | `userId` |
| `products` | `userId`, `name`, `price`, `stock` | `userId` |
| `receipts` | `userId`, `clientId`, `receiptNumber`, `total` | `userId` |
| `invoices` | `userId`, `clientId`, `items`, `total` | `userId` |
| `company_settings` | `userId`, `companyName`, `currency`, `phone` | `userId` |

## Troubleshooting Checklist

- [ ] Security rules updated and published
- [ ] Environment variables configured correctly
- [ ] Logged in with Firebase user account
- [ ] Composite indexes created (if needed)
- [ ] Browser console shows no Firebase errors
- [ ] Data appears in Firestore Console under correct collection
- [ ] `userId` field present on all documents

## Next Steps

Once Firebase is fully configured:
1. Test CRUD operations on each module (Receipts, Clients, Products, etc.)
2. Verify data persists across page refreshes
3. Test with multiple user accounts
4. Deploy application to production

For more information, see [Firebase Documentation](https://firebase.google.com/docs/firestore/security)
