import React, { useState } from "react";
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Check,
  ArrowUpDown,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Home
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { filterOptions, sortOptions } from "@/config";

const NavigationHeader = ({ currentView, onBack, onHome, title }) => {
  return (
    <div className="flex items-center gap-3 pb-4 border-b">
      {currentView !== 'main' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}
      {currentView !== 'main' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onHome}
          className="p-2 h-8 w-8"
        >
          <Home className="w-4 h-4" />
        </Button>
      )}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary rounded-lg">
          <Sliders className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <div className="text-xs text-muted-foreground">
            {currentView === 'main' ? 'Filters & Sort' : `Filter by ${title}`}
          </div>
        </div>
      </div>
    </div>
  );
};
const MainView = ({ 
  filters, 
  sort, 
  handleSort, 
  clearAllFilters, 
  handleFilter, 
  onNavigate 
}) => {
  const activeFiltersCount = Object.values(filters || {}).reduce(
    (count, filterArray) => count + (filterArray?.length || 0), 0
  );
  const ActiveFilters = () => {
    if (activeFiltersCount === 0) return null;
    return (
      <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Active Filters</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-2 text-destructive hover:text-destructive"
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
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => handleFilter(key, filterId)}
                >
                  {option.label}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ) : null;
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sort Section */}
      <div className="space-y-3">
        <label className="text-sm font-semibold">Sort By</label>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters */}
      <ActiveFilters />

      {/* Filter Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Filter Categories</h4>
        {Object.keys(filterOptions).map((key) => {
          const selectedCount = (filters[key] || []).length;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium capitalize">{key}</span>
                {selectedCount > 0 && (
                  <Badge variant="default" className="text-xs">
                    {selectedCount}
                  </Badge>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

const FilterDetailView = ({ 
  filterKey, 
  filters, 
  handleFilter, 
  onBack 
}) => {
  const options = filterOptions[filterKey] || [];
  const selectedValues = filters[filterKey] || [];

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Select one or more {filterKey} options
      </div>
      
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.id)}
                onChange={() => handleFilter(filterKey, option.id)}
                className="w-4 h-4 text-primary border-2 border-border rounded focus:ring-primary focus:ring-2 appearance-none checked:bg-primary checked:border-primary"
              />
              {selectedValues.includes(option.id) && (
                <Check className="w-3 h-3 text-primary-foreground absolute top-0.5 left-0.5 pointer-events-none" />
              )}
            </div>
            <span className="font-medium">{option.label}</span>
          </label>
        ))}
      </div>

      <div className="pt-4 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Filters
        </Button>
      </div>
    </div>
  );
};

export const ProductFilter = ({ 
  filters = {}, 
  handleFilter = () => {}, 
  clearAllFilters = () => {}, 
  sort = "price-lowtohigh", 
  handleSort = () => {} 
}) => {
  const [currentView, setCurrentView] = useState('main');
  const [navigationHistory, setNavigationHistory] = useState(['main']);

  const activeFiltersCount = Object.values(filters || {}).reduce(
    (count, filterArray) => count + (filterArray?.length || 0), 0
  );

  const handleNavigate = (view) => {
    setCurrentView(view);
    setNavigationHistory(prev => [...prev, view]);
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      setNavigationHistory(newHistory);
      setCurrentView(newHistory[newHistory.length - 1]);
    }
  };

  const handleHome = () => {
    setCurrentView('main');
    setNavigationHistory(['main']);
  };

  const resetNavigation = () => {
    setCurrentView('main');
    setNavigationHistory(['main']);
  };

  const getCurrentTitle = () => {
    if (currentView === 'main') return 'Filters & Sort';
    return currentView.charAt(0).toUpperCase() + currentView.slice(1);
  };

  return (
    <Sheet onOpenChange={(open) => !open && resetNavigation()}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-1 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <NavigationHeader
            currentView={currentView}
            onBack={handleBack}
            onHome={handleHome}
            title={getCurrentTitle()}
          />
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-6">
          {currentView === 'main' ? (
            <MainView
              filters={filters}
              sort={sort}
              handleSort={handleSort}
              clearAllFilters={clearAllFilters}
              handleFilter={handleFilter}
              onNavigate={handleNavigate}
            />
          ) : (
            <FilterDetailView
              filterKey={currentView}
              filters={filters}
              handleFilter={handleFilter}
              onBack={handleBack}
            />
          )}
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2 border-t pt-4">
          {currentView === 'main' && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="w-full sm:w-auto"
            >
              Reset All
            </Button>
          )}
          <SheetClose asChild>
            <Button className="w-full sm:w-auto">
              {currentView === 'main' ? 'Apply Filters' : 'Done'}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductFilter;