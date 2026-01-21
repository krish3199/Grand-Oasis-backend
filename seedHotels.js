const mongoose = require("mongoose");
const Hotel = require("./models/Hotel");
const dotenv = require("dotenv");

dotenv.config();

// 🔹 MongoDB connect
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/hotelbooking")
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.log(err));

// 🔹 Premium Hotels with Real Images & Different Names
const hotelNames = [
  "Grand Royal Palace", "Oceanview Luxury Resort", "Mountain Peak Hotel", "Sunset Beach Resort",
  "Crystal Grand Hotel", "Emerald City Suites", "Golden Gate Inn", "Starlight Boutique Hotel",
  "Diamond Plaza Resort", "Azure Sky Hotel", "Royal Heritage Inn", "Paradise Valley Resort",
  "Majestic Grand Hotel", "Serenity Beach Resort", "Luxury Garden Hotel", "Crown Jewel Resort",
  "Elite Executive Hotel", "Tranquil Waters Resort", "Imperial Grand Hotel", "Blissful Retreat",
  "Regal Towers Hotel", "Coastal Breeze Resort", "Prestige Plaza Hotel", "Harmony Garden Resort",
  "Noble Heritage Hotel", "Riverside Luxury Resort", "Grandeur Palace Hotel", "Zenith Sky Resort",
  "Elegant Manor Hotel", "Tropical Paradise Resort", "Sapphire Grand Hotel", "Mystic Bay Resort",
  "Opulent Towers Hotel", "Seaside Serenity Resort", "Vintage Charm Hotel", "Modern Oasis Resort",
  "Classic Elegance Hotel", "Sunrise Beach Resort", "Lavish Living Hotel", "Cozy Corner Resort",
  "Premium Plaza Hotel", "Nature's Bliss Resort", "Urban Luxury Hotel", "Countryside Retreat",
  "Metropolitan Grand Hotel", "Island Paradise Resort", "Heritage Classic Hotel", "Contemporary Comfort Resort",
  "Boutique Delight Hotel", "Adventure Base Resort", "Business Elite Hotel", "Family Fun Resort"
];

const cities = ["Mumbai", "Delhi", "Bangalore", "Goa", "Jaipur", "Udaipur", "Kerala", "Shimla", "Manali", "Agra"];
const amenitiesList = [
  ["Free WiFi", "Swimming Pool", "Spa & Wellness", "Fitness Center", "Restaurant", "Bar", "Room Service", "Parking"],
  ["Free WiFi", "Swimming Pool", "Beach Access", "Water Sports", "Restaurant", "Bar", "Concierge", "Parking"],
  ["Free WiFi", "Mountain View", "Skiing", "Restaurant", "Bar", "Fireplace", "Parking", "Pet Friendly"],
  ["Free WiFi", "Swimming Pool", "Golf Course", "Spa", "Restaurant", "Bar", "Business Center", "Parking"],
  ["Free WiFi", "Swimming Pool", "Kids Club", "Restaurant", "Bar", "Entertainment", "Parking", "Playground"],
  ["Free WiFi", "Swimming Pool", "Yoga Studio", "Restaurant", "Bar", "Meditation", "Parking", "Garden"],
  ["Free WiFi", "Swimming Pool", "Casino", "Restaurant", "Bar", "Nightclub", "Parking", "Valet"],
  ["Free WiFi", "Swimming Pool", "Tennis Court", "Restaurant", "Bar", "Gym", "Parking", "Squash Court"]
];

const roomTypes = ["Deluxe Room", "Suite", "Executive Suite", "Presidential Suite", "Family Room", "Studio Apartment"];
const roomFacilities = [
  ["AC", "TV", "WiFi", "Mini Bar", "Safe"],
  ["AC", "TV", "WiFi", "Mini Bar", "Safe", "Jacuzzi"],
  ["AC", "TV", "WiFi", "Mini Bar", "Safe", "Balcony", "Sea View"],
  ["AC", "TV", "WiFi", "Mini Bar", "Safe", "Kitchenette", "Living Area"]
];

// Real hotel images from Unsplash
const hotelImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
  "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1520250497591-112f2f6a3a95?w=800",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"
];

const descriptions = [
  "Experience unparalleled luxury with world-class amenities and breathtaking views. Perfect for business and leisure travelers.",
  "A stunning beachfront property offering pristine sands, crystal-clear waters, and exceptional hospitality in a tropical paradise.",
  "Nestled in the mountains, this resort offers serene landscapes, adventure activities, and cozy accommodations for nature lovers.",
  "Modern elegance meets traditional charm in this centrally located hotel, perfect for exploring the city's vibrant culture.",
  "Indulge in opulent comfort with spacious suites, gourmet dining, and personalized service that exceeds expectations.",
  "Family-friendly resort with exciting activities, kids' programs, and comfortable accommodations for memorable vacations.",
  "Boutique hotel featuring unique architecture, curated art collections, and intimate dining experiences in the heart of the city.",
  "Wellness-focused retreat offering spa treatments, yoga sessions, organic cuisine, and peaceful surroundings for rejuvenation."
];

// 🔹 Generate 50 Premium Hotels
const hotels = Array.from({ length: 50 }).map((_, i) => {
  const city = cities[i % cities.length];
  const amenities = amenitiesList[i % amenitiesList.length];
  const roomFacs = roomFacilities[i % roomFacilities.length];
  const imageIndex = i % hotelImages.length;
  
  return {
    name: hotelNames[i],
    city: city,
    description: descriptions[i % descriptions.length],
    image: hotelImages[imageIndex],
    images: [
      hotelImages[imageIndex],
      hotelImages[(imageIndex + 1) % hotelImages.length],
      hotelImages[(imageIndex + 2) % hotelImages.length]
    ],
    amenities: amenities,
    rating: 4 + (i % 2) * 0.5, // 4.0 to 4.5 or 5.0
    rooms: [
      {
        type: roomTypes[0],
        price: 2500 + (i * 100),
        availableRooms: 10 + (i % 5),
        facilities: roomFacs,
        images: [hotelImages[imageIndex]]
      },
      {
        type: roomTypes[1],
        price: 4500 + (i * 150),
        availableRooms: 5 + (i % 3),
        facilities: [...roomFacs, "Jacuzzi", "Balcony"],
        images: [hotelImages[(imageIndex + 1) % hotelImages.length]]
      },
      {
        type: roomTypes[2],
        price: 7500 + (i * 200),
        availableRooms: 3 + (i % 2),
        facilities: [...roomFacs, "Jacuzzi", "Balcony", "Living Area", "Kitchenette"],
        images: [hotelImages[(imageIndex + 2) % hotelImages.length]]
      }
    ]
  };
});

const seedHotels = async () => {
  try {
    await Hotel.deleteMany(); // old hotels clear
    await Hotel.insertMany(hotels);

    console.log("✅ 50 Premium Hotels Successfully Added with Real Images & Facilities!");
    process.exit();
  } catch (error) {
    console.log("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedHotels();
