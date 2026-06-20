export const RECIPE_CATEGORIES = [
  "Món xào",
  "Món canh",
  "Món chiên",
  "Món hấp",
  "Món chay",
  "Tráng miệng",
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];
export type RecipeDifficulty = "de" | "trung-binh" | "kho";

export interface Recipe {
  category: RecipeCategory;
  cookTimeMinutes: number;
  difficulty: RecipeDifficulty;
  imageAlt: string;
  imageSrc: string;
  servings: number;
  slug: string;
  title: string;
}

// TODO: thay bằng API thật.
export const MOCK_RECIPES: Recipe[] = [
  {
    slug: "thit-bo-xao-bong-cai",
    title: "Thịt Bò Xào Bông Cải",
    imageSrc: "/images/recipes/thit-bo-xao-bong-cai.png",
    imageAlt: "Thịt bò xào với bông cải xanh",
    difficulty: "de",
    cookTimeMinutes: 20,
    servings: 2,
    category: "Món xào",
  },
  {
    slug: "rau-muong-xao-toi",
    title: "Rau Muống Xào Tỏi",
    imageSrc: "/images/recipes/rau-muong-xao-toi.png",
    imageAlt: "Rau muống xanh xào tỏi",
    difficulty: "de",
    cookTimeMinutes: 10,
    servings: 4,
    category: "Món xào",
  },
  {
    slug: "suon-xao-chua-ngot",
    title: "Sườn Xào Chua Ngọt",
    imageSrc: "/images/recipes/suon-xao-chua-ngot.png",
    imageAlt: "Sườn xào chua ngọt phủ mè",
    difficulty: "trung-binh",
    cookTimeMinutes: 35,
    servings: 4,
    category: "Món xào",
  },
  {
    slug: "canh-chua-ca-loc",
    title: "Canh Chua Cá Lóc",
    imageSrc: "/images/recipes/pho-bo.png",
    imageAlt: "Bát canh nóng với cá và rau thơm",
    difficulty: "trung-binh",
    cookTimeMinutes: 30,
    servings: 4,
    category: "Món canh",
  },
  {
    slug: "chao-ga-xe-phay",
    title: "Cháo Gà Xé Phay",
    imageSrc: "/images/recipes/chao-ga.png",
    imageAlt: "Bát cháo gà xé phay",
    difficulty: "de",
    cookTimeMinutes: 25,
    servings: 3,
    category: "Món canh",
  },
  {
    slug: "cha-gio-hai-san",
    title: "Chả Giò Hải Sản",
    imageSrc: "/images/recipes/goi-cuon-tom-thit.png",
    imageAlt: "Món cuốn hải sản ăn kèm rau xanh",
    difficulty: "trung-binh",
    cookTimeMinutes: 45,
    servings: 3,
    category: "Món chiên",
  },
  {
    slug: "banh-xeo-mien-tay",
    title: "Bánh Xèo Miền Tây",
    imageSrc: "/images/recipes/banh-xeo-mien-tay.png",
    imageAlt: "Bánh xèo vàng giòn với rau thơm",
    difficulty: "trung-binh",
    cookTimeMinutes: 35,
    servings: 3,
    category: "Món chiên",
  },
  {
    slug: "ca-hap-gung",
    title: "Cá Hấp Gừng",
    imageSrc: "/images/recipes/bo-bop-thau.png",
    imageAlt: "Món cá hấp với rau củ và gừng",
    difficulty: "de",
    cookTimeMinutes: 40,
    servings: 4,
    category: "Món hấp",
  },
  {
    slug: "nam-xao-dau-hu-chay",
    title: "Nấm Xào Đậu Hũ Chay",
    imageSrc: "/images/recipes/nam-xao-dau-hu.png",
    imageAlt: "Nấm xào đậu hũ với ớt chuông",
    difficulty: "de",
    cookTimeMinutes: 15,
    servings: 2,
    category: "Món chay",
  },
  {
    slug: "pho-bo-gia-truyen",
    title: "Phở Bò Gia Truyền",
    imageSrc: "/images/recipes/pho-bo.png",
    imageAlt: "Bát phở bò nóng với rau thơm",
    difficulty: "kho",
    cookTimeMinutes: 120,
    servings: 6,
    category: "Món canh",
  },
];

export const DIFFICULTY_ORDER: Record<RecipeDifficulty, number> = {
  de: 0,
  "trung-binh": 1,
  kho: 2,
};
