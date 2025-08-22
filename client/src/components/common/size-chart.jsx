import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";

// ======= TABLE COMPONENT =======
function SizeTable({ caption, columns, rows }) {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{caption}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-700 uppercase"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-gray-100 even:bg-gray-50/40">
                {r.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-3 text-sm text-gray-800 ${j === 0 ? "font-medium" : ""}`}
                  >
                    {cell || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
        Measurements in cm.
      </div>
    </div>
  );
}

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

// ======= MAIN COLLAPSIBLE =======
export default function SizeGuideCollapsible() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">Size Guide</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Collapsible Content */}
      {open && (
        <div className="mt-4 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <Tabs defaultValue="ladies" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="ladies">Ladies</TabsTrigger>
              <TabsTrigger value="kids-both">Girls & Boys (2–7)</TabsTrigger>
              <TabsTrigger value="girls">Girls (7–14)</TabsTrigger>
              <TabsTrigger value="boys">Boys (7–14)</TabsTrigger>
              <TabsTrigger value="men-pants">Mens Pants</TabsTrigger>
              <TabsTrigger value="men-tops">Mens Tops</TabsTrigger>
            </TabsList>

            <TabsContent value="ladies">
              <SizeTable caption="Ladies Size Chart" columns={ladiesColumns} rows={ladiesRows} />
            </TabsContent>
            <TabsContent value="kids-both">
              <SizeTable caption="Girls & Boys (2–7 yrs)" columns={kidsBothColumns} rows={kidsBothRows} />
            </TabsContent>
            <TabsContent value="girls">
              <SizeTable caption="Girls (7–14 yrs)" columns={girlsColumns} rows={girlsRows} />
            </TabsContent>
            <TabsContent value="boys">
              <SizeTable caption="Boys (7–14 yrs)" columns={boysColumns} rows={boysRows} />
            </TabsContent>
            <TabsContent value="men-pants">
              <SizeTable caption="Menswear – Pants" columns={menPantsColumns} rows={menPantsRows} />
            </TabsContent>
            <TabsContent value="men-tops">
              <SizeTable caption="Menswear – Tops" columns={menTopColumns} rows={menTopRows} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
