export interface GalleryItem {
  id: string;
  title: string;
  category: "Temple" | "Monastery" | "Sacred Landscape" | "River" | "Festival" | "Culture";
  village: string;
  district: string;
  image: string;      
  thumbnail?: string;
  description: string;
  year: number;
  featured?: boolean;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "masroor",
    title: "Masroor Rock Cut Temple",
    category: "Temple",
    village: "Masroor",
    district: "Kangra",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Masrur_rockcut_temple.jpg",
    description: "Monolithic rock-cut temple complex from the 8th century.",
    year: 2023,
    featured: true
  },
  {
    id: "dzongsar",
    title: "Dzongsar Monastery",
    category: "Monastery",
    village: "Bir",
    district: "Kangra",
    image: "https://images.unsplash.com/photo-1570146059632-4161bb7d577a?w=1200&q=80",
    description: "A prominent Tibetan Buddhist monastery known for traditional learning.",
    year: 2024,
    featured: true
  },
  {
    id: "kareri",
    title: "Kareri Lake",
    category: "Sacred Landscape",
    village: "Kareri",
    district: "Kangra",
    image: "https://images.unsplash.com/photo-1548050965-0639d675b871?w=1200&q=80",
    description: "High altitude fresh water lake surrounded by the Dhauladhar range.",
    year: 2023,
    featured: true
  },
  {
    id: "beas",
    title: "Beas River Convergence",
    category: "River",
    village: "Nadaun",
    district: "Kangra",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80",
    description: "The sacred waters of the Beas flowing through the valley.",
    year: 2025
  },
  {
    id: "shivratri",
    title: "Maha Shivratri Festival",
    category: "Festival",
    village: "Baijnath",
    district: "Kangra",
    image: "https://images.unsplash.com/photo-1601058269784-9a4f478e5ab1?w=1200&q=80",
    description: "Devotees gathering at the ancient Baijnath temple.",
    year: 2024,
    featured: true
  },
  {
    id: "gaddi",
    title: "Gaddi Herders",
    category: "Culture",
    village: "Dharamshala",
    district: "Kangra",
    image: "https://images.unsplash.com/photo-1533038590840-1c73797ac097?w=1200&q=80",
    description: "Traditional pastoralists migrating with their flocks.",
    year: 2024
  },
  {
    id: "jwala",
    title: "Jawalamukhi Eternal Flame",
    category: "Temple",
    village: "Jawalamukhi",
    district: "Kangra",
    image: "https://images.unsplash.com/photo-1610014299971-55ab2b4ffbd5?w=1200&q=80",
    description: "The ancient temple of the eternal flame.",
    year: 2023,
    featured: true
  },
  {
    id: "tibet_culture",
    title: "Tibetan Artisan",
    category: "Culture",
    village: "McLeod Ganj",
    district: "Kangra",
    image: "https://images.unsplash.com/photo-1582200179927-4185695a7092?w=1200&q=80",
    description: "Creating traditional Thangka paintings.",
    year: 2025
  },
  {
    id: "dhauladhar",
    title: "Dhauladhar Range",
    category: "Sacred Landscape",
    village: "Palampur",
    district: "Kangra",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    description: "Snow-capped peaks overseeing the tea gardens.",
    year: 2024,
    featured: true
  }
];
