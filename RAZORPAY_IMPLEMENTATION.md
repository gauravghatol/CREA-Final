# Razorpay Payment Gateway Integration Guide

## Overview
A complete, production-ready Razorpay integration for **Donations** and **Memberships** with robust server-side payment verification using HMAC SHA256 signatures.

## 🔒 Security Implementation

### Server-Side Verification Flow
The implementation follows PCI-DSS compliance by **NEVER trusting frontend success callbacks**:

1. **Frontend**: Collects donation/membership details
2. **Backend**: Creates Razorpay Order and returns `orderId` + `keyId`
3. **Frontend**: Opens Razorpay Modal with order details
4. **Razorpay**: User completes payment
5. **Frontend**: Receives payment callback with `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`
6. **Backend**: Verifies signature using HMAC SHA256 with `RAZORPAY_KEY_SECRET`
7. **Backend**: ONLY marks transaction as successful if signature matches

### Signature Verification Logic
```javascript
const body = `${razorpay_order_id}|${razorpay_payment_id}`;
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(body)
  .digest('hex');

if (expectedSignature !== razorpay_signature) {
  throw new Error('Payment verification failed - Invalid signature');
}
```

## 🚀 Implementation Files

### Backend Changes

#### 1. **Models Updated**

**`backend/models/donationModel.js`**
- Added fields:
  - `razorpayOrderId` - Razorpay order reference
  - `razorpayPaymentId` - Razorpay payment ID
  - `razorpaySignature` - Verified payment signature

**`backend/models/membershipModel.js`**
- Added same Razorpay fields
- Payment status now updated after verification

#### 2. **Controllers Updated**

**`backend/controllers/donationController.js`**
- `createOrder(req, res)` - Create donation and Razorpay order
- `verifyPayment(req, res)` - Verify signature and mark payment complete
- Existing CRUD operations preserved

**`backend/controllers/membershipController.js`**
- `createOrder(req, res)` - Create membership and Razorpay order
- `verifyPayment(req, res)` - Verify and activate membership
- Auto-activates membership on successful payment

#### 3. **Routes Updated**

**`backend/routes/donationRoutes.js`**
```
POST /api/donations/create-order          - Create payment order
POST /api/donations/verify-payment        - Verify payment signature
```

**`backend/routes/membershipRoutes.js`**
```
POST /api/memberships/create-order        - Create payment order
POST /api/memberships/verify-payment      - Verify payment signature
```

### Frontend Changes

#### 1. **API Service Updated** (`Frontend/src/services/api.ts`)
```typescript
export async function createDonationOrder(data)
export async function verifyDonationPayment(data)
export async function createMembershipOrder(form)
export async function verifyMembershipPayment(data)
```

#### 2. **Pages Updated**

**`Frontend/src/pages/Donations.tsx`**
- Razorpay modal integration
- Step 1: Form submission → backend order creation
- Step 2: Open Razorpay modal
- Step 3: Handle payment callback → backend verification
- Success message on verified payment

**`Frontend/src/pages/Membership.tsx`**
- Same flow as donations
- Auto-activates membership on verification

## 📋 Environment Variables Required

Add to `.env` file:
```bash
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

## 🔄 Payment Flow Diagram

```
┌─────────────────┐
│   User Submits  │
│   Form (React)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Backend: Create Order               │
│ - Save donation/membership          │
│ - Create Razorpay Order ID          │
│ - Return orderId + keyId            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Frontend: Open Razorpay Modal       │
│ - Pass order ID and key             │
│ - User completes payment            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Razorpay Returns:                   │
│ - razorpay_order_id                 │
│ - razorpay_payment_id               │
│ - razorpay_signature                │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Backend: Verify Payment             │
│ - Generate expected signature       │
│ - Compare with received signature   │
│ - IF MATCH: Mark as successful      │
│ - IF NO MATCH: Reject payment       │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Frontend: Show Success/Error        │
└─────────────────────────────────────┘
```

## ✅ Key Features

### Donations
- ✓ Create donation record with pending status
- ✓ Generate Razorpay order
- ✓ Verify payment signature
- ✓ Mark as completed on verification
- ✓ Store Razorpay details for reconciliation

### Memberships
- ✓ Validate membership form before payment
- ✓ Create membership record with pending status
- ✓ Generate Razorpay order with membership amount
- ✓ Verify payment signature
- ✓ Auto-activate membership on verification
- ✓ Set validity periods

## 🛡️ Error Handling

**Frontend Errors:**
- Missing required fields
- Invalid amount
- Razorpay script load failure
- User cancellation
- Payment verification failure

**Backend Errors:**
- Invalid signature - payment rejected
- Duplicate email (memberships)
- Order not found
- Database save failure

## 🔍 Testing Checklist

1. **Donation Flow**
   - [ ] Form validation works
   - [ ] Order created successfully
   - [ ] Razorpay modal opens
   - [ ] Payment verification succeeds
   - [ ] Donation marked as completed

2. **Membership Flow**
   - [ ] Form validation works
   - [ ] Duplicate email prevention
   - [ ] Order created with correct amount
   - [ ] Razorpay modal opens
   - [ ] Payment verification succeeds
   - [ ] Membership marked as active

3. **Security**
   - [ ] Invalid signatures rejected
   - [ ] Payment details stored correctly
   - [ ] No duplicate payments processed

## 📊 Database Records

### Donation Record
```javascript
{
  fullName: "John Doe",
  email: "john@example.com",
  mobile: "9876543210",
  amount: 1000,
  purpose: "education",
  paymentStatus: "completed",
  razorpayOrderId: "order_xxxxx",
  razorpayPaymentId: "pay_xxxxx",
  razorpaySignature: "hex_signature",
  createdAt: "2025-12-17T10:00:00Z"
}
```

### Membership Record
```javascript
{
  name: "Jane Smith",
  email: "jane@example.com",
  type: "ordinary",
  paymentAmount: 500,
  paymentStatus: "completed",
  status: "active",
  razorpayOrderId: "order_xxxxx",
  razorpayPaymentId: "pay_xxxxx",
  razorpaySignature: "hex_signature",
  validFrom: "2025-12-17T00:00:00Z",
  validUntil: "2026-12-17T00:00:00Z",
  createdAt: "2025-12-17T10:00:00Z"
}
```

## 🚨 Important Notes

1. **Never deploy without HTTPS** - Razorpay requires secure connections
2. **Keep `RAZORPAY_KEY_SECRET` secret** - Store in `.env`, never commit to git
3. **Verify signatures server-side** - This is the most critical security step
4. **Test with Razorpay test credentials** before going live
5. **Monitor payment reconciliation** - Regularly check for failed/pending payments

## 📱 Live Mode Setup

To go live with Razorpay:
1. Register on [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Get production `KEY_ID` and `KEY_SECRET`
3. Update `.env` with production credentials
4. Thoroughly test payment flow
5. Enable production mode in Razorpay dashboard
6. Deploy to production

## 🐛 Troubleshooting

**Signature Mismatch**
- Verify `RAZORPAY_KEY_SECRET` is correct
- Check order ID and payment ID format
- Ensure HMAC SHA256 is used

**Payment Not Verifying**
- Check if order exists in database
- Verify donation/membership ID matches
- Check for duplicate payment attempts

**Razorpay Modal Not Opening**
- Ensure script is loaded correctly
- Check browser console for errors
- Verify order ID format

## 📚 References

- [Razorpay Checkout Documentation](https://razorpay.com/docs/payments/checkout/integrate/standard)
- [Payment Signature Verification](https://razorpay.com/docs/payments/webhooks/validate-webhook-signature/)
- [Razorpay Node.js SDK](https://github.com/razorpay/razorpay-node)
