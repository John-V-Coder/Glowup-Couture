export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "custom", label: "Modern Custom" }
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
      { id: "viscose", label: "Viscose" }
    ],
  },
  {
    label: "Color",
    name: "color",
    componentType: "select",
    options: [
      { id: "snow-white", label: "Snow White", color: "#FFFFFF" },
      { id: "midnight-black", label: "Midnight Black", color: "#191919" },
      { id: "royal-navy", label: "Royal Navy", color: "#003366" },
      { id: "crimson-red", label: "Crimson Red", color: "#DC143C" },
      { id: "emerald-green", label: "Emerald Green", color: "#50C878" },
      { id: "golden-yellow", label: "Golden Yellow", color: "#FFD700" },
      { id: "deep-purple", label: "Deep Purple", color: "#800080" },
      { id: "coral-pink", label: "Coral Pink", color: "#F88379" },
      { id: "taupe", label: "Taupe", color: "#483C32" },
      { id: "ivory", label: "Ivory", color: "#FFFFF0" },
      { id: "charcoal-grey", label: "Charcoal Grey", color: "#36454F" },
      { id: "burgundy", label: "Burgundy", color: "#800020" }
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "Men",
    path: "/shop/listing?category=men",
  },
  {
    id: "women",
    label: "Women",
    path: "/shop/listing?category=women",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing?category=kids",
  },
  {
    id: "custom",
    label: "Modern Customed",
    path: "/shop/listing?category=custom",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids(Girls)",
  kids: "Kids(Boys)",
  custom: "Modern Customed"
};

export const brandOptionsMap = {
  cotton: "Cotton",
  wool: "Wool",
  denim: "Denim",
  polyester: "Polyester",
  silk: "Silk",
  fleece: "Fleece",
  linen: "Linen",
  viscose: "Viscose"
};

export const colorOptionsMap = {
  "snow-white": { label: "Snow White", color: "#FFFFFF" },
  "midnight-black": { label: "Midnight Black", color: "#191919" },
  "royal-navy": { label: "Royal Navy", color: "#003366" },
  "crimson-red": { label: "Crimson Red", color: "#DC143C" },
  "emerald-green": { label: "Emerald Green", color: "#50C878" },
  "golden-yellow": { label: "Golden Yellow", color: "#FFD700" },
  "deep-purple": { label: "Deep Purple", color: "#800080" },
  "coral-pink": { label: "Coral Pink", color: "#F88379" },
  "taupe": { label: "Taupe", color: "#483C32" },
  "ivory": { label: "Ivory", color: "#FFFFF0" },
  "charcoal-grey": { label: "Charcoal Grey", color: "#36454F" },
  "burgundy": { label: "Burgundy", color: "#800020" }
};

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "custom", label: "Modern Custom" }
  ],
  material: [
    { id: "cotton", label: "Cotton" },
    { id: "wool", label: "Wool" },
    { id: "denim", label: "Denim" },
    { id: "polyester", label: "Polyester" },
    { id: "silk", label: "Silk" },
    { id: "fleece", label: "Fleece" },
    { id: "linen", label: "Linen" },
    { id: "viscose", label: "Viscose" }
  ],
  color: [
    { id: "snow-white", label: "Snow White", color: "#FFFFFF" },
    { id: "midnight-black", label: "Midnight Black", color: "#191919" },
    { id: "royal-navy", label: "Royal Navy", color: "#003366" },
    { id: "crimson-red", label: "Crimson Red", color: "#DC143C" },
    { id: "emerald-green", label: "Emerald Green", color: "#50C878" },
    { id: "golden-yellow", label: "Golden Yellow", color: "#FFD700" },
    { id: "deep-purple", label: "Deep Purple", color: "#800080" },
    { id: "coral-pink", label: "Coral Pink", color: "#F88379" },
    { id: "taupe", label: "Taupe", color: "#483C32" },
    { id: "ivory", label: "Ivory", color: "#FFFFF0" },
    { id: "charcoal-grey", label: "Charcoal Grey", color: "#36454F" },
    { id: "burgundy", label: "Burgundy", color: "#800020" }
  ]
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
  { id: "size-small", label: "Size: Small" },
  { id: "size-medium", label: "Size: Medium" },
  { id: "size-large", label: "Size: Large" },
  { id: "size-xlarge", label: "Size: X-Large" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];