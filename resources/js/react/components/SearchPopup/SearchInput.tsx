import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { PLACEHOLDER_PHRASES } from "@/constants/searchConstants";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  isOpen: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  onSubmit,
  isOpen,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus when popup opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="sp-input-wrapper">
      <Search className="sp-input-icon-left" />
      <input
        ref={inputRef}
        type="text"
        className="sp-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Search products"
      />
      
      {/* Animated cycling placeholders in pure CSS */}
      {value === "" && (
        <div className="sp-placeholder-container">
          {PLACEHOLDER_PHRASES.map((phrase, idx) => (
            <span key={idx} className="sp-placeholder-span">
              {phrase}
            </span>
          ))}
        </div>
      )}

      {value !== "" && (
        <button
          type="button"
          onClick={onClear}
          className="sp-input-clear-right"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
export default SearchInput;
