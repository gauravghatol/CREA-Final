# 🎯 UPI Testing Quick Reference Card

## Test UPI VPAs (Copy & Paste)

### ✅ Success VPAs
```
success@razorpay
9999999999@hdfcbank
9999999999@okaxis
9999999999@ibl
9999999999@airtel
9999999999@upi
testuser@ybl
```

### ❌ Failure VPAs
```
failure@razorpay
10000000000@hdfcbank
```

### ⏱️ Timeout VPAs
```
timeout@razorpay
```

---

## 🚀 Quick Start Test (2 Minutes)

### 1. Verify Setup ✓
```bash
# Check .env has test credentials
Get-Content E:\CREA\backend\.env | Select-String RAZORPAY

# Should show:
# RAZORPAY_KEY_ID=rzp_test_xxxxx
# RAZORPAY_KEY_SECRET=xxxxx
```

### 2. Start Servers ✓
```bash
# Terminal 1 - Backend
cd E:\CREA\backend
npm run dev

# Terminal 2 - Frontend
cd E:\CREA\Frontend
npm run dev
```

### 3. Test Payment ✓
1. Open http://localhost:5173
2. Go to **Donations**
3. Fill form:
   - Name: `Test User`
   - Email: `test@test.com`
   - Amount: `100`
4. Click **Donate Now**
5. Click **UPI** tab
6. Enter: `success@razorpay`
7. Click **Pay ₹100**
8. ✅ Should see **Success!**

---

## 📋 Verification Checklist

| Step | Verify | Result |
|------|--------|--------|
| Order Created | Check console | orderId appears |
| Modal Opens | Visual check | UPI tab visible |
| VPA Entered | Manual entry | `success@razorpay` |
| Payment Sent | Backend log | "Payment verified successfully" |
| DB Updated | Query donation | paymentStatus: 'completed', paymentMethod: 'upi' |
| Email Sent | Check inbox | Receipt email received |
| Receipt PDF | File system | `backend/uploads/receipts/donation-receipt-*.pdf` |

---

## 🔧 Troubleshooting (30 Seconds)

### UPI Tab Not Showing?
```bash
# 1. Verify credentials
RAZORPAY_KEY_ID must start with rzp_test_

# 2. Restart backend
npm run dev

# 3. Check browser console for errors
F12 → Console → Look for Razorpay errors
```

### Payment Not Verifying?
```bash
# 1. Check RAZORPAY_KEY_SECRET
Get-Content E:\CREA\backend\.env | Select-String KEY_SECRET

# 2. Verify it matches Razorpay dashboard
# 3. Restart backend and try again
```

### Email Not Received?
```bash
# 1. Check EMAIL_USER and EMAIL_PASSWORD in .env
# 2. Verify Gmail App Password (not regular password)
# 3. Check backend logs for email errors
# 4. Whitelist your domain in Gmail
```

---

## 📊 Expected Database Entry

After successful test payment with `success@razorpay`:

```javascript
{
  fullName: "Test User",
  email: "test@test.com",
  amount: 100,
  paymentStatus: "completed",
  paymentMethod: "upi",              ← This should be 'upi'
  upiId: "success@razorpay",         ← VPA captured
  razorpayPaymentId: "pay_xxx",
  razorpaySignature: "verified"
}
```

---

## 🔑 Key Differences: UPI vs Card

| Feature | UPI | Card |
|---------|-----|------|
| VPA Format | `user@bank` | Credit/Debit Card |
| OTP Required | Yes | Yes |
| Speed | Instant | 1-3 days |
| Fee | Lower | Higher |
| Storage | VPA ID | Card masked |
| Test VPA | `success@razorpay` | `4111111111111111` |

---

## 📱 Real UPI IDs (After Going Live)

Users can use any real UPI ID:

| App | Format | Example |
|-----|--------|---------|
| Paytm | `username@paytm` | john@paytm |
| Google Pay | `phone@okaxis` | 9876543210@okaxis |
| PhonePe | `phone@ybl` | 9876543210@ybl |
| WhatsApp Pay | `username@okicici` | john@okicici |
| BHIM | `username@upi` | john@upi |
| Any Bank | `phone@bankname` | 9876543210@hdfcbank |

---

## ✅ Success Indicators

### ✓ Everything Working When:
- [ ] Modal opens with UPI tab
- [ ] Test VPA accepted without error
- [ ] "Payment successful" message shows
- [ ] Database shows `paymentMethod: 'upi'`
- [ ] Email received with receipt
- [ ] Receipt PDF file created

### ✗ Issues When:
- [ ] UPI tab not visible → Check credentials
- [ ] VPA rejected → Use correct test VPA
- [ ] Payment verification fails → Check KEY_SECRET
- [ ] Email not sent → Check Gmail credentials

---

## 🎯 Next Steps

1. **Now:** Test with `success@razorpay`
2. **Then:** Test with `failure@razorpay` (should fail)
3. **Then:** Test with different amounts
4. **Then:** Get production credentials
5. **Finally:** Go live with real UPI IDs

---

## 📞 Support Resources

- **Test Credentials:** Dashboard → Settings → API Keys → Test Mode
- **Razorpay Docs:** https://razorpay.com/docs/payments/upi/
- **Test Details:** https://razorpay.com/docs/payments/payments/test-upi-details/
- **Backend Logs:** `E:\CREA\backend` (npm run dev output)
- **Email Config:** `.env` file (SMTP settings)

---

## 🎉 You're Ready to Test!

1. Copy a test VPA from above
2. Follow Quick Start Test
3. Verify with checklist
4. You're done! 🚀

**Most common test case: `success@razorpay` - Always works!**
