// Authentication Form Controls for Passwordless Login

// Step 1: Request a login code
export const requestLoginCodeFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
];

// Step 2: Verify the code to log in
export const verifyLoginCodeFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "code",
    label: "Login Code",
    placeholder: "Enter 6-digit code",
    componentType: "input",
    type: "text",
  },
];

// Enhanced Product Form Elements - Updated to match backend schema exactly

export const addProductFormSizeElements = [
   {
    label: "Sizes",
    name: "sizes",
    componentType: "multiselect",
    options: [
      { id: "XS", label: "XS" },
      { id: "S", label: "S" },
      { id: "M", label: "M" },
      { id: "L", label: "L" },
      { id: "XL", label: "XL" },
      { id: "XXL", label: "XXL" },
      // Add numeric sizes for shoes, etc.
      { id: "6", label: "6" },
      { id: "7", label: "7" },
      { id: "8", label: "8" },
      { id: "9", label: "9" },
      { id: "10", label: "10" },
      { id: "11", label: "11" },
      { id: "12", label: "12" },
    ],
  },
]

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
    required: true,
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
    required: true,
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    required: true,
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "custom", label: "Modern Custom" },
      { id: "sale", label: "Sale" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "Zara", label: "Zara" },
      { id: "H&M", label: "H&M" },
      { id: "Nike", label: "Nike" },
      { id: "Adidas", label: "Adidas" },
      { id: "Levi's", label: "Levi's" },
      { id: "Calvin Klein", label: "Calvin Klein" },
      { id: "Tommy Hilfiger", label: "Tommy Hilfiger" },
      { id: "Ralph Lauren", label: "Ralph Lauren" },
      { id: "Gucci", label: "Gucci" },
      { id: "Prada", label: "Prada" },
      { id: "Uniqlo", label: "Uniqlo" },
      { id: "Forever 21", label: "Forever 21" },
    ],
  },
  {
    label: "Material",
    name: "material",
    componentType: "select",
    options: [
      { id: "cotton", label: "Cotton" },
      { id: "wool", label: "Wool" },
      { id: "denim", label: "Denim" },
      { id: "polyester", label: "Polyester" },
      { id: "silk", label: "Silk" },
      { id: "fleece", label: "Fleece" },
      { id: "linen", label: "Linen" },
      { id: "viscose", label: "Viscose" },
      { id: "leather", label: "Leather" },
      { id: "metal", label: "Metal" },
      { id: "plastic", label: "Plastic" },
      { id: "wood", label: "Wood" },
    ],
  },
  {
    label: "Colors",
    name: "colors",
    componentType: "multiselect",
    options: [
      { id: "Red", label: "Red" },
      { id: "Blue", label: "Blue" },
      { id: "Black", label: "Black" },
      { id: "White", label: "White" },
      { id: "Green", label: "Green" },
      { id: "Yellow", label: "Yellow" },
      { id: "Pink", label: "Pink" },
      { id: "Purple", label: "Purple" },
      { id: "Orange", label: "Orange" },
      { id: "Brown", label: "Brown" },
      { id: "Gray", label: "Gray" },
      { id: "Navy", label: "Navy" },
      { id: "Silver", label: "Silver" },
      { id: "Gold", label: "Gold" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
    required: true,
    min: 0,
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional, must be less than regular price)",
    min: 0,
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock quantity",
    required: true,
    min: 0,
  },
  {
    label: "Tags",
    name: "tags",
    componentType: "input",
    type: "text",
    placeholder: "Enter tags separated by commas (e.g., summer, casual, trendy)",
    help: "Tags help customers find your product through search and filters",
  },
  {
    label: "Featured Product",
    name: "isFeatured",
    componentType: "checkbox",
    help: "Featured products appear in special sections and get priority in search results",
  },
    {
    name: "status",
    label: "Product Status",
    componentType: "switch",
  },
]

// Navigation Menu Items - Updated for cloth brand
export const shoppingViewHeaderMenuItems = [
  { id: "home", path: "/shop/home", label: "Home" },
  {
    id: "collections",
    path: "/shop/listing",
    label: "Collections",
    dropdown: [
      { id: "men", path: "/shop/listing?category=men", label: "Men's Collection" },
      { id: "women", path: "/shop/listing?category=women", label: "Women's Collection" },
      { id: "kids", path: "/shop/listing?category=kids", label: "Kid's Collection" },
      { id: "custom", path: "/shop/listing?category=custom", label: "Modern Customs" },
      { id: "sale", path: "/shop/listing?category=sale", label: "Sale" },
    ],
  },
  { id: "about", path: "/shop/about", label: "About Us" },
  { id: "gallery", path: "/shop/gallery", label: "Gallery" },
  { id: "search", path: "/shop/listing", label: "Browse All" },
]

// Category and Brand Mappings (Kept your original labels)
export const categoryOptionsMap = {
  men: "Men",
  women: "Women", 
  kids: "Kids",
  custom: "Modern Custom",
  sale: "Sale",
}

export const brandOptionsMap = {
  "Zara": "Zara",
  "H&M": "H&M", 
  "Nike": "Nike",
  "Adidas": "Adidas",
  "Levi's": "Levi's",
  "Calvin Klein": "Calvin Klein",
  "Tommy Hilfiger": "Tommy Hilfiger",
  "Ralph Lauren": "Ralph Lauren",
  "Gucci": "Gucci",
  "Prada": "Prada",
  "Uniqlo": "Uniqlo",
  "Forever 21": "Forever 21",
}

