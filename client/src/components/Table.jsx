import React from "react";
import { motion } from "framer-motion";

const Table = ({ headers, data, rowRenderer }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-red-100">
          {headers.map((header, index) => (
            <th key={index} className="text-left py-3 px-4 text-gray-600">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="border-b border-red-50 hover:bg-red-50/50">
            {rowRenderer(item, index)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
