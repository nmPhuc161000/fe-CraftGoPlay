import React, { useState } from "react";

const DropdownSection = ({
  title,
  isOpen,
  toggle,
  items = [],
  expandable = false,
  onSelect,
  onParentSelect,
}) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="mb-3">
      <div
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={toggle}
      >
        <span className="font-bold text-base">{title}</span>
        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f3e7db] text-[#5e3a1e] hover:bg-[#e4cdb5] transition-colors duration-300">
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul className="pl-3 space-y-2 text-sm">
          {items.map((item, idx) =>
            typeof item === "string" ? (
              <li
                key={idx}
                className="cursor-pointer hover:text-[#5e3a1e]"
                onClick={() => onSelect?.(item)}
              >
                {item}
              </li>
            ) : (
              <li key={idx}>
                <div
                  className="flex justify-between items-center cursor-pointer hover:text-[#5e3a1e]"
                  onClick={() => {
                    toggleItem(item.label);
                    if (onParentSelect && item.children) {
                      const subNames = item.children.map((child) => child.value);
                      onParentSelect(subNames);
                    }
                  }}
                >
                  <span>{item.label}</span>
                  <svg
                    className={`w-3 h-3 ml-2 transition-transform duration-300 ${expandedItems[item.label] ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expandedItems[item.label] && (
                  <ul className="pl-4 mt-1 space-y-1 text-sm text-[#5e3a1e]">
                    {item.children?.map((child, i) => (
                      <li
                        key={i}
                        className="cursor-pointer hover:text-[#5e3a1e]"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect?.(child.value);
                        }}
                      >
                        {child.label}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownSection;
