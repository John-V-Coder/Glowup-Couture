import { Fragment, useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Sparkles,
  RotateCcw,
  Check,
  Search
} from "lucide-react";
import { filterOptions } from "@/config";

// Mobile Filter Trigger Button Component
const MobileFilterTrigger = ({ activeFiltersCount, children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`md:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b' : 'bg-gradient-to-b from-white to-transparent'
    }`}>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-gray-900">Products</h1>
        <div className="relative">
          {children}
          {activeFiltersCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

// Individual Filter Section Component
const FilterSection = ({ title, options, filters, handleFilter, keyItem }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const activeCount = filters?.[keyItem]?.length || 0;

  return (
    <div className="space-y-2">
      <div 
        className="flex items-center justify-between cursor-pointer py-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium capitalize text-gray-800">
            {title}
          </h3>
          {activeCount > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 h-4 min-w-4">
              {activeCount}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="grid gap-1.5 pl-1">
          {options.map((option) => (
            <Label
              key={option.id}
              className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-50 cursor-pointer text-sm"
            >
              <Checkbox
                checked={
                  filters &&
                  Object.keys(filters).length > 0 &&
                  filters[keyItem] &&
                  filters[keyItem].indexOf(option.id) > -1
                }
                onCheckedChange={() => handleFilter(keyItem, option.id)}
                className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 h-4 w-4"
              />
              {keyItem === "color" ? (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-gray-700 truncate">{option.label}</span>
                </div>
              ) : (
                <span className="text-gray-700 flex-1 truncate">{option.label}</span>
              )}
            </Label>
          ))}
        </div>
      )}
    </div>
  );
};

// Active Filters Display Component
const ActiveFiltersDisplay = ({ filters, handleFilter }) => {
  const activeFilters = [];
  
  Object.keys(filters || {}).forEach(key => {
    if (filters[key]?.length > 0) {
      filters[key].forEach(filterId => {
        const option = filterOptions[key]?.find(opt => opt.id === filterId);
        if (option) {
          activeFilters.push({ key, id: filterId, label: option.label });
        }
      });
    }
  });

  if (activeFilters.length === 0) return null;

  const removeFilter = (key, id) => {
    if (handleFilter) {
      handleFilter(key, id);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-gray-600 flex items-center gap-1">
        <Check className="w-3 h-3 text-green-500" />
        Active ({activeFilters.length})
      </h4>
      
      <div className="flex flex-wrap gap-1">
        {activeFilters.map((filter, index) => (
          <Badge
            key={`${filter.key}-${filter.id}`}
            variant="secondary"
            className="bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer group flex items-center gap-1 text-xs py-1 px-2 h-6 transition-colors"
            onClick={() => removeFilter(filter.key, filter.id)}
          >
            <span className="truncate max-w-16">{filter.label}</span>
            <X className="w-3 h-3 flex-shrink-0 group-hover:text-red-600 transition-colors" />
          </Badge>
        ))}
      </div>
      <Separator className="my-2" />
    </div>
  );
};

// Main Product Filter Component
function ProductFilter({ filters, handleFilter, clearAllFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Count active filters
  const activeFiltersCount = Object.values(filters || {}).reduce((count, filterArray) => {
    return count + (filterArray?.length || 0);
  }, 0);

  // Desktop Filter (Hidden on mobile)
  const DesktopFilter = () => (
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-64">
      {/* Header */}
      <div className="p-2 bg-gradient-to-r from-amber-50 to-orange-50 border-b">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-600" />
          <h2 className="text-base font-semibold text-gray-900">Filter By</h2>
        </div>
      </div>

      {/* Filters Content */}
      <ScrollArea className="h-[400px]">
        <div className="p-2 space-y-2">
          {/* Active Filters */}
          <ActiveFiltersDisplay 
            filters={filters} 
            handleFilter={handleFilter}
          />

          {/* Filter Sections */}
          {Object.keys(filterOptions).map((keyItem, index) => (
            <div key={keyItem}>
              <FilterSection
                title={keyItem}
                options={filterOptions[keyItem]}
                filters={filters}
                handleFilter={handleFilter}
                keyItem={keyItem}
              />
              {index < Object.keys(filterOptions).length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  // Mobile Filter Content
  const MobileFilterContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <h2 className="text-base font-semibold text-gray-900">Filter By</h2>
        </div>
      </div>

      {/* Filters Content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {/* Active Filters */}
          <ActiveFiltersDisplay 
            filters={filters} 
            handleFilter={handleFilter}
          />

          {/* Filter Sections */}
          {Object.keys(filterOptions).map((keyItem, index) => (
            <div key={keyItem}>
              <FilterSection
                title={keyItem}
                options={filterOptions[keyItem]}
                filters={filters}
                handleFilter={handleFilter}
                keyItem={keyItem}
              />
              {index < Object.keys(filterOptions).length - 1 && (
                <Separator className="my-3" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-3 border-t bg-white">
        <Button
          className="w-full bg-amber-500 hover:bg-amber-600"
          onClick={() => setIsOpen(false)}
        >
          <Check className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      <DesktopFilter />

      {/* Mobile Filter Trigger */}
      <MobileFilterTrigger activeFiltersCount={activeFiltersCount}>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="relative bg-white hover:bg-amber-50 border-amber-300 hover:border-amber-400 text-amber-800 hover:text-amber-900 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter By
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            side="bottom" 
            className="h-[90vh] w-full p-0 rounded-t-2xl border-0 shadow-2xl"
          >
            <MobileFilterContent />
          </SheetContent>
        </Sheet>
      </MobileFilterTrigger>

      {/* Spacer for mobile */}
      <div className="md:hidden h-20" />
    </>
  );
}

export default ProductFilter;