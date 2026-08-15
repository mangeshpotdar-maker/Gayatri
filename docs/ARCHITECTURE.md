# Handmade Arts & Crafts E-Commerce Architecture Specification

## 1. System Overview
This project is a complete production-quality, mobile-responsive single-owner e-commerce platform designed specifically for an Indian handmade artist/craft maker selling products across categories like Canvas Paintings, MDF Art, Lippan Art, Scented Wax Candles, and Resin Art.

The system is built as a unified Next.js App Router application with a dual storefront (Customer-facing boutique UI) and back-office management system (Owner/Admin dashboard).

---

## 2. Technology Stack & Free-Tier Ecosystem

| Component | Technology | Free Tier / Open-Source Details |
|---|---|---|
| **Frontend Framework** | Next.js 15 (React 19) + TypeScript | Open Source |
| **Styling** | Tailwind CSS v4 + Lucide Icons | Open Source |
| **Database & ORM** | SQLite (via `better-sqlite3`) / PostgreSQL-compatible schema | Local / Self-hosted / Supabase Free Tier compatible |
| **Authentication** | Custom JWT + HTTP-only cookies / Auth helper | Zero monthly cost |
| **Payment Gateway** | Razorpay (Test/Live mode integration with UPI QR) | Free setup, standard transaction fees apply (~2% per transaction) |
| **QR Code Engine** | `qrcode` node package | 100% Free / Open Source |
| **Deployment Target** | Vercel / Netlify / Render / Docker | Free tier hosting on Vercel / Render |

---

## 3. Database Schema Design (ER Summary)

### Tables
1. `store_settings`: Store branding, artist profile, GST/Tax config, WhatsApp contact, payment gateway keys, shipping rates.
2. `homepage_sections`: Dynamic homepage content (hero title, hero image, biography, "why handmade" text).
3. `categories`: ID, name, slug, image_url, description, display_order, is_hidden.
4. `products`: ID, name, slug, sku, category_id, description, short_description, price, sale_price, cost_price, stock, min_stock_alert, dimensions, weight, material, color, is_handmade, is_made_to_order, production_time_days, shipping_info, is_featured, is_new, is_bestseller, is_limited_edition, is_active, seo_title, seo_description.
5. `product_images`: ID, product_id, image_url, display_order.
6. `discounts`: Percentage/Fixed site-wide/category/product discount rules.
7. `coupons`: Code, discount_type, discount_value, min_order_value, max_discount, start_date, end_date, usage_limit, per_customer_limit, active.
8. `orders`: ID, order_number, customer_name, customer_email, customer_phone, shipping_address, subtotal, discount_amount, coupon_code, shipping_charge, tax_amount, total_amount, payment_status, payment_id, razorpay_order_id, razorpay_signature, status, notes, created_at.
9. `order_items`: ID, order_id, product_id, product_name, price, quantity, total.
10. `reviews`: ID, product_id, customer_name, customer_email, rating, comment, is_approved, created_at.
11. `wishlists`: ID, user_id, session_id, product_id.
12. `qr_codes`: ID, entity_type (product/store/order), entity_id, target_url, qr_svg.

---

## 4. User Flows & Workflows

### A. Customer Flow
```
Homepage -> Category Catalog -> Filter/Sort -> Product Detail -> Add to Cart -> Cart View
   -> Guest or Account Checkout -> Enter Address -> Apply Coupon -> Payment Selection (UPI/QR/Cards)
   -> Server Payment Verification -> Order Confirmation -> Order Status Tracking
```

### B. Payment Workflow (Razorpay Sandbox/Live with Server-side Verification)
```
Checkout -> Create Order API (`/api/checkout/create-order`)
   -> Generate Razorpay Order & Signatures
   -> Customer Scans UPI QR or pays via Razorpay Gateway
   -> Webhook / Verification Endpoint (`/api/checkout/verify`) validates HMAC Signature
   -> Verify Amount & Coupon
   -> Atomic Stock Deduction -> Mark Order "Payment Confirmed" -> Order Receipt
```

### C. Owner/Admin Workflow
```
/admin/login -> Dashboard Summary (Sales metrics, Stock alerts)
   ├── Products Admin (Add, Edit, Price change, Image upload, QR generation)
   ├── Categories Admin (Create, Reorder, Hide/Show)
   ├── Orders Admin (Status updates: Pending -> Processing -> Shipped -> Delivered)
   ├── Coupons & Discounts Admin (Rule creation & expiry)
   ├── Customer Reviews Moderation
   └── Store Settings (Razorpay Keys, Shipping rates, WhatsApp details, Hero banner text)
```

---

## 5. Page Map

- `/` - Homepage
- `/shop` - Product listing with search & filters
- `/category/[slug]` - Category page
- `/product/[slug]` - Product details with QR modal & reviews
- `/cart` - Shopping cart
- `/checkout` - Checkout page (Guest or logged in)
- `/order-confirmation/[id]` - Order confirmation & tracking
- `/wishlist` - Saved items
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Sales summary
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management & status updates
- `/admin/coupons` - Coupon & Discount engine
- `/admin/inventory` - Low stock monitoring & adjustments
- `/admin/reviews` - Review approvals
- `/admin/homepage` - CMS for homepage content
- `/admin/qr` - Store & Product QR Code Generator
- `/admin/settings` - Store configuration
