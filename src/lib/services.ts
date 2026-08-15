import { getDb } from './db';
import { seedDatabase } from './seed';

// Ensure DB is initialized and seeded
seedDatabase();

export interface StoreSettings {
  id: number;
  store_name: string;
  artist_name: string;
  tagline: string;
  bio: string;
  craft_philosophy: string;
  artist_photo: string;
  logo: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  address: string;
  instagram_url: string;
  currency_symbol: string;
  flat_shipping_rate: number;
  free_shipping_threshold: number;
  tax_enabled: number;
  tax_percentage: number;
  tax_inclusive: number;
  razorpay_key_id: string;
  razorpay_key_secret: string;
  razorpay_webhook_secret: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_hidden: number;
  created_at: string;
  product_count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  category_name?: string;
  category_slug?: string;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  cost_price: number | null;
  stock: number;
  min_stock_alert: number;
  dimensions: string | null;
  weight: string | null;
  material: string | null;
  color: string | null;
  is_handmade: number;
  is_made_to_order: number;
  production_time_days: number;
  shipping_info: string | null;
  is_featured: number;
  is_new: number;
  is_bestseller: number;
  is_limited_edition: number;
  is_active: number;
  seo_title: string | null;
  seo_description: string | null;
  images?: string[];
  created_at: string;
  avg_rating?: number;
  review_count?: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_value: number;
  max_discount: number | null;
  usage_limit: number;
  usage_count: number;
  per_customer_limit: number;
  is_active: number;
}

export interface CartCalculationInput {
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
  coupon_code?: string;
}

export function getStoreSettings(): StoreSettings {
  const db = getDb();
  return db.prepare('SELECT * FROM store_settings WHERE id = 1').get() as StoreSettings;
}

export function getHomepageSections() {
  const db = getDb();
  return db.prepare('SELECT * FROM homepage_sections WHERE id = 1').get();
}

export function getAllCategories(includeHidden = false): Category[] {
  const db = getDb();
  const query = includeHidden
    ? 'SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id GROUP BY c.id ORDER BY c.display_order ASC'
    : 'SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id WHERE c.is_hidden = 0 GROUP BY c.id ORDER BY c.display_order ASC';
  return db.prepare(query).all() as Category[];
}

export function getCategoryBySlug(slug: string): Category | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as Category) || null;
}

export function getProducts(options: {
  category_id?: string;
  category_slug?: string;
  search?: string;
  is_featured?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
  is_sale?: boolean;
  is_active_only?: boolean;
  sort_by?: string;
  min_price?: number;
  max_price?: number;
  in_stock_only?: boolean;
  limit?: number;
} = {}): Product[] {
  const db = getDb();
  const conditions: string[] = [];
  const params: any[] = [];

  if (options.is_active_only !== false) {
    conditions.push('p.is_active = 1');
  }

  if (options.category_id) {
    conditions.push('p.category_id = ?');
    params.push(options.category_id);
  }

  if (options.category_slug) {
    conditions.push('c.slug = ?');
    params.push(options.category_slug);
  }

  if (options.search) {
    conditions.push('(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ? OR p.material LIKE ?)');
    const term = `%${options.search}%`;
    params.push(term, term, term, term);
  }

  if (options.is_featured) conditions.push('p.is_featured = 1');
  if (options.is_new) conditions.push('p.is_new = 1');
  if (options.is_bestseller) conditions.push('p.is_bestseller = 1');
  if (options.is_sale) conditions.push('(p.sale_price IS NOT NULL AND p.sale_price < p.price)');
  if (options.in_stock_only) conditions.push('(p.stock > 0 OR p.is_made_to_order = 1)');
  if (options.min_price) {
    conditions.push('COALESCE(p.sale_price, p.price) >= ?');
    params.push(options.min_price);
  }
  if (options.max_price) {
    conditions.push('COALESCE(p.sale_price, p.price) <= ?');
    params.push(options.max_price);
  }

  let orderBy = 'p.created_at DESC';
  if (options.sort_by === 'price_low') orderBy = 'COALESCE(p.sale_price, p.price) ASC';
  if (options.sort_by === 'price_high') orderBy = 'COALESCE(p.sale_price, p.price) DESC';
  if (options.sort_by === 'popular') orderBy = 'p.is_bestseller DESC, p.created_at DESC';

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const limitClause = options.limit ? `LIMIT ${options.limit}` : '';

  const sql = `
    SELECT p.*, c.name as category_name, c.slug as category_slug,
           COALESCE(AVG(r.rating), 5) as avg_rating,
           COUNT(r.id) as review_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
    ${whereClause}
    GROUP BY p.id
    ORDER BY ${orderBy}
    ${limitClause}
  `;

  const products = db.prepare(sql).all(...params) as Product[];

  // Attach images
  const getImageStmt = db.prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order ASC');
  for (const prod of products) {
    const imgRows = getImageStmt.all(prod.id) as { image_url: string }[];
    prod.images = imgRows.map(i => i.image_url);
    if (prod.images.length === 0) {
      prod.images = ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800'];
    }
  }

  return products;
}

