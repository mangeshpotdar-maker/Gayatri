# Reusable Master Prompt: India-Based Handmade Arts & Crafts E-Commerce Platform (KalaKriti Arts Studio)

> **Instructions for AI / Developers:** Use this prompt to reproduce, rebuild, or extend a complete, production-quality, mobile-responsive e-commerce website for a single individual artist/craft maker in India who creates and sells handmade arts and crafts products.

---

## 1. PROJECT OVERVIEW & GOALS

Build a full-stack, production-quality, mobile-responsive e-commerce application for a **single store owner / individual artisan** in India selling handmade art and craft items.

* **Type:** Single-owner artist boutique (NOT a multi-vendor marketplace).
* **Core Stakeholders:** 1 Store Owner/Artist, Multiple Customers.
* **Aesthetic Philosophy:** Premium artistic studio, warm Jaipur silk parchment palette (`#FDFBF7` background, terracotta `#C85A32` accents, brass gold highlights, paintbrush strokes), generous whitespace, refined typography, and handmade character.
* **Zero Code Management:** Store owner can manage products, categories, orders, coupons, discounts, inventory, reviews, homepage content, shipping rates, and store settings entirely via the admin UI without touching code.

---

## 2. KEY TECHNICAL STACK & ARCHITECTURE

* **Framework:** Next.js 15 (App Router, React 19, TypeScript)
* **Styling:** Tailwind CSS with custom colors (`parchment`, `terracotta`, `brass`) and Lucide Icons
* **Database:** SQLite via `better-sqlite3` (or PostgreSQL/Supabase for cloud deployment)
* **Authentication:** JWT-based HTTP-only cookie session auth for Admin (`/admin`), guest checkout for customers
* **Payment Engine:** Razorpay Integration with UPI, UPI QR Code generation, Credit/Debit cards, NetBanking, and mandatory server-side signature verification/webhook handling
* **QR Generation:** Vector SVG QR codes for Store URL, Artwork Product URLs, and dynamic UPI payment links
* **Setup & Installer:** Retro 90s/2000s Windows-style Game Setup Wizard (`/setup` web interface and `npm run setup` terminal installer)

---

## 3. CORE DOMAIN MODEL & DATABASE TABLES

The database schema (`src/lib/db.ts`) must support normalized relational structures with foreign keys, constraints, and audit fields (`created_at`, `updated_at`):

1. **`categories`**: `id`, `name`, `slug`, `description`, `image`, `sort_order`, `is_hidden`, `parent_id` (supports subcategories).
2. **`products`**: `id`, `name`, `sku`, `slug`, `category_id`, `description`, `short_description`, `price`, `sale_price`, `cost_price`, `stock_quantity`, `min_stock_alert`, `dimensions`, `weight`, `material`, `color`, `is_handmade`, `is_made_to_order`, `production_time`, `is_featured`, `is_new_arrival`, `is_best_seller`, `is_limited_edition`, `is_active`, `seo_title`, `seo_description`.
3. **`product_images`**: `id`, `product_id`, `image_url`, `alt_text`, `sort_order`.
4. **`orders`**: `id`, `order_number`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `subtotal`, `discount_amount`, `shipping_amount`, `tax_amount`, `total_amount`, `payment_status`, `order_status`, `payment_id`, `payment_method`, `coupon_code`.
5. **`order_items`**: `id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `subtotal`.
6. **`coupons`**: `id`, `code`, `discount_type` (`percentage` / `fixed`), `discount_value`, `min_order_amount`, `max_discount_amount`, `valid_from`, `valid_until`, `usage_limit`, `usage_count`, `is_active`.
7. **`reviews`**: `id`, `product_id`, `customer_name`, `rating` (1–5), `comment`, `is_approved`, `created_at`.
8. **`wishlists`**: `id`, `customer_id`, `product_id`.
9. **`store_settings`**: Key-value settings table (`store_name`, `artist_name`, `whatsapp_number`, `currency`, `flat_shipping_rate`, `free_shipping_threshold`, `razorpay_key_id`, `razorpay_key_secret`, `tax_enabled`, `tax_percentage`).
10. **`homepage_sections`**: Editable CMS content for Hero, Artist Bio, Why Handmade, Testimonials, and Social links.
11. **`traffic_logs`**: Live network and HTTP traffic analysis table (`ip`, `path`, `method`, `user_agent`, `status_code`, `timestamp`).

---

## 4. ESSENTIAL BUSINESS RULES & WORKFLOWS

### A. Customer Checkout & Pricing Rules
* **Guest Checkout:** Mandatory account creation is NOT required. Customers enter shipping name, Indian WhatsApp phone, email, and Indian address (PIN code, state, city).
* **Discount & Coupon Engine:**
  * Supports percentage and fixed rupee discounts with minimum order thresholds and maximum discount caps.
  * Validation must be performed **server-side** during cart calculation and order placement.
  * Formula Rule: Product Price - Discount + Shipping = Final Payable Amount. Example: ₹1,000 product + 10% coupon (`-₹100`) + ₹100 shipping = **₹1,000 total**.
* **Inventory Safeguards:** Atomic stock decrements in database transactions during order payment confirmation to prevent overselling. Supports "Ready-to-Ship" and "Made-to-Order" statuses.

### B. Payment Verification Architecture
* Payment initiation creates a `Payment Pending` order record.
* Server verifies Razorpay payment signatures (`razorpay_order_id|razorpay_payment_id` HMAC SHA256) or simulated UPI callback before changing status to `Payment Confirmed` and decrementing inventory.
* Customer uploaded payment screenshots are **never** treated as proof of payment.

### C. Admin Back-Office (`/admin`)
* Protected route with JWT cookie-based session verification.
* Full control over:
  * Sales Analytics & Live HTTP Traffic Monitor (`/api/traffic`).
  * Product creation, image ordering, price changes, and stock management.
  * Dynamic Category management (drag/reorder, rename, hide, descriptions).
  * Order fulfillment pipeline (Payment Pending → Payment Confirmed → Processing → Shipped → Delivered).
  * Coupon creation, usage limits, and expiration tracking.
  * Customer Review moderation (approve/hide/delete).
  * Store Settings (WhatsApp number, Shipping rates, GST, Razorpay credentials).
  * Vector QR Code Center for products, store home, and UPI.

---

## 5. SETUP & INSTALLATION EXPERIENCE

Provide a dual installer experience:
1. **Interactive Terminal Installer (`npm run setup`):** A custom Node.js script (`scripts/install-wizard.js`) styled as a retro 90s/2000s Windows Game Setup Wizard with ASCII borders, EULA confirmation, target folder path selection (`C:\Mangesh\Jules\GayatriPortal`), database initialization, and sample seed data loading.
2. **Web Setup Wizard (`/setup`):** A retro Windows 95/98 GUI wizard in the browser complete with title bar, minimize/maximize buttons, 3D gray dialog panels, EULA license agreement, and animated progress bar.

---

## 6. PROMPT TO EXECUTE THIS TASK

Copy and paste the prompt below to recreate this project in any software development environment:

```text
You are an expert full-stack engineer. Build a complete, production-ready, mobile-responsive e-commerce platform for an Indian handmade arts & crafts studio called "KalaKriti Arts Studio" (Single-Owner Store).

Requirements:
1. Framework & Database: Use Next.js 15 (App Router, TypeScript, Tailwind CSS, Lucide Icons) and SQLite (better-sqlite3). Base installation path: C:\Mangesh\Jules\GayatriPortal.
2. Aesthetic System: Warm Jaipur Silk Parchment visual theme (#FDFBF7 background, terracotta #C85A32 accents, brass gold highlights, paintbrush stroke accents).
3. Features:
   - Dynamic Product Catalog (Ready-to-Ship & Made-to-Order items with lead times).
   - Dynamic Category Management (Add, rename, reorder, hide/show, database-driven subcategories).
   - Guest Checkout & Cart Engine (Server-side coupon calculation, Indian address validation, PIN code, state dropdown).
   - Indian Payment Architecture (Razorpay test/live gateway, UPI QR code modal, mandatory HMAC server-side payment verification).
   - Dynamic Indian Festival Banner (Detects Independence Day, Republic Day, Gandhi Jayanti, Diwali/Holi).
   - Back-Office Admin Dashboard (/admin) with live HTTP traffic monitor, inventory controls, order pipeline updates, coupon engine, review moderation, CMS for homepage, and QR center.
   - Dual Setup Wizard (CLI terminal installer via 'npm run setup' and retro Windows 95/98 web wizard at '/setup').
   - Automated Jest unit tests covering business logic (e.g. ₹1,000 product + 10% coupon + ₹100 shipping = ₹1,000 total).
4. Save the full codebase, database schema, migration scripts, sample seed data, and detailed markdown documentation (ARCHITECTURE.md, USER_MANUAL.md, TROUBLESHOOTING.md, DEPLOYMENT.md).
```
