# Handmade Arts & Crafts E-Commerce Architecture Specification

## 1. System Overview
This project is a complete production-quality, mobile-responsive single-owner e-commerce platform designed specifically for an Indian handmade artist/craft maker selling products across categories like Canvas Paintings, MDF Art, Lippan Art, Scented Wax Candles, and Resin Art.

The system is built as a unified Next.js App Router application with a dual storefront (Customer-facing boutique UI with light silk parchment aesthetic and paintbrush strokes) and back-office management system (Owner/Admin dashboard with live traffic data analytics).

---

## 2. Technology Stack & Free-Tier Ecosystem

| Component | Technology | Free Tier / Open-Source Details |
|---|---|---|
| **Frontend Framework** | Next.js 15 (React 19) + TypeScript | Open Source |
| **Styling** | Tailwind CSS v4 + Lucide Icons | Open Source |
| **Theme System** | Warm Light Silk Parchment, Jaipur Terracotta & Brass Accents | Open Source |
| **Festival Automation** | Dynamic Indian Calendar Greeting Banner (`FestivalBanner.tsx`) | Automatically detects 15th Aug, Oct 2, Nov 14, Jan 26 & Indian festivals |
| **Database & ORM** | SQLite (via `better-sqlite3`) / PostgreSQL-compatible schema | Local / Self-hosted / Supabase Free Tier compatible |
| **Live Analytics Engine**| Traffic Logs Table & `/api/traffic` endpoint | Real-time HTTP request, latency & bandwidth tracking |
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
13. `traffic_logs`: ID, path, method, ip, user_agent, response_time_ms, payload_bytes, timestamp.