export const materialOptionsMap = {
  cotton: "Cotton",
  wool: "Wool",
  denim: "Denim",
  polyester: "Polyester",
  silk: "Silk",
  fleece: "Fleece",
  linen: "Linen",
  viscose: "Viscose",
  leather: "Leather",
  metal: "Metal",
  plastic: "Plastic",
  wood: "Wood",
}

// Default Filter Options (Fallback - use dynamic from API when available)
export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "custom", label: "Modern Custom" },
    { id: "sale", label: "Sale" },
  ],
  brand: [
    { id: "Zara", label: "Zara" },
    { id: "H&M", label: "H&M" },
    { id: "Nike", label: "Nike" },
    { id: "Adidas", label: "Adidas" },
    { id: "Levi's", label: "Levi's" },
    { id: "Calvin Klein", label: "Calvin Klein" },
    { id: "Tommy Hilfiger", label: "Tommy Hilfiger" },
    { id: "Ralph Lauren", label: "Ralph Lauren" },
    { id: "Gucci", label: "Gucci" },
    { id: "Prada", label: "Prada" },
    { id: "Uniqlo", label: "Uniqlo" },
    { id: "Forever 21", label: "Forever 21" },
  ],
  material: [
    { id: "cotton", label: "Cotton" },
    { id: "wool", label: "Wool" },
    { id: "denim", label: "Denim" },
    { id: "polyester", label: "Polyester" },
    { id: "silk", label: "Silk" },
    { id: "fleece", label: "Fleece" },
    { id: "linen", label: "Linen" },
    { id: "viscose", label: "Viscose" },
  ],
  sizes: [
    { id: "XS", label: "XS" },
    { id: "S", label: "S" },
    { id: "M", label: "M" },
    { id: "L", label: "L" },
    { id: "XL", label: "XL" },
    { id: "XXL", label: "XXL" },
  ],
  colors: [
    { id: "Red", label: "Red" },
    { id: "Blue", label: "Blue" },
    { id: "Black", label: "Black" },
    { id: "White", label: "White" },
    { id: "Green", label: "Green" },
    { id: "Yellow", label: "Yellow" },
  ],
  priceRange: [
    { id: "0-1000", label: "₹0 - ₹1,000" },
    { id: "1000-2500", label: "₹1,000 - ₹2,500" },
    { id: "2500-5000", label: "₹2,500 - ₹5,000" },
    { id: "5000-10000", label: "₹5,000 - ₹10,000" },
    { id: "10000+", label: "₹10,000+" },
  ],
  tags: [
    { id: "summer", label: "Summer" },
    { id: "winter", label: "Winter" },
    { id: "casual", label: "Casual" },
    { id: "formal", label: "Formal" },
    { id: "trendy", label: "Trendy" },
    { id: "classic", label: "Classic" },
  ],
}

// Sort Options - FIXED to match backend exactly
export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "rating", label: "Highest Rated" }, // Fixed: backend uses "rating"
  { id: "discount", label: "Highest Discount" }, // Fixed: backend uses "discount"  
  { id: "featured", label: "Featured First" },
  { id: "popularity", label: "Most Popular" }, // New option from backend
]

// Address Form Controls
export const addressFormControls = [
  {
    label: "User Name",  // ADDED: User Name Field
    name: "userName",
    componentType: "input",
    type: "text",
    placeholder: "Enter your user name",
    required: true,
  },
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
    required: true,
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
    required: true,
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
    required: true,
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
    required: true,
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
]

// Utility Functions
export const getPriceRangeFromPrice = (price) => {
  if (price < 1000) return "0-1000"
  if (price < 2500) return "1000-2500"
  if (price < 5000) return "2500-5000"
  if (price < 10000) return "5000-10000"
  return "10000+"
}

export const calculateDiscountPercentage = (price, salePrice) => {
  if (!salePrice || salePrice >= price) return 0
  return Math.round(((price - salePrice) / price) * 100)
}

export const getEffectivePrice = (price, salePrice) => {
  return salePrice > 0 && salePrice < price ? salePrice : price
}

// Stock Status Helpers
export const getStockStatus = (totalStock) => {
  if (totalStock === 0) return "out-of-stock"
  if (totalStock <= 5) return "low-stock"
  return "in-stock"
}

export const stockStatusLabels = {
  "out-of-stock": "Out of Stock",
  "low-stock": "Low Stock",
  "in-stock": "In Stock",
}

export const stockStatusColors = {
  "out-of-stock": "text-red-600",
  "low-stock": "text-yellow-600", 
  "in-stock": "text-green-600",
}

// Filter Helper Functions
export const convertFilterOptionsToSelectFormat = (filterOptions) => {
  const converted = {}
  
  Object.keys(filterOptions).forEach(key => {
    if (Array.isArray(filterOptions[key])) {
      converted[key] = filterOptions[key].map(item => ({
        id: item,
        label: item
      }))
    }
  })
  
  return converted
}

// URL Param Helpers for Filters
export const filtersToUrlParams = (filters) => {
  const params = new URLSearchParams()
  
  Object.keys(filters).forEach(key => {
    const value = filters[key]
    if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
      if (Array.isArray(value)) {
        params.set(key, value.join(','))
      } else {
        params.set(key, value)
      }
    }
  })
  
  return params.toString()
}

export const urlParamsToFilters = (searchParams) => {
  const filters = {}
  
  for (const [key, value] of searchParams.entries()) {
    if (value.includes(',')) {
      filters[key] = value.split(',')
    } else {
      filters[key] = value
    }
  }
  
  return filters
}