import { getDb } from './db';
import bcrypt from 'bcryptjs';

export function seedDatabase() {
  const db = getDb();

  // Check if store_settings already exists
  const settingsCount = (db.prepare('SELECT COUNT(*) as count FROM store_settings').get() as { count: number }).count;
  if (settingsCount === 0) {
    db.prepare(`
      INSERT INTO store_settings (id, store_name, artist_name, tagline, bio, craft_philosophy, artist_photo, logo, email, phone, whatsapp_number, address, instagram_url, currency_symbol, flat_shipping_rate, free_shipping_threshold, tax_enabled, tax_percentage, tax_inclusive, studio_location, studio_badge)
      VALUES (1, 'Gayatris Creations', 'Gayatri Potdar', 'Handmade Indian Heritage & Contemporary Crafts', 'Gayatri Potdar is an artisan based in Pune, India. She merges centuries-old heritage crafts like Lippan Kaam with modern resin art and textured canvas paintings.', 'Each creation is crafted by hand using eco-friendly and sustainably sourced Indian materials.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800', '/logo.png', 'soniyapandit@gmail.com', '+91 92847 24914', '9284724914', 'Pune, Maharashtra 411001', 'https://instagram.com/gayatris_creations', '₹', 100.0, 1999.0, 0, 18.0, 1, 'Pune, Maharashtra Studio', '100% Authentic Handcraft')
    `).run();
  }

  const homepageCount = (db.prepare('SELECT COUNT(*) as count FROM homepage_sections').get() as { count: number }).count;
  if (homepageCount === 0) {
    db.prepare(`
      INSERT INTO homepage_sections (id, hero_title, hero_subtitle, hero_cta_text, hero_cta_link, hero_image, why_handmade_title, why_handmade_content)
      VALUES (1, 'Exquisite Handmade Art from Pune', 'Discover authentic Canvas Paintings, Lippan Art, Scented Wax Candles, Resin Decor & MDF Crafts.', 'Explore Collection', '/shop', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200', 'Why Choose Handmade Artwork?', 'Every single piece is lovingly handcrafted using premium quality non-toxic materials. Owning handmade art brings authentic cultural heritage and artistic soul into your living spaces.')
    `).run();
  }

  // Create default admin user
  const adminCount = (db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number }).count;
  if (adminCount === 0) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO admin_users (id, email, password_hash, name)
      VALUES ('admin-1', 'soniyapandit@gmail.com', ?, 'Gayatri Potdar')
    `).run(passwordHash);
  }

  // Seed Categories if empty
  const categoryCount = (db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number }).count;
  if (categoryCount === 0) {
    const categories = [
      {
        id: 'cat-canvas',
        name: 'Canvas Paintings',
        slug: 'canvas-paintings',
        description: 'Original acrylic and oil textured paintings on stretched cotton canvas.',
        image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
        display_order: 1
      },
      {
        id: 'cat-mdf',
        name: 'MDF Art Products',
        slug: 'mdf-art-products',
        description: 'Hand-painted wooden coasters, key holders, cutouts and tea light trays.',
        image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
        display_order: 2
      },
      {
        id: 'cat-lippan',
        name: 'Lippan Art',
        slug: 'lippan-art',
        description: 'Traditional Gujarati mud and mirror relief artwork for vibrant wall decor.',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        display_order: 3
      },
      {
        id: 'cat-candles',
        name: 'Scented Wax Candles',
        slug: 'scented-wax-candles',
        description: 'Hand-poured pure soy wax candles enriched with organic Indian aromatherapy oils.',
        image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
        display_order: 4
      },
      {
        id: 'cat-resin',
        name: 'Resin Art Products',
        slug: 'resin-art-products',
        description: 'Glossy ocean-theme platters, wall clocks, bookmark sets and preserved flower coasters.',
        image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
        display_order: 5
      }
    ];

    const insertCat = db.prepare(`
      INSERT INTO categories (id, name, slug, description, image_url, display_order)
      VALUES (@id, @name, @slug, @description, @image_url, @display_order)
    `);

    for (const cat of categories) {
      insertCat.run(cat);
    }
  }

  // Seed Products if empty
  const productCount = (db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number }).count;
  if (productCount === 0) {
    const productsData = [
      // 3 Canvas Paintings
      {
        id: 'prod-canvas-1',
        name: 'Golden Horizon Textured Canvas Painting',
        slug: 'golden-horizon-textured-canvas-painting',
        sku: 'CNV-GOL-01',
        category_id: 'cat-canvas',
        description: 'Hand-painted with gold leaf and thick acrylic texture strokes.',
        short_description: '24x36 inch gold leaf textured acrylic wall painting.',
        price: 3500,
        sale_price: 2999,
        cost_price: 1200,
        stock: 3,
        min_stock_alert: 1,
        dimensions: '24 x 36 inches',
        weight: '1.8 kg',
        material: 'Acrylic & Gold Leaf on Cotton Canvas',
        color: 'Gold, Ochre & Cream',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Ready to ship in 24 hours in rigid frame packaging',
        is_featured: 1,
        is_new: 1,
        is_bestseller: 1,
        is_limited_edition: 1,
        is_active: 1,
        seo_title: 'Golden Horizon Canvas Painting | Gayatris Creations',
        seo_description: 'Buy handmade golden horizon acrylic canvas painting online with real gold leaf accents.',
        images: [
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        id: 'prod-canvas-2',
        name: 'Monsoon Lotus Bloom Canvas',
        slug: 'monsoon-lotus-bloom-canvas',
        sku: 'CNV-LOT-02',
        category_id: 'cat-canvas',
        description: 'Serene lotus pond scene with rich turquoise and emerald tones. Finished with protective gloss varnish.',
        short_description: '18x24 inch botanical lotus hand painting.',
        price: 2200,
        sale_price: 1999,
        cost_price: 800,
        stock: 5,
        min_stock_alert: 2,
        dimensions: '18 x 24 inches',
        weight: '1.2 kg',
        material: 'Acrylic on Stretched Canvas',
        color: 'Turquoise & Pink',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Ships within 2 business days',
        is_featured: 0,
        is_new: 1,
        is_bestseller: 0,
        is_limited_edition: 0,
        is_active: 1,
        seo_title: 'Lotus Bloom Canvas Art | Gayatris Creations',
        seo_description: 'Serene botanical lotus canvas wall painting handcrafted in Pune.',
        images: [
          'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        id: 'prod-canvas-3',
        name: 'Abstract Abstract Royal Peacock Canvas',
        slug: 'abstract-royal-peacock-canvas',
        sku: 'CNV-PEA-03',
        category_id: 'cat-canvas',
        description: 'Modern abstract interpretation of peacock feathers with metallic blue and copper textures.',
        short_description: '30x30 inch square modern peacock canvas.',
        price: 4500,
        sale_price: null,
        cost_price: 1500,
        stock: 0,
        min_stock_alert: 1,
        dimensions: '30 x 30 inches',
        weight: '2.2 kg',
        material: 'Acrylic & Copper Powder on Canvas',
        color: 'Royal Blue & Copper',
        is_handmade: 1,
        is_made_to_order: 1,
        production_time_days: 7,
        shipping_info: 'Made to order — ships in 7-10 days',
        is_featured: 1,
        is_new: 0,
        is_bestseller: 1,
        is_limited_edition: 0,
        is_active: 1,
        seo_title: 'Royal Peacock Abstract Canvas Painting',
        seo_description: 'Custom hand painted abstract peacock canvas painting.',
        images: [
          'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800'
        ]
      },

      // 3 MDF Art Products
      {
        id: 'prod-mdf-1',
        name: 'Mandala Hand-Painted Coaster Set (Set of 6)',
        slug: 'mandala-hand-painted-coaster-set-6',
        sku: 'MDF-CST-01',
        category_id: 'cat-mdf',
        description: 'Wooden MDF coasters meticulously decorated with intricate dot mandala art and waterproof sealant.',
        short_description: 'Set of 6 heat-resistant mandala MDF coasters with stand.',
        price: 850,
        sale_price: 699,
        cost_price: 250,
        stock: 12,
        min_stock_alert: 3,
        dimensions: '4 x 4 inches each',
        weight: '450 g',
        material: 'Engineered MDF Wood & Acrylic Resin Coating',
        color: 'Multicolor Mandala',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Ships within 24 hours',
        is_featured: 1,
        is_new: 0,
        is_bestseller: 1,
        is_limited_edition: 0,
        is_active: 1,
        seo_title: 'Dot Mandala Coaster Set of 6 | MDF Handmade',
        seo_description: 'Hand-painted mandala coasters for coffee table decor.',
        images: [
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        id: 'prod-mdf-2',
        name: 'Floral Welcome Key Holder for Wall',
        slug: 'floral-welcome-key-holder-wall',
        sku: 'MDF-KEY-02',
        category_id: 'cat-mdf',
        description: 'Vibrant entryway key holder crafted from durable MDF with 5 sturdy metallic hooks.',
        short_description: '5-hook decorative MDF wall key holder.',
        price: 650,
        sale_price: null,
        cost_price: 200,
        stock: 8,
        min_stock_alert: 2,
        dimensions: '12 x 6 inches',
        weight: '380 g',
        material: 'High density MDF & Brass Hooks',
        color: 'Yellow & Teal Floral',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Ships in 1-2 days',
        is_featured: 0,
        is_new: 1,
        is_bestseller: 0,
        is_limited_edition: 0,
        is_active: 1,
        seo_title: 'Decorative Wooden Key Holder | Gayatris Creations',
        seo_description: 'Hand painted welcome home key hanger for entryway.',
        images: [
          'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        id: 'prod-mdf-3',
        name: 'Hand-Painted Tea Light Candle Tray',
        slug: 'hand-painted-tea-light-candle-tray',
        sku: 'MDF-TRY-03',
        category_id: 'cat-mdf',
        description: 'Elegant festive tray designed to hold 4 tea light candles or festive sweets.',
        short_description: 'Traditional Mughal motif painted MDF tray.',
        price: 990,
        sale_price: 899,
        cost_price: 320,
        stock: 1,
        min_stock_alert: 2,
        dimensions: '10 x 10 inches',
        weight: '600 g',
        material: 'MDF & Protective Lacquer',
        color: 'Deep Red & Gold',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Ships immediately',
        is_featured: 0,
        is_new: 0,
        is_bestseller: 0,
        is_limited_edition: 1,
        is_active: 1,
        seo_title: 'Festive MDF Candle Tray | Handmade',
        seo_description: 'Mughal design decorative tray for festive lighting.',
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
        ]
      },

      // 3 Lippan Art products
      {
        id: 'prod-lippan-1',
        name: 'Traditional Kutch Lippan Mirror Art Panel',
        slug: 'traditional-kutch-lippan-mirror-art-panel',
        sku: 'LIP-KUT-01',
        category_id: 'cat-lippan',
        description: 'Authentic Gujarati Lippan Kaam mud and glass mirror work on wooden backing.',
        short_description: '16x16 inch round Lippan Kaam wall medallion.',
        price: 2800,
        sale_price: 2499,
        cost_price: 900,
        stock: 4,
        min_stock_alert: 2,
        dimensions: '16 x 16 inches (Round)',
        weight: '2.5 kg',
        material: 'Clay Mud Dough, Craft Mirrors & Board Base',
        color: 'Terracotta White & Mirror Glass',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Extra padded shatterproof shipping',
        is_featured: 1,
        is_new: 1,
        is_bestseller: 1,
        is_limited_edition: 0,
        is_active: 1,
        seo_title: 'Kutch Lippan Mirror Art Panel | Wall Decor',
        seo_description: 'Traditional Gujarati Lippan mirror work wall art piece.',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        id: 'prod-lippan-2',
        name: 'Boho Sunburst Lippan Wall Hanging',
        slug: 'boho-sunburst-lippan-wall-hanging',
        sku: 'LIP-SUN-02',
        category_id: 'cat-lippan',
        description: 'Modernized Lippan design with pastel terracotta hues and shimmering micro mirrors.',
        short_description: '12-inch circular mud & mirror sunburst artwork.',
        price: 1800,
        sale_price: 1599,
        cost_price: 600,
        stock: 6,
        min_stock_alert: 2,
        dimensions: '12 x 12 inches',
        weight: '1.4 kg',
        material: 'Sculpting Clay & Glass Mirrors',
        color: 'Pastel Beige & Rose Gold',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Ships within 48 hours',
        is_featured: 0,
        is_new: 0,
        is_bestseller: 0,
        is_limited_edition: 0,
        is_active: 1,
        seo_title: 'Boho Lippan Wall Art | Handmade India',
        seo_description: 'Sunburst clay and mirror mud artwork for living room.',
        images: [
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        id: 'prod-lippan-3',
        name: 'Custom Royal Peacock Lippan Jharokha',
        slug: 'custom-royal-peacock-lippan-jharokha',
        sku: 'LIP-JHA-03',
        category_id: 'cat-lippan',
        description: 'Magnificent Rajasthani Jharokha frame decorated with Lippan clay motifs and mirrors.',
        short_description: 'Large 24x18 inch Lippan jharokha frame.',
        price: 5200,
        sale_price: null,
        cost_price: 1800,
        stock: 0,
        min_stock_alert: 1,
        dimensions: '24 x 18 inches',
        weight: '3.5 kg',
        material: 'Wood, Mud Paste & Premium Cut Mirrors',
        color: 'Royal White & Emerald accents',
        is_handmade: 1,
        is_made_to_order: 1,
        production_time_days: 10,
        shipping_info: 'Made to order — ships in 10 days',
        is_featured: 1,
        is_new: 0,
        is_bestseller: 1,
        is_limited_edition: 1,
        is_active: 1,
        seo_title: 'Custom Lippan Jharokha Frame | Made to Order',
        seo_description: 'Handcrafted Lippan mud and mirror jharokha wall hanging.',
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
        ]
      },

      // 3 Scented Wax Candles
      {
        id: 'prod-candle-1',
        name: 'Royal Jasmine & Mogra Soy Wax Jar Candle',
        slug: 'royal-jasmine-mogra-soy-wax-jar-candle',
        sku: 'CND-JAS-01',
        category_id: 'cat-candles',
        description: 'Hand-poured 100% natural soy wax infused with authentic Madurai Jasmine & Mogra essential oils.',
        short_description: '250g aromatherapy soy wax candle in frosted glass jar.',
        price: 799,
        sale_price: 649,
        cost_price: 200,
        stock: 20,
        min_stock_alert: 5,
        dimensions: '3.5 x 3.5 inches',
        weight: '250 g wax (500g total)',
        material: 'Soy Wax & Organic Essential Oils',
        color: 'Off-white Wax in Amber Glass',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Ships within 24 hours',
        is_featured: 1,
        is_new: 1,
        is_bestseller: 1,
        is_limited_edition: 0,
        is_active: 1,
        seo_title: 'Royal Jasmine Soy Wax Candle | Aromatherapy',
        seo_description: 'Hand poured Indian jasmine aromatherapy soy candle.',
        images: [
          'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        id: 'prod-candle-2',
        name: 'Sandalwood & Cardamom Botanical Pillar Candle',
        slug: 'sandalwood-cardamom-botanical-pillar-candle',
        sku: 'CND-SAN-02',
        category_id: 'cat-candles',
        description: 'Embedded with dried rose petals and spice botanicals. Emits a warm Mysore Sandalwood aroma.',
        short_description: 'Botanical textured pillar candle with real dried petals.',
        price: 950,
        sale_price: null,
        cost_price: 300,
        stock: 10,
        min_stock_alert: 2,
        dimensions: '3 x 5 inches',
        weight: '380 g',
        material: 'Beeswax Blend & Dried Botanical Flowers',
        color: 'Earthy Sandalwood',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Ships in 1-2 days',
        is_featured: 0,
        is_new: 1,
        is_bestseller: 0,
        is_limited_edition: 0,
        is_active: 1,
        seo_title: 'Sandalwood Botanical Pillar Candle',
        seo_description: 'Real dried rose embedded Mysore sandalwood candle.',
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        id: 'prod-candle-3',
        name: 'Spiced Cinnamon & Vanilla Dessert Bowl Candle',
        slug: 'spiced-cinnamon-vanilla-dessert-bowl-candle',
        sku: 'CND-CIN-03',
        category_id: 'cat-candles',
        description: 'Cute handcrafted bowl candle topped with whipped wax embeds and real cinnamon sticks.',
        short_description: '300g dessert bowl candle with cinnamon spice aroma.',
        price: 1100,
        sale_price: 899,
        cost_price: 350,
        stock: 2,
        min_stock_alert: 3,
        dimensions: '4 x 3 inches',
        weight: '300 g wax',
        material: 'Soy Wax & Wooden Wick',
        color: 'Cream & Brown',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Ships in 1 day',
        is_featured: 0,
        is_new: 0,
        is_bestseller: 1,
        is_limited_edition: 1,
        is_active: 1,
        seo_title: 'Spiced Cinnamon Soy Dessert Candle',
        seo_description: 'Wooden wick dessert candle with cinnamon sticks.',
        images: [
          'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'
        ]
      },

      // 3 Resin Art Products
      {
        id: 'prod-resin-1',
        name: 'Ocean Wave Resin & Teak Wood Serving Platter',
        slug: 'ocean-wave-resin-teak-wood-serving-platter',
        sku: 'RSN-PLT-01',
        category_id: 'cat-resin',
        description: 'Crafted from authentic reclaimed teak wood and food-safe Epoxy resin poured in 3 layered ocean waves.',
        short_description: '14x8 inch teak wood platter with real ocean wave resin artwork.',
        price: 2400,
        sale_price: 1999,
        cost_price: 800,
        stock: 7,
        min_stock_alert: 2,
        dimensions: '14 x 8 inches',
        weight: '1.1 kg',
        material: 'Natural Teak Wood & Food-Safe Epoxy Resin',
        color: 'Turquoise & Deep Ocean Blue',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Ships within 24 hours',
        is_featured: 1,
        is_new: 1,
        is_bestseller: 1,
        is_limited_edition: 0,
        is_active: 1,
        seo_title: 'Ocean Wave Resin & Teak Platter | Gayatris Creations',
        seo_description: 'Handmade resin ocean wave wood cheese board platter.',
        images: [
          'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        id: 'prod-resin-2',
        name: 'Preserved Marigold & Gold Foil Resin Coaster Set',
        slug: 'preserved-marigold-gold-foil-resin-coaster-set',
        sku: 'RSN-CST-02',
        category_id: 'cat-resin',
        description: 'Set of 4 hexagonal clear resin coasters embedding dried Indian Genda (Marigold) petals and floating gold flakes.',
        short_description: 'Set of 4 botanical floral resin hexagonal coasters.',
        price: 1200,
        sale_price: 999,
        cost_price: 350,
        stock: 15,
        min_stock_alert: 4,
        dimensions: '4.5 x 4.5 inches each',
        weight: '350 g',
        material: 'Crystal Clear Epoxy Resin & Real Dried Petals',
        color: 'Clear, Gold & Orange',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Ships in 1-2 days',
        is_featured: 0,
        is_new: 1,
        is_bestseller: 0,
        is_limited_edition: 0,
        is_active: 1,
        seo_title: 'Preserved Floral Resin Coasters | Set of 4',
        seo_description: 'Real dried marigold and gold leaf clear resin coasters.',
        images: [
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800'
        ]
      },
      {
        id: 'prod-resin-3',
        name: 'Geode Agate Resin Wall Clock with Roman Numerals',
        slug: 'geode-agate-resin-wall-clock-roman-numerals',
        sku: 'RSN-CLK-03',
        category_id: 'cat-resin',
        description: 'Luxurious 12-inch resin geode clock with real crushed glass crystals, metallic gold lines and silent sweep movement.',
        short_description: '12-inch resin geode silent wall clock.',
        price: 3200,
        sale_price: 2899,
        cost_price: 1100,
        stock: 3,
        min_stock_alert: 1,
        dimensions: '12 x 12 inches',
        weight: '1.6 kg',
        material: 'Resin, Crushed Glass & Silent Clock Mechanism',
        color: 'Emerald, White & Gold',
        is_handmade: 1,
        is_made_to_order: 0,
        production_time_days: 0,
        shipping_info: 'Battery included. Ships in 2 days.',
        is_featured: 1,
        is_new: 0,
        is_bestseller: 1,
        is_limited_edition: 1,
        is_active: 1,
        seo_title: 'Resin Geode Wall Clock | Handmade Decor',
        seo_description: 'Handcrafted luxury geode agate resin wall clock.',
        images: [
          'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=800'
        ]
      }
    ];

    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, slug, sku, category_id, description, short_description, price, sale_price, cost_price,
        stock, min_stock_alert, dimensions, weight, material, color, is_handmade, is_made_to_order,
        production_time_days, shipping_info, is_featured, is_new, is_bestseller, is_limited_edition, is_active,
        seo_title, seo_description
      ) VALUES (
        @id, @name, @slug, @sku, @category_id, @description, @short_description, @price, @sale_price, @cost_price,
        @stock, @min_stock_alert, @dimensions, @weight, @material, @color, @is_handmade, @is_made_to_order,
        @production_time_days, @shipping_info, @is_featured, @is_new, @is_bestseller, @is_limited_edition, @is_active,
        @seo_title, @seo_description
      )
    `);

    const insertImage = db.prepare(`
      INSERT INTO product_images (id, product_id, image_url, display_order)
      VALUES (?, ?, ?, ?)
    `);

    for (const prod of productsData) {
      const { images, ...pData } = prod;
      insertProduct.run(pData);
      images.forEach((imgUrl, idx) => {
        insertImage.run(`${prod.id}-img-${idx + 1}`, prod.id, imgUrl, idx);
      });
    }
  }

  // Seed sample coupon codes if empty
  const couponCount = (db.prepare('SELECT COUNT(*) as count FROM coupons').get() as { count: number }).count;
  if (couponCount === 0) {
    const coupons = [
      {
        id: 'coup-welcome10',
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        min_order_value: 500,
        max_discount: 500,
        usage_limit: 100,
        per_customer_limit: 1,
        is_active: 1
      },
      {
        id: 'coup-flat200',
        code: 'ARTIST200',
        type: 'fixed',
        value: 200,
        min_order_value: 1500,
        max_discount: 200,
        usage_limit: 50,
        per_customer_limit: 1,
        is_active: 1
      }
    ];

    const insertCoupon = db.prepare(`
      INSERT INTO coupons (id, code, type, value, min_order_value, max_discount, usage_limit, per_customer_limit, is_active)
      VALUES (@id, @code, @type, @value, @min_order_value, @max_discount, @usage_limit, @per_customer_limit, @is_active)
    `);

    for (const coup of coupons) {
      insertCoupon.run(coup);
    }
  }
}

// Auto-execute if executed directly via CLI
if (typeof require !== 'undefined' && require.main === module) {
  seedDatabase();
} else {
  seedDatabase();
}
