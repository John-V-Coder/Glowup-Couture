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
  Search,
  ArrowUpDown,
  Trash2
} from "lucide-react";
import { filterOptions, sortOptions } from "@/config";

// Mobile Filter Trigger Button Component
const MobileFilterTrigger = ({ activeFiltersCount, children }) => {
  return (
    <div className="md:hidden sticky top-0 z-40 bg-white/98 backdrop-blur-lg shadow-lg border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Discover amazing products</p>
        </div>
        <div className="relative">
          {children}
          {activeFiltersCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 bg-black hover:bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md"
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div 
        className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 rounded-t-xl transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-black"></div>
          <h3 className="text-base font-semibold capitalize text-gray-900">
            {title}
          </h3>
          {activeCount > 0 && (
            <Badge className="bg-black text-white border-black text-xs px-2 py-1 rounded-full font-medium">
              {activeCount} selected
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400 hover:text-black transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 hover:text-black transition-colors" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          <Separator className="mb-3 bg-gray-200" />
          {options.map((option, index) => (
            <Label
              key={option.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer text-sm transition-all duration-200 group border border-transparent hover:border-gray-200"
            >
              <Checkbox
                checked={
                  filters &&
                  Object.keys(filters).length > 0 &&
                  filters[keyItem] &&
                  filters[keyItem].indexOf(option.id) > -1
                }
                onCheckedChange={() => handleFilter(keyItem, option.id)}
                className="data-[state=checked]:bg-black data-[state=checked]:border-black h-5 w-5 rounded-md shadow-sm"
              />
              {keyItem === "color" ? (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-200 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-gray-800 group-hover:text-black font-medium truncate">{option.label}</span>
                </div>
              ) : (
                <span className="text-gray-800 group-hover:text-black font-medium flex-1 truncate">{option.label}</span>
              )}
            </Label>
          ))}
        </div>
      )}
    </div>
  );
};

// Sort Options Component
const SortSection = ({ sort, handleSort }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentSortLabel = sortOptions.find(option => option.id === sort)?.label || "Price: Low to High";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div 
        className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 rounded-t-xl transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black rounded-lg shadow-sm">
            <ArrowUpDown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Sort By</h3>
            {!isExpanded && (
              <p className="text-sm text-gray-600 mt-0.5">{currentSortLabel}</p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400 hover:text-black transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 hover:text-black transition-colors" />
        )}
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          <Separator className="mb-3 bg-gray-200" />
          {sortOptions.map((option) => (
            <Label
              key={option.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer text-sm transition-all duration-200 group border border-transparent hover:border-gray-200"
            >
              <div className="relative">
                <input
                  type="radio"
                  name="sort"
                  value={option.id}
                  checked={sort === option.id}
                  onChange={() => handleSort(option.id)}
                  className="w-5 h-5 text-black focus:ring-black focus:ring-2 rounded-full"
                />
              </div>
              <span className="text-gray-800 group-hover:text-black font-medium flex-1">{option.label}</span>
              {sort === option.id && (
                <Check className="w-4 h-4 text-black" />
              )}
            </Label>
          ))}
        </div>
      )}
    </div>
  );
};

// Active Filters Display Component
const ActiveFiltersDisplay = ({ filters, handleFilter, clearAllFilters }) => {
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
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <div className="p-1.5 bg-black rounded-lg">
            <Check className="w-3 h-3 text-white" />
          </div>
          Active Filters ({activeFilters.length})
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear All
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <Badge
            key={`${filter.key}-${filter.id}`}
            variant="secondary"
            className="bg-white text-black hover:bg-red-50 hover:text-red-800 cursor-pointer group flex items-center gap-1.5 text-xs py-1.5 px-3 h-auto transition-all duration-200 border border-gray-200 hover:border-red-200 shadow-sm"
            onClick={() => removeFilter(filter.key, filter.id)}
          >
            <span className="truncate max-w-20 font-medium">{filter.label}</span>
            <X className="w-3 h-3 flex-shrink-0 group-hover:text-red-600 transition-colors" />
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Main Product Filter Component
function ProductFilter({ filters, handleFilter, clearAllFilters, sort, handleSort }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Count active filters
  const activeFiltersCount = Object.values(filters || {}).reduce((count, filterArray) => {
    return count + (filterArray?.length || 0);
  }, 0);

  // Reset all filters and sort
  const handleResetAll = () => {
    if (clearAllFilters) {
      clearAllFilters();
    }
    // Reset sort to default
    if (handleSort) {
      handleSort("price-lowtohigh");
    }
  };

  // Desktop Filter (Hidden on mobile)
  const DesktopFilter = () => (
    <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black rounded-xl shadow-md">
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Filters & Sort</h2>
            <p className="text-sm text-gray-600 mt-0.5">Refine your search</p>
          </div>
        </div>
      </div>

      {/* Filters Content */}
      <ScrollArea className="h-[500px]">
        <div className="p-6 space-y-6">
          {/* Sort Section */}
          <SortSection sort={sort} handleSort={handleSort} />

          {/* Active Filters */}
          <ActiveFiltersDisplay 
            filters={filters} 
            handleFilter={handleFilter}
            clearAllFilters={clearAllFilters}
          />

          {/* Filter Sections */}
          {Object.keys(filterOptions).map((keyItem) => (
            <FilterSection
              key={keyItem}
              title={keyItem}
              options={filterOptions[keyItem]}
              filters={filters}
              handleFilter={handleFilter}
              keyItem={keyItem}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetAll}
            className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Filters & Sort
          </Button>
          <p className="text-xs text-gray-500 text-center">
            {activeFiltersCount > 0 ? `${activeFiltersCount} filters active` : 'No filters applied'}
          </p>
        </div>
      </div>
    </div>
  );

  // Mobile Filter Content
  const MobileFilterContent = () => (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black rounded-xl shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Filters & Sort</h2>
            <p className="text-sm text-gray-600">Find exactly what you need</p>
          </div>
        </div>
      </div>

      {/* Filters Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Sort Section */}
          <SortSection sort={sort} handleSort={handleSort} />

          {/* Active Filters */}
          <ActiveFiltersDisplay 
            filters={filters} 
            handleFilter={handleFilter}
            clearAllFilters={clearAllFilters}
          />

          {/* Filter Sections */}
          {Object.keys(filterOptions).map((keyItem) => (
            <FilterSection
              key={keyItem}
              title={keyItem}
              options={filterOptions[keyItem]}
              filters={filters}
              handleFilter={handleFilter}
              keyItem={keyItem}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-6 border-t bg-white space-y-3">
        <Button
          className="w-full bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setIsOpen(false)}
        >
          <Check className="w-5 h-5 mr-2" />
          Apply Filters & Sort
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetAll}
          className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-200 font-medium"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
        <p className="text-xs text-gray-500 text-center">
          {activeFiltersCount > 0 ? `${activeFiltersCount} filters active` : 'No filters applied'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <DesktopFilter />

      {/* Mobile Filter Trigger */}
      <MobileFilterTrigger activeFiltersCount={activeFiltersCount}>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="relative bg-white hover:bg-gray-50 border-2 border-black hover:border-gray-800 text-black hover:text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter & Sort
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-black text-white text-xs px-2 py-1 rounded-full shadow-md">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            side="bottom" 
            className="h-[92vh] w-full p-0 rounded-t-3xl border-0 shadow-2xl"
          >
            <MobileFilterContent />
          </SheetContent>
        </Sheet>
      </MobileFilterTrigger>
    </>
  );
}

export default ProductFilter;