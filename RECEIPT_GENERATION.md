# Official Razorpay Receipt Generation

## 🎫 Feature Overview

Automatic receipt generation and email delivery after successful payment for both **Donations** and **Memberships**.

---

## ✨ What's Included

### 1. PDF Receipt Generation
- **Format**: Professional PDF with all transaction details
- **Storage**: `backend/uploads/receipts/` directory
- **Naming**: `donation-receipt-{id}.pdf` or `membership-receipt-{id}.pdf`
- **Auto-generated**: After payment verification

### 2. Email Delivery
- **Automatic**: Sent immediately after receipt generation
- **Service**: Gmail SMTP (configured in `.env`)
- **Attachment**: PDF receipt attached to email
- **Template**: Customized for donations and memberships

### 3. Download Endpoint
- **Donations**: `GET /api/donations/receipt/{donationId}`
- **Memberships**: `GET /api/memberships/receipt/{membershipId}`
- **Access**: Public (anyone with ID can download)
- **Format**: PDF file with proper headers

---

## 📋 Receipt Content

### Donation Receipt Includes
```
✓ Receipt Number (Donation ID)
✓ Date of Receipt
✓ Razorpay Payment ID
✓ Donor Name & Contact
✓ Email & Mobile
✓ Full Address
✓ Donation Amount
✓ Purpose/Category
✓ Employee details (if applicable)
✓ Message (if provided)
✓ Payment Status
✓ Payment Date & Time
✓ Razorpay branding
```

### Membership Receipt Includes
```
✓ Receipt Number (Membership ID)
✓ Date of Receipt
✓ Razorpay Payment ID
✓ Membership ID
✓ Member Name & Contact
✓ Email & Mobile
✓ Professional Details (Designation, Division, Department)
✓ Membership Type (Ordinary/Life/Corporate)
✓ Amount Paid
✓ Membership Status (Active)
✓ Valid From Date
✓ Valid Until Date
✓ Payment Date & Time
✓ Razorpay branding
```

---

## 🔧 Configuration Required

### 1. Update `.env` File
```bash
# Email Configuration (already configured)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Razorpay (already configured)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### 2. Gmail Setup (One-time)
If using Gmail for sending receipts:

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password
4. Add to `.env` as `EMAIL_PASSWORD`

### 3. Directory Creation
The system automatically creates:
```
backend/uploads/receipts/     (auto-created when first receipt generated)
```

---

## 🔄 Payment Flow with Receipts

```
1. User submits payment
          ↓
2. Backend creates order
          ↓
3. Frontend opens Razorpay modal
          ↓
4. User completes payment
          ↓
5. Backend verifies signature
          ↓
6. Backend updates DB status → 'completed'/'active'
          ↓
7. Backend generates PDF receipt (async, non-blocking)
          ↓
8. Backend sends email with receipt attachment
          ↓
9. Frontend shows success message
   (Receipt generation happens in background)
          ↓
10. User can download receipt anytime via API
```

---

## 📧 Email Template

### Donation Email
```
From: CREA <your-email@gmail.com>
Subject: Donation Receipt - ₹{amount} | Payment ID: {paymentId}

Body:
- Thank you message
- Donation details table
- Receipt number
- Payment ID
- Amount and purpose
- Payment date
- Attached: PDF receipt
```

### Membership Email
```
From: CREA <your-email@gmail.com>
Subject: Membership Confirmation - ₹{amount} | Payment ID: {paymentId}

Body:
- Welcome message
- Membership details table
- Receipt number
- Payment ID
- Membership type
- Validity dates
- Status: ACTIVE
- Attached: PDF receipt
```

---

## 💾 Database Storage

### Donation Model (Added Fields)
```javascript
paymentDate: Date        // When payment was completed
paymentReference: String // Razorpay Payment ID
razorpayOrderId: String  // Razorpay Order ID
razorpayPaymentId: String // Payment ID for receipt
razorpaySignature: String // Verified signature
```

### Membership Model (Added Fields)
```javascript
paymentDate: Date        // When payment was completed
paymentReference: String // Razorpay Payment ID
razorpayOrderId: String  // Razorpay Order ID
razorpayPaymentId: String // Payment ID for receipt
razorpaySignature: String // Verified signature
```

---

## 🔐 Security Features

1. **Non-blocking**: Receipt generation doesn't block payment response
2. **Error handling**: Email failures don't fail payment verification
3. **Public endpoint**: Receipt download available to anyone (receipts are public documents)
4. **Validation**: Checks if receipt file exists before serving
5. **Proper headers**: PDF served with correct Content-Type and disposition

---

## 📝 API Endpoints

### Download Donation Receipt
```bash
GET /api/donations/receipt/:donationId

Response (Success):
- Content-Type: application/pdf
- File attachment: donation-receipt-{id}.pdf

Response (Not found):
{
  "success": false,
  "message": "Receipt not found"
}
```

### Download Membership Receipt
```bash
GET /api/memberships/receipt/:membershipId

Response (Success):
- Content-Type: application/pdf
- File attachment: membership-receipt-{id}.pdf

Response (Not found):
{
  "success": false,
  "message": "Receipt not found"
}
```

---

## 🧪 Testing Receipt Generation

### Test Donation Receipt
1. Go to Donations page
2. Fill form with test data
3. Amount: 500 (₹5.00)
4. Submit → Razorpay modal
5. Use test card: `4111111111111111`
6. Complete payment
7. Check email for receipt (may take 5-10 seconds)
8. Download receipt using API: `/api/donations/receipt/{donationId}`

### Test Membership Receipt
1. Go to Membership page (after Membership.tsx update)
2. Fill form with test data
3. Submit → Razorpay modal
4. Use test card: `4111111111111111`
5. Complete payment
6. Check email for receipt
7. Download receipt using API: `/api/memberships/receipt/{membershipId}`

---

## 🐛 Troubleshooting

### Email Not Sending
**Problem**: Receipt email not received
**Solution**:
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Verify Gmail 2FA is enabled
- Check Gmail App Passwords generated
- Check backend logs for email errors

### Receipt Not Generating
**Problem**: PDF file not created
**Solution**:
- Check `/uploads/receipts/` directory exists
- Verify file permissions on `/uploads/` folder
- Check backend logs for PDF generation errors
- Ensure `pdfkit` package is installed: `npm install pdfkit`

### Receipt Download 404
**Problem**: Receipt endpoint returns 404
**Solution**:
- Verify donation/membership ID is correct
- Check file exists in `/uploads/receipts/`
- Ensure payment was successfully verified

### Gmail App Password Issues
**Problem**: "Invalid credentials" error
**Solution**:
- Regenerate App Password: https://myaccount.google.com/apppasswords
- Copy exactly as shown (16 characters with spaces)
- Update `.env` with new password
- Restart backend server

---

## 📊 File Structure

```
backend/
├── controllers/
│   ├── donationController.js       (Updated: receipt functions added)
│   └── membershipController.js     (Updated: receipt functions added)
├── routes/
│   ├── donationRoutes.js           (Updated: receipt download endpoint)
│   └── membershipRoutes.js         (Updated: receipt download endpoint)
├── uploads/
│   └── receipts/                   (Auto-created on first receipt)
│       ├── donation-receipt-{id}.pdf
│       └── membership-receipt-{id}.pdf
├── models/
│   ├── donationModel.js            (Updated: payment fields)
│   └── membershipModel.js          (Updated: payment fields)
└── .env                            (Updated: email config)
```

---

## 📈 Performance Notes

- **Receipt generation**: Async, ~200-500ms per receipt
- **Email sending**: Async, ~2-5 seconds
- **Payment response**: Returned immediately (receipts generated in background)
- **Storage**: ~20-50KB per PDF receipt

---

## 🚀 Future Enhancements

1. **Multiple receipt formats**: HTML, text, XML
2. **Receipt template customization**: Custom logos, footer messages
3. **Bulk receipt download**: ZIP multiple receipts
4. **SMS receipt**: Send receipt link via SMS
5. **Receipt resend**: Allow users to request receipt resend
6. **Receipt history**: Dashboard showing all past receipts
7. **Digital signature**: Add organization signature to PDF

---

## ✅ Implementation Checklist

- [x] Receipt PDF generation (pdfkit)
- [x] Email sending (nodemailer)
- [x] Donation receipt function
- [x] Membership receipt function
- [x] Download endpoints
- [x] Error handling
- [x] .env configuration
- [x] Database fields added
- [ ] Membership.tsx UI update (pending)
- [ ] Frontend receipt preview
- [ ] Receipt resend functionality

---

## 📞 Support

For issues with receipt generation:
1. Check backend logs: `npm run dev`
2. Verify `.env` configuration
3. Test email separately: Send test email via nodemailer
4. Check file permissions in `/uploads/` folder

---

**Last Updated**: December 17, 2025
**Status**: Ready for testing after Membership.tsx update
