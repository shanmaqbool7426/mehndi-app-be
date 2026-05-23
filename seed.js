const mongoose = require("mongoose");
const Design = require("./models/Design");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://auto-wheel-apps:AutoWheels123@auto-wheels.m4wrf.mongodb.net/mehndi-app";


const SEED_DESIGNS = [
  {
    title: "Royal Bridal Full Hand",
    category: "bridal",
    complexity: "heavy",
    occasion: "Wedding",
    style: "Pakistani",
    image: "https://images.unsplash.com/photo-1605634289874-9f44f6f7bc22?q=80&w=600&auto=format&fit=crop",
    isPremium: true,
    likes: 4892,
    views: 28340,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    tags: ["bridal", "full-hand", "pakistani", "luxury"],
    description: "A breathtaking full hand bridal design featuring intricate paisley and floral motifs, perfect for your special wedding day.",
  },
  {
    title: "Eid Festive Collection",
    category: "eid",
    complexity: "medium",
    occasion: "Eid",
    style: "Arabic",
    image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=600&auto=format&fit=crop",
    isPremium: false,
    likes: 3241,
    views: 19820,
    isFeatured: true,
    isTrending: true,
    isNew: true,
    tags: ["eid", "arabic", "festive", "floral"],
    description: "Celebrate Eid in style with this stunning Arabic-inspired mehndi pattern featuring flowing florals and geometric accents.",
  },
  {
    title: "Delicate Finger Art",
    category: "finger",
    complexity: "simple",
    occasion: "Party",
    style: "Modern",
    image: "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?q=80&w=600&auto=format&fit=crop",
    isPremium: false,
    likes: 2187,
    views: 14230,
    isFeatured: false,
    isTrending: true,
    isNew: false,
    tags: ["finger", "modern", "minimal", "delicate"],
    description: "Elegant finger mehndi with fine line art and delicate swirls — perfect for any simple party occasion.",
  },
  {
    title: "Western Fusion Minimalist",
    category: "modern",
    complexity: "simple",
    occasion: "Party",
    style: "Western Fusion",
    image: "https://images.unsplash.com/photo-1605634289808-1cc63e790ec3?q=80&w=600&auto=format&fit=crop",
    isPremium: false,
    likes: 1876,
    views: 11540,
    isFeatured: false,
    isTrending: false,
    isNew: true,
    tags: ["modern", "minimal", "western", "trendy"],
    description: "A fresh take on mehndi art with clean lines and contemporary motifs for the modern woman.",
  },
  {
    title: "Mughlai Royal Bridal Mandalas",
    category: "bridal",
    complexity: "heavy",
    occasion: "Wedding",
    style: "Indian",
    image: "https://images.unsplash.com/photo-1590156221122-c413d9489517?q=80&w=600&auto=format&fit=crop",
    isPremium: true,
    likes: 5621,
    views: 31920,
    isFeatured: true,
    isTrending: true,
    isNew: true,
    tags: ["mughlai", "bridal", "mandala", "royal"],
    description: "An ultra-premium Mughlai bridal mandala design featuring symmetric circular motifs and absolute perfection in details.",
  },
  {
    title: "Moroccan Geometric Pattern",
    category: "moroccan",
    complexity: "medium",
    occasion: "Chand Raat",
    style: "Moroccan",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=600&auto=format&fit=crop",
    isPremium: false,
    likes: 1420,
    views: 8900,
    isFeatured: false,
    isTrending: false,
    isNew: false,
    tags: ["moroccan", "geometric", "minimal"],
    description: "Geometric lines and tribal influences meet in this unique, contemporary Moroccan henna design.",
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected! Cleaning existing designs collection...");
    await Design.deleteMany();
    console.log("Cleared collections. Inserting seed designs...");
    await Design.insertMany(SEED_DESIGNS);
    console.log("SUCCESS: Database fully seeded with modern dynamic designs!");
    process.exit(0);
  } catch (error) {
    console.error("FAILED to seed database:", error);
    process.exit(1);
  }
};

seedDatabase();
