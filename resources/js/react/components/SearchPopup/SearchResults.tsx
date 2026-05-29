import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/data/products";

interface SearchResultsProps {
  query: string;
  results: Product[];
  onResultClick: () => void;
  onSuggestionClick: (tag: string) => void;
  tags: string[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  onResultClick,
  onSuggestionClick,
  tags,
}) => {
  const showNoResults = results.length === 0;

  if (showNoResults) {
    const suggestions = tags.slice(0, 3);
    return (
      <div className="sp-no-results">
        <p className="sp-no-results-text">
          Nothing found for "{query}". Try:
        </p>
        <div className="sp-no-results-suggestions">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              className="sp-tag-pill"
              style={{ fontSize: "11px", padding: "6px 12px" }}
              onClick={() => onSuggestionClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ul className="sp-results-list" role="listbox">
        {results.map((product) => (
          <li key={product.id} role="option">
            <Link
              to={`/products/${product.slug || product.id}`}
              className="sp-result-row"
              onClick={onResultClick}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="sp-result-thumbnail"
                />
              ) : (
                <div className="sp-result-thumbnail bg-[#2D6A4F] flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider">
                  Grevia
                </div>
              )}
              <span className="sp-result-title">{product.name}</span>
              <span className="sp-result-price">₹{product.price}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to={`/collections/all?search=${encodeURIComponent(query)}`}
        className="sp-view-all-link"
        onClick={onResultClick}
      >
        View all results for "{query}" →
      </Link>
    </div>
  );
};
export default SearchResults;
