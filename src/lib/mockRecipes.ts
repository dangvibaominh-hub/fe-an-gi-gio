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
export type TechniqueIcon = "dao" | "chao" | "noi" | "tron" | "hap";

export interface RecipeIngredient {
  baseAmount: number;
  haveIt: boolean;
  id: string;
  name: string;
  prepNote: string;
  unit: string;
}

export interface RecipeStep {
  content: string;
  estimatedMinutes: number;
  id: string;
  isTricky: boolean;
  techniqueIcon: TechniqueIcon;
}

export interface Recipe {
  baseServings: number;
  category: RecipeCategory;
  cookingTerms: Record<string, string>;
  cookTimeMinutes: number;
  difficulty: RecipeDifficulty;
  image: string;
  imageAlt: string;
  ingredients: RecipeIngredient[];
  slug: string;
  steps: RecipeStep[];
  title: string;
}

const COOKING_TERMS: Record<string, string> = {
  "phi thơm":
    "Cho dầu nóng rồi đảo hành hoặc tỏi đến khi dậy mùi thơm.",
  "áp chảo":
    "Làm chín nhanh thực phẩm trên chảo nóng với rất ít dầu.",
  "om nhỏ lửa":
    "Nấu liu riu ở nhiệt thấp để nguyên liệu mềm và thấm vị.",
  "trộn đều":
    "Đảo nhẹ các nguyên liệu để gia vị phủ đồng đều.",
  "hấp cách thủy":
    "Làm chín bằng hơi nước, không để thực phẩm chạm trực tiếp vào nước.",
};

interface RecipeSeed {
  baseAmount: number;
  baseServings: number;
  category: RecipeCategory;
  cookTimeMinutes: number;
  difficulty: RecipeDifficulty;
  image: string;
  imageAlt: string;
  mainIngredient: string;
  prepNote: string;
  slug: string;
  techniqueIcon: TechniqueIcon;
  title: string;
  unit: string;
}

function createRecipe(seed: RecipeSeed): Recipe {
  const primaryTerm =
    seed.techniqueIcon === "chao"
      ? "áp chảo"
      : seed.techniqueIcon === "hap"
        ? "hấp cách thủy"
        : seed.techniqueIcon === "tron"
          ? "trộn đều"
          : "om nhỏ lửa";

  return {
    ...seed,
    cookingTerms: COOKING_TERMS,
    ingredients: [
      {
        id: `${seed.slug}-hanh`,
        name: "Hành tím",
        baseAmount: 2,
        unit: "củ",
        prepNote: "Hành tím: bóc vỏ, thái mỏng",
        haveIt: true,
      },
      {
        id: `${seed.slug}-toi`,
        name: "Tỏi",
        baseAmount: 3,
        unit: "tép",
        prepNote: "Tỏi: bóc vỏ, băm nhỏ",
        haveIt: true,
      },
      {
        id: `${seed.slug}-main`,
        name: seed.mainIngredient,
        baseAmount: seed.baseAmount,
        unit: seed.unit,
        prepNote: seed.prepNote,
        // TODO: thay bằng logic đối chiếu nguyên liệu người dùng đã nhập.
        haveIt: false,
      },
      {
        id: `${seed.slug}-seasoning`,
        name: "Gia vị cơ bản",
        baseAmount: 1,
        unit: "phần",
        prepNote: "Chuẩn bị nước mắm, đường, tiêu và dầu ăn",
        // TODO: thay bằng logic đối chiếu nguyên liệu người dùng đã nhập.
        haveIt: false,
      },
    ],
    steps: [
      {
        id: `${seed.slug}-prepare`,
        content: `Sơ chế ${seed.mainIngredient.toLocaleLowerCase("vi")} theo hướng dẫn. Chuẩn bị hành tím và tỏi, sau đó {{trộn đều}} cùng một nửa phần gia vị.`,
        estimatedMinutes: Math.max(5, Math.round(seed.cookTimeMinutes * 0.25)),
        isTricky: false,
        techniqueIcon: "dao",
      },
      {
        id: `${seed.slug}-cook`,
        content: `Làm nóng dụng cụ nấu, {{phi thơm}} hành tỏi rồi cho ${seed.mainIngredient.toLocaleLowerCase("vi")} vào. Thực hiện kỹ thuật {{${primaryTerm}}} đến khi nguyên liệu vừa chín.`,
        estimatedMinutes: Math.max(5, Math.round(seed.cookTimeMinutes * 0.45)),
        isTricky: seed.difficulty !== "de",
        techniqueIcon: seed.techniqueIcon,
      },
      {
        id: `${seed.slug}-finish`,
        content:
          "Nêm phần gia vị còn lại, tiếp tục {{om nhỏ lửa}} cho thấm. Kiểm tra độ chín, tắt bếp và trình bày món ăn.",
        estimatedMinutes: Math.max(3, Math.round(seed.cookTimeMinutes * 0.3)),
        isTricky: seed.difficulty === "kho",
        techniqueIcon: "noi",
      },
    ],
  };
}

