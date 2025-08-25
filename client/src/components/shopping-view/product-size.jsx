// @/components/shopping-view/product-size.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'; // Assuming shadcn/ui Dialog components

// ======= SIZE DATA =======
const ladiesColumns = ["SIZE", "NUMERIC SIZE", "BUST", "WAIST", "HIP"];
const ladiesRows = [
  ["XS", "28", "80", "62", "93"],
  ["S", "30", "83", "65", "96"],
  ["", "32", "86", "68", "99"],
  ["M", "34", "89", "71", "102"],
  ["", "36", "94", "76", "107"],
  ["L", "38", "99", "81", "112"],
  ["", "40", "104", "87", "118"],
  ["XL", "42", "112", "93", "124"],
  ["", "44", "116", "99", "130"],
  ["2XL", "46", "122", "105", "136"],
  ["", "48", "128", "111", "142"],
];

const kidsBothColumns = ["SIZE", "HEIGHT", "CHEST", "WAIST", "HIP"];
const kidsBothRows = [
  ["2-3 yrs", "85-89", "52-54", "51-52", "54-57"],
  ["3-4 yrs", "90-97", "54-56", "52-53", "57-60"],
  ["4-5 yrs", "98-104", "56-58", "53-54", "60-62"],
  ["5-6 yrs", "105-111", "58-60", "54-55", "63-66"],
  ["6-7 yrs", "112-116", "60-62", "55-56", "66-69"],
];

const girlsColumns = ["SIZE", "HEIGHT", "CHEST", "WAIST", "HIP"];
const girlsRows = [
  ["7-8 yrs", "117-123", "62-66", "56-57.5", "69-73"],
  ["9-10 yrs", "124-134", "67-72.5", "58-60", "73-79"],
  ["11-12 yrs", "140-145", "73-77", "61-63", "80-86"],
  ["13-14 yrs", "151-160", "78-82", "63.5-65", "87-90"],
];

const boysColumns = ["SIZE", "HEIGHT", "CHEST", "WAIST", "HIP"];
const boysRows = [
  ["7-8 yrs", "116-122", "62-46", "56-58", "68-70"],
  ["9-10 yrs", "122-135", "67-69", "60-62", "72-75"],
  ["11-12 yrs", "140-145", "72-75", "64-66", "79-83"],
  ["13-14 yrs", "151-160", "79-86", "68-71", "86-89"],
];

const menPantsColumns = ["NUMERIC SIZE", "WAIST"];
const menPantsRows = [
  ["28", "71"],
  ["29", "73.5"],
  ["30", "76"],
  ["31", "78.5"],
  ["32", "81"],
  ["33", "83.5"],
  ["34", "86"],
  ["36", "91"],
  ["38", "97"],
  ["40", "102"],
  ["42", "107"],
  ["44", "112"],
];

const menTopColumns = ["SIZE", "CHEST"];
const menTopRows = [
  ["XS", "86-91"],
  ["S", "91-96"],
  ["M", "97-102"],
  ["L", "102-107"],
  ["XL", "107-112"],
  ["2XL", "112-117"],
];

// Helper component to render a size table
const SizeTable = ({ title, columns, rows }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
      <table className="w-full text-left text-gray-700 bg-white">
        <thead className="text-sm uppercase bg-gray-100">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col" className="px-6 py-3 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b last:border-0 hover:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 text-sm whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


const ProductSizeSelector = ({ 
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'], // Default sizes
  onSizeSelect, // Callback when a size is selected
  selectedSize, // Currently selected size (for controlled component)
}) => {
  // If selectedSize is not provided as a prop, manage it internally
  const [internalSelectedSize, setInternalSelectedSize] = useState(selectedSize || '');

  // Determine which size state to use
  const currentSelectedSize = selectedSize !== undefined ? selectedSize : internalSelectedSize;
  const setCurrentSelectedSize = (size) => {
    if (selectedSize === undefined) { // Only update internal state if not controlled by prop
      setInternalSelectedSize(size);
    }
    onSizeSelect?.(size); // Call the prop callback
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Size selection buttons */}
      <div className="flex flex-wrap gap-2">
        {availableSizes.map((size) => (
          <Button
            key={size}
            variant={currentSelectedSize === size ? 'default' : 'outline'}
            onClick={() => setCurrentSelectedSize(size)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 
                        ${currentSelectedSize === size ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
          >
            {size}
          </Button>
        ))}
      </div>

      {/* Size Chart Link/Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="link" 
            className="text-blue-600 hover:text-blue-800 p-0 h-auto self-start"
          >
            Size Chart Reference
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">Size Chart</DialogTitle>
            <DialogDescription className="text-gray-600 text-base">
              Find the perfect fit using our detailed size guides below. All measurements are in centimeters (cm).
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-8 space-y-10">
            <SizeTable title="Ladies - Tops & Dresses" columns={ladiesColumns} rows={ladiesRows} />
            <SizeTable title="Kids (Both Genders) - Age 2-7" columns={kidsBothColumns} rows={kidsBothRows} />
            <SizeTable title="Girls - Age 7-14" columns={girlsColumns} rows={girlsRows} />
            <SizeTable title="Boys - Age 7-14" columns={boysColumns} rows={boysRows} />
            <SizeTable title="Men - Pants" columns={menPantsColumns} rows={menPantsRows} />
            <SizeTable title="Men - Tops" columns={menTopColumns} rows={menTopRows} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductSizeSelector;