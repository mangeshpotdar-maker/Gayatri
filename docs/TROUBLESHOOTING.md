# KalaKriti Arts Studio — Troubleshooting Guide

## 1. Common Issues & Solutions

### A. Customer Payment Verification Error
- **Symptom:** Order status remains "Payment Pending" after Razorpay payment.
- **Cause:** Razorpay HMAC signature mismatch or invalid API Secret key.
- **Solution:** Verify `razorpay_key_id` and `razorpay_key_secret` in Admin Settings match your Razorpay Dashboard credentials.

### B. Images Not Loading
- **Symptom:** Product image displays broken icon.
- **Cause:** External image URL blocked or typo in HTTPS link.
- **Solution:** Ensure image URLs in Admin Product form begin with `https://` and point to valid image files (e.g. Unsplash or Supabase Storage).

### C. Coupon Code Not Applying
- **Symptom:** Customer sees "Minimum order requirement not met".
- **Cause:** Cart subtotal after items is less than the coupon's `min_order_value`.
- **Solution:** Customer must add more items to cart, or admin can lower `min_order_value` in Admin ➔ Coupons.

### D. Stock Level Shows "Sold Out"
- **Symptom:** Customer cannot add item to cart.
- **Cause:** Ready-to-ship product stock reached `0`.
- **Solution:** In Admin ➔ Products/Inventory, increase stock quantity or toggle the product to "Made to Order".

---

## 2. Emergency Database Reset / Seed
If database file needs re-seeding during setup, run:
```bash
npx tsx -e "import { seedDatabase } from './src/lib/seed'; seedDatabase();"
```
