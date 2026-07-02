'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
    const hashedUserPassword  = await bcrypt.hash('123456', 10);
    const now = new Date();

    // ─── 1. USERS ───────────────────────────────────────────────────────
    const users = [
      {
        full_name: 'Admin CAS',
        email: 'admin@cas.vn',
        phone: '0900000000',
        password: hashedAdminPassword,
        role: 'admin',
        createdAt: now,
        updatedAt: now
      }
    ];
    const customerNames = [
      'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Minh Châu', 'Phạm Thị Dung',
      'Hoàng Văn Em', 'Đỗ Thị Phương', 'Vũ Minh Quân', 'Bùi Thị Hoa',
      'Đặng Văn Khôi', 'Ngô Thị Lan'
    ];
    for (let i = 0; i < 10; i++) {
      users.push({
        full_name: customerNames[i],
        email: `customer${i + 1}@cas.vn`,
        phone: `090${String(12345678 + i).padStart(8, '0')}`,
        password: hashedUserPassword,
        role: 'customer',
        createdAt: now,
        updatedAt: now
      });
    }
    await queryInterface.bulkInsert('Users', users, {});

    // ─── 2. CATEGORIES ───────────────────────────────────────────────────
    const categories = [
      { name: 'Gaming Laptop',        slug: 'gaming',      description: 'Laptop gaming hiệu năng cao',          createdAt: now, updatedAt: now },
      { name: 'Laptop Văn Phòng',     slug: 'office',      description: 'Laptop ổn định cho công việc',         createdAt: now, updatedAt: now },
      { name: 'Laptop Sinh Viên',     slug: 'student',     description: 'Laptop giá tốt dành cho sinh viên',    createdAt: now, updatedAt: now },
      { name: 'Đồ Họa & Sáng Tạo',   slug: 'creative',    description: 'Laptop màn hình đẹp cho thiết kế',     createdAt: now, updatedAt: now },
      { name: 'MacBook',              slug: 'macbook',     description: 'Apple MacBook các dòng',               createdAt: now, updatedAt: now },
      { name: 'Ultrabook',            slug: 'ultrabook',   description: 'Laptop mỏng nhẹ cao cấp',             createdAt: now, updatedAt: now },
      { name: 'Workstation',          slug: 'workstation', description: 'Máy trạm di động hạng nặng',           createdAt: now, updatedAt: now },
      { name: 'Laptop Doanh Nhân',    slug: 'business',    description: 'Laptop bảo mật cao cho doanh nhân',    createdAt: now, updatedAt: now },
      { name: '2-in-1 Laptop',        slug: '2-in-1',      description: 'Laptop màn hình cảm ứng gập 360°',    createdAt: now, updatedAt: now },
      { name: 'Laptop Cũ Giá Rẻ',    slug: 'refurbished', description: 'Laptop tân trang chất lượng',          createdAt: now, updatedAt: now }
    ];
    await queryInterface.bulkInsert('Categories', categories, {});

    // ─── 3. PRODUCTS (50 items) ──────────────────────────────────────────
    const brands = ['ASUS', 'Dell', 'HP', 'Lenovo', 'Apple', 'MSI', 'Acer', 'Samsung', 'LG', 'Razer'];
    const cpuPool = [
      'Intel Core i5-13500H', 'Intel Core i7-13700H', 'Intel Core i9-13900H',
      'AMD Ryzen 5 7535HS', 'AMD Ryzen 7 7745HX', 'AMD Ryzen 9 7945HX',
      'Apple M2', 'Apple M2 Pro', 'Intel Core Ultra 7 155H', 'Intel Core i5-1335U'
    ];
    const ramPool   = ['8GB DDR5', '16GB DDR5', '32GB DDR5', '16GB DDR4', '32GB DDR4', '64GB DDR5'];
    const storPool  = ['256GB NVMe SSD', '512GB NVMe SSD', '1TB NVMe SSD', '2TB NVMe SSD'];
    const gpuPool   = ['NVIDIA RTX 4060', 'NVIDIA RTX 4070', 'NVIDIA RTX 3060', 'NVIDIA RTX 4090', 'AMD Radeon RX 6700M', 'Apple M2 GPU 10-core', 'Intel Iris Xe', 'NVIDIA GeForce MX550'];
    const dispPool  = ['14" FHD 144Hz IPS', '15.6" FHD 144Hz', '16" QHD 165Hz', '14" 2.8K OLED 120Hz', '13.6" Liquid Retina', '17.3" FHD 240Hz'];
    const thumbPool = [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=80',
    ];

    const pick = (arr, i) => arr[i % arr.length];

    const products = [];
    for (let i = 1; i <= 50; i++) {
      const brand    = pick(brands, i - 1);
      const catId    = (i % 10) + 1;
      const basePrice = 10_000_000 + (Math.floor(i * 1.7) % 30) * 1_000_000;
      const hasDiscount = i % 3 !== 0; // 2/3 of products have a discount
      const isFeatured  = i <= 8;      // first 8 products are featured

      products.push({
        name:           `${brand} Laptop ${['Pro', 'Air', 'Plus', 'Max', 'Elite', 'Ultra'][i % 6]} ${i}`,
        slug:           `${brand.toLowerCase().replace(/\s+/g, '-')}-laptop-${['pro', 'air', 'plus', 'max', 'elite', 'ultra'][i % 6]}-${i}`,
        description:    `Laptop ${brand} phiên bản ${i} với hiệu năng vượt trội, thiết kế mỏng nhẹ, phù hợp cho mọi nhu cầu công việc và giải trí.`,
        brand,
        cpu:            pick(cpuPool, i),
        ram:            pick(ramPool, i),
        storage:        pick(storPool, i),
        gpu:            pick(gpuPool, i),
        display:        pick(dispPool, i),
        battery:        `${50 + (i % 5) * 10}Wh`,
        weight:         `${(1.2 + (i % 10) * 0.1).toFixed(1)} kg`,
        price:          basePrice,
        discount_price: hasDiscount ? basePrice - 1_000_000 - (i % 5) * 500_000 : null,
        stock_quantity: 10 + (i % 40),
        thumbnail:      pick(thumbPool, i),
        is_featured:    isFeatured,
        category_id:    catId,
        createdAt:      now,
        updatedAt:      now
      });
    }
    await queryInterface.bulkInsert('Products', products, {});

    // ─── 4. VOUCHERS ─────────────────────────────────────────────────────
    const futureDate = new Date('2027-12-31');
    const startDate  = new Date('2026-01-01');
    const vouchers = [
      {
        code: 'WELCOME10', discount_type: 'percent', discount_value: 10,
        minimum_order_amount: 5_000_000, usage_limit: 100, used_count: 0,
        start_date: startDate, end_date: futureDate, status: 'active',
        createdAt: now, updatedAt: now
      },
      {
        code: 'CAS500K', discount_type: 'fixed', discount_value: 500_000,
        minimum_order_amount: 10_000_000, usage_limit: 50, used_count: 0,
        start_date: startDate, end_date: futureDate, status: 'active',
        createdAt: now, updatedAt: now
      },
      {
        code: 'SUMMER15', discount_type: 'percent', discount_value: 15,
        minimum_order_amount: 15_000_000, usage_limit: 30, used_count: 0,
        start_date: startDate, end_date: futureDate, status: 'active',
        createdAt: now, updatedAt: now
      },
      {
        code: 'FLASH2M', discount_type: 'fixed', discount_value: 2_000_000,
        minimum_order_amount: 20_000_000, usage_limit: 10, used_count: 0,
        start_date: startDate, end_date: futureDate, status: 'active',
        createdAt: now, updatedAt: now
      }
    ];
    await queryInterface.bulkInsert('Vouchers', vouchers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Vouchers', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
