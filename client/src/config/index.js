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
      { id: "Products", label: "All Products" },
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "custom", label: "Modern Custom" },
      { id: "sale", label: "Sale" },
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
    label: "Size",
    name: "size",
    componentType: "select",
    options: [
      { id: "xs", label: "XS" },
      { id: "s", label: "S" },
      { id: "m", label: "M" },
      { id: "l", label: "L" },
      { id: "xl", label: "XL" },
      { id: "xxl", label: "XXL" }
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
  { id: "home", path: "/shop/home", label: "Home" },
  { 
    id: "collections", 
    path: "/shop/listing", 
    label: "Collections",
    dropdown: [
      { id: "products", path: "/shop/listing?category=products", label: "All Products" },
      { id: "men", path: "/shop/listing?category=men", label: "Men's Collection" },
      { id: "women", path: "/shop/listing?category=women", label: "Women's Collection" },
      { id: "kids", path: "/shop/listing?category=kids", label: "Kid's Collection" },
      { id: "custom", path: "/shop/listing?category=custom", label: "Modern Customs" },
      { id: "sale", path: "/shop/listing?category/sale", label: "Sale" }
    ]
  },
  { id: "about", path: "/shop/about", label: "About Us" },
  { id: "gallery", path: "/shop/gallery", label: "Gallery" },
  { id: "search", path: "/shop/search", label: "Search" }
];

export const categoryOptionsMap = {
  products:"All Products",
  men: "Men",
  women: "Women",
  kids: "Kids",
  custom: "Modern Customed",
  sale: "Sale"
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

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "custom", label: "Modern Custom" },
    { id: "sale", label: "Sale" },
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
  size: [
    { id: "xs", label: "XS" },
    { id: "s", label: "S" },
    { id: "m", label: "M" },
    { id: "l", label: "L" },
    { id: "xl", label: "XL" },
    { id: "xxl", label: "XXL" }
  ]
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
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