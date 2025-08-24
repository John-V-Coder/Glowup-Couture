// src/components/shopping-view/SizeSelector.jsx

"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a size selection grid for a product.
 * @param {Object} props - The component properties.
 * @param {string[]} props.availableSizes - An array of available sizes (e.g., ['XS', 'S', 'M', 'L', 'XL']).
 * @param {string} props.selectedSize - The currently selected size.
 * @param {Function} props.onSelectSize - Callback function when a size is clicked.
 * @param {string[]} [props.disabledSizes=[]] - Optional array of sizes that are out of stock.
 */
export function SizeSelector({ availableSizes, selectedSize, onSelectSize, disabledSizes = [] }) {
  if (!availableSizes || availableSizes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-900">Size</h3>
      <div className="grid grid-cols-5 gap-2 md:grid-cols-6 lg:grid-cols-8">
        {availableSizes.map((size) => {
          const isDisabled = disabledSizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => !isDisabled && onSelectSize(size)}
              disabled={isDisabled}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                isDisabled
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  : selectedSize === size
                  ? "border-primary bg-primary text-white ring-primary"
                  : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-400"
              )}
              aria-label={`Select size ${size}`}
            >
              {size}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => { /* Implement View Chart logic here */ }}
        className="text-sm text-primary hover:underline"
      >
        View Chart
      </button>
    </div>
  );
}