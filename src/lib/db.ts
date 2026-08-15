import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

function resolveDbPath(): string {
  if (process.env.DATABASE_FILE) {
    return process.env.DATABASE_FILE;
  }
  // Cross-platform fallback: C:\Mangesh\Jules\GayatriPortal on Windows if accessible, or process.cwd()/store.db
  const defaultWindowsPath = 'C:\\Mangesh\\Jules\\GayatriPortal';
  try {
    if (process.platform === 'win32') {
      if (!fs.existsSync(defaultWindowsPath)) {
        fs.mkdirSync(defaultWindowsPath, { recursive: true });
      }
      return path.join(defaultWindowsPath, 'store.db');
    }
  } catch (e) {
    // Fall back to process.cwd()
  }
  return path.join(process.cwd(), 'store.db');
}

const DB_PATH = resolveDbPath();

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
    initTables(dbInstance);
  }
  return dbInstance;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS store_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      store_name TEXT NOT NULL DEFAULT 'KalaKriti Arts Studio',
      artist_name TEXT NOT NULL DEFAULT 'Ananya Sharma',
      tagline TEXT DEFAULT 'Handmade Indian Heritage & Contemporary Crafts',
      bio TEXT DEFAULT 'Ananya Sharma is an accomplished artisan from Rajasthan who combines traditional Indian craftsmanship like Lippan Kaam with contemporary resin and canvas art.',
      craft_philosophy TEXT DEFAULT 'Every creation carries a piece of soul, passion, and centuries of artistic tradition transformed into modern home decor.',
      artist_photo TEXT DEFAULT 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      logo TEXT DEFAULT '/logo.png',
      email TEXT DEFAULT 'artist@kalakritiarts.in',
      phone TEXT DEFAULT '+91 98765 43210',
      whatsapp_number TEXT DEFAULT '919876543210',
      address TEXT DEFAULT 'Studio 12, Craft Village, Jaipur, Rajasthan 302001',
      instagram_url TEXT DEFAULT 'https://instagram.com/kalakriti_arts',
      currency_symbol TEXT DEFAULT '₹',
      flat_shipping_rate REAL DEFAULT 100.0,
      free_shipping_threshold REAL DEFAULT 1999.0,
      tax_enabled INTEGER DEFAULT 0,
      tax_percentage REAL DEFAULT 18.0,
      tax_inclusive INTEGER DEFAULT 1,
      razorpay_key_id TEXT DEFAULT 'rzp_test_sampleKey123',
      razorpay_key_secret TEXT DEFAULT 'sampleSecretKey456',
      razorpay_webhook_secret TEXT DEFAULT 'webhookSecret789',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS homepage_sections (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      hero_title TEXT DEFAULT 'Exquisite Handmade Art from Jaipur',
      hero_subtitle TEXT DEFAULT 'Discover authentic Canvas Paintings, Lippan Art, Scented Candles, Resin Decor & MDF Crafts.',
      hero_cta_text TEXT DEFAULT 'Explore Collection',
      hero_cta_link TEXT DEFAULT '/shop',
      hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200',
      why_handmade_title TEXT DEFAULT 'Why Choose Handmade Crafts?',
      why_handmade_content TEXT DEFAULT 'Each piece is individually handcrafted with premium non-toxic materials. Owning handmade art brings authentic cultural heritage and artistic soul into your living spaces.',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      is_hidden INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sku TEXT UNIQUE,
      category_id TEXT,
      description TEXT,
      short_description TEXT,
      price REAL NOT NULL,
      sale_price REAL,
      cost_price REAL,
      stock INTEGER DEFAULT 0,
      min_stock_alert INTEGER DEFAULT 2,
      dimensions TEXT,
      weight TEXT,
      material TEXT,
      color TEXT,
      is_handmade INTEGER DEFAULT 1,
      is_made_to_order INTEGER DEFAULT 0,
      production_time_days INTEGER DEFAULT 0,
      shipping_info TEXT DEFAULT 'Ships within 24-48 hours across India',
      is_featured INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      is_bestseller INTEGER DEFAULT 0,
      is_limited_edition INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      seo_title TEXT,
      seo_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS discounts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('percentage', 'fixed')),
      value REAL NOT NULL,
      min_order_value REAL DEFAULT 0,
      max_discount REAL,
      target_type TEXT DEFAULT 'all' CHECK(target_type IN ('all', 'category', 'product')),
      target_id TEXT,
      start_date DATETIME,
      end_date DATETIME,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK(type IN ('percentage', 'fixed')),
      value REAL NOT NULL,
      min_order_value REAL DEFAULT 0,
      max_discount REAL,
      start_date DATETIME,
      end_date DATETIME,
      usage_limit INTEGER DEFAULT 100,
      usage_count INTEGER DEFAULT 0,
      per_customer_limit INTEGER DEFAULT 1,
      product_id TEXT,
      category_id TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount_amount REAL DEFAULT 0,
      coupon_code TEXT,
      shipping_charge REAL DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_status TEXT DEFAULT 'Pending' CHECK(payment_status IN ('Pending', 'Confirmed', 'Failed')),
      payment_method TEXT DEFAULT 'Razorpay',
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      razorpay_signature TEXT,
      status TEXT DEFAULT 'Payment Pending' CHECK(status IN ('Payment Pending', 'Payment Confirmed', 'Processing', 'Ready to Ship', 'Shipped', 'Delivered', 'Cancelled', 'Refund Requested', 'Refunded')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      sku TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      is_approved INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT DEFAULT 'Store Owner',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS qr_codes (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      target_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS traffic_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      method TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      response_time_ms REAL,
      payload_bytes INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
