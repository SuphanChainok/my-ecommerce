// seed.mjs - Run with: node seed.mjs
const products = [
  {
    name: "Sony WH-1000XM5 Headphones",
    price: 12990,
    description: "Premium Noise Cancelling headphones, 30-hour battery life",
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600",
    stock: 25,
  },
  {
    name: "Apple AirPods Pro Gen 2",
    price: 9490,
    description: "True Wireless with Active Noise Cancellation and Transparency Mode",
    imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600",
    stock: 40,
  },
  {
    name: "Keychron K2 Mechanical Keyboard",
    price: 3590,
    description: "75% layout Wireless Bluetooth keyboard, Mac/Windows compatible",
    imageUrl: "https://images.unsplash.com/photo-1561112078-7d24e04c3407?w=600",
    stock: 15,
  },
  {
    name: "Logitech MX Master 3S Mouse",
    price: 4290,
    description: "High-performance Wireless mouse, 8000 DPI sensor, ultra-quiet clicks",
    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
    stock: 30,
  },
  {
    name: "iPad Air M2 11-inch",
    price: 22900,
    description: "Powered by M2 chip, 11-inch Liquid Retina display, Apple Pencil Pro support",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600",
    stock: 10,
  },
  {
    name: "Samsung 27-inch 4K Monitor",
    price: 14500,
    description: "4K UHD 27-inch IPS Panel for creative work and gaming",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
    stock: 8,
  },
];

const BASE_URL = "http://localhost:3000/api/products";

async function seed() {
  console.log("🌱 Starting product seed...\n");
  let success = 0;

  for (const product of products) {
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`❌ Failed: ${product.name} → ${err}`);
      } else {
        const data = await res.json();
        console.log(`✅ Added: ${product.name} (ID: ${data._id})`);
        success++;
      }
    } catch (err) {
      console.error(`❌ Error: ${product.name} → ${err.message}`);
    }
  }

  console.log(`\n✨ Done! Inserted ${success}/${products.length} products.`);
}

seed();
