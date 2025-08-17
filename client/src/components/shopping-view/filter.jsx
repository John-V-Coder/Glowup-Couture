import { Fragment, useState, useEffect } from "react";
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Check,
  ArrowUpDown,
  Trash2,
  ChevronRight
} from "lucide-react";

// Updated filter options based on your config
const filterOptions = {
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
  size: [
    { id: "xs", label: "XS" },
    { id: "s", label: "S" },
    { id: "m", label: "M" },
    { id: "l", label: "L" },
    { id: "xl", label: "XL" },
    { id: "xxl", label: "XXL" }
  ]
};

const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" }
];

// UI Components (simplified versions)
const Button = ({ children, className = "", variant = "default", size = "default", onClick, disabled, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-black text-white hover:bg-gray-800 focus:ring-gray-500",
    outline: "border-2 border-gray-200 bg-white hover:bg-gray-50 focus:ring-gray-500",
    ghost: "hover:bg-gray-100 focus:ring-gray-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500"
  };
  
  const sizes = {
    default: "h-11 px-6 py-2 text-sm",
    sm: "h-9 px-4 py-2 text-sm",
    lg: "h-12 px-8 py-3 text-base",
    xl: "h-14 px-10 py-4 text-lg"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className = "", onClick }) => (
  <span 
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${onClick ? 'cursor-pointer hover:bg-red-100 hover:text-red-800' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </span>
);

// Mobile Sheet Implementation
const MobileSheet = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col">
          {/* Drag handle */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

// Filter Section for Mobile
const MobileFilterSection = ({ title, options, selectedValues = [], onToggle, isExpanded, onToggleExpand }) => {
  const selectedCount = selectedValues.length;
  
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold capitalize text-gray-900">{title}</h3>
          {selectedCount > 0 && (
            <Badge className="bg-black text-white">
              {selectedCount}
            </Badge>
          )}
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-3">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => onToggle(option.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected 
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="font-medium">{option.label}</span>
                {isSelected && <Check className="w-4 h-4 ml-2 inline" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Sort Section for Mobile
const MobileSortSection = ({ currentSort, onSortChange, isExpanded, onToggleExpand }) => {
  const currentSortLabel = sortOptions.find(opt => opt.id === currentSort)?.label || "Price: Low to High";
  
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ArrowUpDown className="w-5 h-5 text-black" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sort By</h3>
            <p className="text-sm text-gray-500">{currentSortLabel}</p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onSortChange(option.id)}
              className={`w-full p-3 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                currentSort === option.id 
                  ? 'bg-black text-white' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="font-medium">{option.label}</span>
              {currentSort === option.id && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Desktop Filter Sidebar
const DesktopFilterSection = ({ title, options, selectedValues = [], onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const selectedCount = selectedValues.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-t-xl transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold capitalize text-gray-900">{title}</h3>
          {selectedCount > 0 && (
            <Badge className="bg-black text-white">
              {selectedCount}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-100 space-y-2">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.id);
            return (
              <label
                key={option.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(option.id)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="font-medium text-gray-800">{option.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Main Product Filter Component
function ProductFilter({ 
  filters = {}, 
  handleFilter = () => {}, 
  clearAllFilters = () => {}, 
  sort = "price-lowtohigh", 
  handleSort = () => {} 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    sort: false,
    category: true,
    material: false,
    size: false
  });
  
  // Count active filters
  const activeFiltersCount = Object.values(filters || {}).reduce((count, filterArray) => {
    return count + (filterArray?.length || 0);
  }, 0);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterToggle = (category, value) => {
    handleFilter(category, value);
  };

  const handleClearAll = () => {
    clearAllFilters();
    handleSort("price-lowtohigh");
  };

  // Desktop Filter Sidebar
  const DesktopFilter = () => (
    <div className="hidden lg:block w-80 self-start">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-xl">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <p className="text-sm text-gray-600">Refine your search</p>
            </div>
          </div>
        </div>

        {/* Filters Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">Active Filters</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(filters || {}).map(key => 
                    filters[key]?.map(filterId => {
                      const option = filterOptions[key]?.find(opt => opt.id === filterId);
                      return option ? (
                        <Badge
                          key={`${key}-${filterId}`}
                          onClick={() => handleFilter(key, filterId)}
                          className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                        >
                          {option.label} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ) : null;
                    })
                  )}
                </div>
              </div>
            )}

            {/* Filter Sections */}
            {Object.keys(filterOptions).map((keyItem) => (
              <DesktopFilterSection
                key={keyItem}
                title={keyItem}
                options={filterOptions[keyItem]}
                selectedValues={filters[keyItem] || []}
                onToggle={(value) => handleFilterToggle(keyItem, value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      <DesktopFilter />

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 rounded-full h-14 w-14 p-0 shadow-lg hover:shadow-xl"
        >
          <Filter className="w-6 h-6" />
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Mobile Sheet */}
        <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Filter className="w-6 h-6 text-black" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <p className="text-sm text-gray-500">
                  {activeFiltersCount > 0 ? `${activeFiltersCount} active` : 'No filters applied'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="rounded-full h-10 w-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Sort Section */}
            <MobileSortSection
              currentSort={sort}
              onSortChange={handleSort}
              isExpanded={expandedSections.sort}
              onToggleExpand={() => toggleSection('sort')}
            />

            {/* Filter Sections */}
            {Object.keys(filterOptions).map((keyItem) => (
              <MobileFilterSection
                key={keyItem}
                title={keyItem}
                options={filterOptions[keyItem]}
                selectedValues={filters[keyItem] || []}
                onToggle={(value) => handleFilterToggle(keyItem, value)}
                isExpanded={expandedSections[keyItem]}
                onToggleExpand={() => toggleSection(keyItem)}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="flex-1"
                disabled={activeFiltersCount === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                Apply ({activeFiltersCount})
              </Button>
            </div>
          </div>
        </MobileSheet>
      </div>
    </>
  );
}

export default ProductFilter;

// Demo wrapper with state management
function ProductFilterDemo() {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");

  const handleFilter = (category, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (!newFilters[category]) {
        newFilters[category] = [];
      }
      
      const index = newFilters[category].indexOf(value);
      if (index > -1) {
        newFilters[category] = newFilters[category].filter(item => item !== value);
        if (newFilters[category].length === 0) {
          delete newFilters[category];
        }
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
      
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const handleSort = (sortValue) => {
    setSort(sortValue);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-600">8 products found</p>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-8">
          <ProductFilter
            filters={filters}
            handleFilter={handleFilter}
            clearAllFilters={clearAllFilters}
            sort={sort}
            handleSort={handleSort}
          />
          
          {/* Demo product grid */}
          <div className="flex-1 pb-24 lg:pb-8">
            {/* Desktop header */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
              <p className="text-gray-600 mt-2">8 products found</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                <div key={item} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                  <h3 className="font-semibold text-gray-900 text-lg">Product {item}</h3>
                  <p className="text-gray-600 text-sm mt-1">Beautiful product description</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-gray-900">$99.99</span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}