export function getProductBySlug(slug: string): Product | null {
  const db = getDb();
  const sql = `
    SELECT p.*, c.name as category_name, c.slug as category_slug,
           COALESCE(AVG(r.rating), 5) as avg_rating,
           COUNT(r.id) as review_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
    WHERE p.slug = ?
    GROUP BY p.id
  `;
  const prod = db.prepare(sql).get(slug) as Product;
  if (!prod) return null;

  const imgRows = db.prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order ASC').all(prod.id) as { image_url: string }[];
  prod.images = imgRows.map(i => i.image_url);
  if (prod.images.length === 0) {
    prod.images = ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800'];
  }
  return prod;
}

export function calculateCartTotals(input: CartCalculationInput) {
  const db = getDb();
  const settings = getStoreSettings();

  let subtotal = 0;
  const items: Array<{
    product: Product;
    quantity: number;
    unit_price: number;
    total_price: number;
    stock_available: boolean;
  }> = [];

  for (const item of input.items) {
    const prod = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id) as Product;
    if (!prod || !prod.is_active) continue;

    const imgRow = db.prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order ASC LIMIT 1').get(prod.id) as { image_url: string };
    prod.images = [imgRow ? imgRow.image_url : 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800'];

    const unit_price = prod.sale_price !== null && prod.sale_price < prod.price ? prod.sale_price : prod.price;
    const total_price = unit_price * item.quantity;
    subtotal += total_price;

    items.push({
      product: prod,
      quantity: item.quantity,
      unit_price,
      total_price,
      stock_available: prod.is_made_to_order === 1 || prod.stock >= item.quantity
    });
  }

  let coupon_discount = 0;
  let applied_coupon: Coupon | null = null;
  let coupon_error: string | null = null;

  if (input.coupon_code) {
    const coupon = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1').get(input.coupon_code.trim()) as Coupon;
    if (!coupon) {
      coupon_error = 'Invalid or expired coupon code.';
    } else if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      coupon_error = 'This coupon usage limit has been reached.';
    } else if (subtotal < coupon.min_order_value) {
      coupon_error = `Minimum order amount of ₹${coupon.min_order_value} required for coupon ${coupon.code}.`;
    } else {
      applied_coupon = coupon;
      if (coupon.type === 'percentage') {
        coupon_discount = (subtotal * coupon.value) / 100;
        if (coupon.max_discount && coupon_discount > coupon.max_discount) {
          coupon_discount = coupon.max_discount;
        }
      } else {
        coupon_discount = coupon.value;
      }
      if (coupon_discount > subtotal) {
        coupon_discount = subtotal;
      }
    }
  }

  const subtotalAfterDiscount = subtotal - coupon_discount;
  let shipping_charge = 0;
  if (subtotalAfterDiscount > 0) {
    if (settings.free_shipping_threshold > 0 && subtotalAfterDiscount >= settings.free_shipping_threshold) {
      shipping_charge = 0;
    } else {
      shipping_charge = settings.flat_shipping_rate;
    }
  }

  let tax_amount = 0;
  if (settings.tax_enabled) {
    if (!settings.tax_inclusive) {
      tax_amount = (subtotalAfterDiscount * settings.tax_percentage) / 100;
    }
  }

  const final_total = subtotalAfterDiscount + shipping_charge + tax_amount;

  return {
    subtotal,
    coupon_discount,
    applied_coupon,
    coupon_error,
    subtotalAfterDiscount,
    shipping_charge,
    tax_amount,
    final_total,
    items
  };
}