// TODO: thay bằng API thật.
export const MOCK_RECIPES: Recipe[] = [
  createRecipe({
    slug: "thit-bo-xao-bong-cai",
    title: "Thịt Bò Xào Bông Cải",
    image: "/images/recipes/thit-bo-xao-bong-cai.png",
    imageAlt: "Thịt bò xào với bông cải xanh",
    difficulty: "de",
    cookTimeMinutes: 20,
    baseServings: 2,
    category: "Món xào",
    mainIngredient: "Thịt bò và bông cải",
    baseAmount: 300,
    unit: "g",
    prepNote: "Thịt bò thái mỏng, bông cải tách miếng vừa ăn",
    techniqueIcon: "chao",
  }),
  createRecipe({
    slug: "rau-muong-xao-toi",
    title: "Rau Muống Xào Tỏi",
    image: "/images/recipes/rau-muong-xao-toi.png",
    imageAlt: "Rau muống xanh xào tỏi",
    difficulty: "de",
    cookTimeMinutes: 10,
    baseServings: 4,
    category: "Món xào",
    mainIngredient: "Rau muống",
    baseAmount: 500,
    unit: "g",
    prepNote: "Rau muống nhặt sạch, ngâm nước muối rồi để ráo",
    techniqueIcon: "chao",
  }),
  createRecipe({
    slug: "suon-xao-chua-ngot",
    title: "Sườn Xào Chua Ngọt",
    image: "/images/recipes/suon-xao-chua-ngot.png",
    imageAlt: "Sườn xào chua ngọt phủ mè",
    difficulty: "trung-binh",
    cookTimeMinutes: 35,
    baseServings: 4,
    category: "Món xào",
    mainIngredient: "Sườn non",
    baseAmount: 600,
    unit: "g",
    prepNote: "Sườn chặt miếng, chần nhanh rồi rửa sạch",
    techniqueIcon: "chao",
  }),
  createRecipe({
    slug: "canh-chua-ca-loc",
    title: "Canh Chua Cá Lóc",
    image: "/images/recipes/pho-bo.png",
    imageAlt: "Bát canh nóng với cá và rau thơm",
    difficulty: "trung-binh",
    cookTimeMinutes: 30,
    baseServings: 4,
    category: "Món canh",
    mainIngredient: "Cá lóc",
    baseAmount: 700,
    unit: "g",
    prepNote: "Cá làm sạch, cắt khoanh và để ráo",
    techniqueIcon: "noi",
  }),
  createRecipe({
    slug: "chao-ga-xe-phay",
    title: "Cháo Gà Xé Phay",
    image: "/images/recipes/chao-ga.png",
    imageAlt: "Bát cháo gà xé phay",
    difficulty: "de",
    cookTimeMinutes: 25,
    baseServings: 3,
    category: "Món canh",
    mainIngredient: "Thịt gà",
    baseAmount: 400,
    unit: "g",
    prepNote: "Gà rửa sạch, luộc chín rồi xé sợi",
    techniqueIcon: "noi",
  }),
  createRecipe({
    slug: "cha-gio-hai-san",
    title: "Chả Giò Hải Sản",
    image: "/images/recipes/goi-cuon-tom-thit.png",
    imageAlt: "Món cuốn hải sản ăn kèm rau xanh",
    difficulty: "trung-binh",
    cookTimeMinutes: 45,
    baseServings: 3,
    category: "Món chiên",
    mainIngredient: "Hải sản",
    baseAmount: 350,
    unit: "g",
    prepNote: "Tôm mực làm sạch, thái hạt lựu và để ráo",
    techniqueIcon: "chao",
  }),
  createRecipe({
    slug: "banh-xeo-mien-tay",
    title: "Bánh Xèo Miền Tây",
    image: "/images/recipes/banh-xeo-mien-tay.png",
    imageAlt: "Bánh xèo vàng giòn với rau thơm",
    difficulty: "trung-binh",
    cookTimeMinutes: 35,
    baseServings: 3,
    category: "Món chiên",
    mainIngredient: "Bột bánh xèo",
    baseAmount: 300,
    unit: "g",
    prepNote: "Pha bột với nước theo tỷ lệ, để nghỉ 15 phút",
    techniqueIcon: "chao",
  }),
  createRecipe({
    slug: "ca-hap-gung",
    title: "Cá Hấp Gừng",
    image: "/images/recipes/bo-bop-thau.png",
    imageAlt: "Món cá hấp với rau củ và gừng",
    difficulty: "de",
    cookTimeMinutes: 40,
    baseServings: 4,
    category: "Món hấp",
    mainIngredient: "Cá nguyên con",
    baseAmount: 1,
    unit: "con",
    prepNote: "Cá làm sạch, khứa nhẹ hai mặt và thấm khô",
    techniqueIcon: "hap",
  }),
  createRecipe({
    slug: "nam-xao-dau-hu-chay",
    title: "Nấm Xào Đậu Hũ Chay",
    image: "/images/recipes/nam-xao-dau-hu.png",
    imageAlt: "Nấm xào đậu hũ với ớt chuông",
    difficulty: "de",
    cookTimeMinutes: 15,
    baseServings: 2,
    category: "Món chay",
    mainIngredient: "Nấm và đậu hũ",
    baseAmount: 350,
    unit: "g",
    prepNote: "Nấm lau sạch, đậu hũ cắt miếng vuông",
    techniqueIcon: "chao",
  }),
  createRecipe({
    slug: "pho-bo-gia-truyen",
    title: "Phở Bò Gia Truyền",
    image: "/images/recipes/pho-bo.png",
    imageAlt: "Bát phở bò nóng với rau thơm",
    difficulty: "kho",
    cookTimeMinutes: 120,
    baseServings: 6,
    category: "Món canh",
    mainIngredient: "Xương ống và thịt bò",
    baseAmount: 1500,
    unit: "g",
    prepNote: "Xương chần sạch, thịt bò thái lát mỏng ngang thớ",
    techniqueIcon: "noi",
  }),
];

export const DIFFICULTY_ORDER: Record<RecipeDifficulty, number> = {
  de: 0,
  "trung-binh": 1,
  kho: 2,
};

export function getRecipeBySlug(slug: string) {
  return MOCK_RECIPES.find((recipe) => recipe.slug === slug);
}
