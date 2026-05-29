import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSearchPopup } from "@/hooks/useSearchPopup";
import { usePredictiveSearch } from "@/hooks/usePredictiveSearch";
import { api } from "@/lib/api";
import { POPULAR_TAGS } from "@/constants/searchConstants";
import SearchInput from "./SearchInput";
import PopularTags from "./PopularTags";
import FeaturedProducts from "./FeaturedProducts";
import SearchResults from "./SearchResults";
import SkeletonResults from "./SkeletonResults";
import "./SearchPopup.css";

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchPopup: React.FC<SearchPopupProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { shouldRender, isClosing } = useSearchPopup(isOpen, onClose);
  const [query, setQuery] = useState("");
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [popularTags, setPopularTags] = useState<string[]>(POPULAR_TAGS);
  const { results, isLoading } = usePredictiveSearch(query);

  // Clear query when popup closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setQuery("");
      }, 240);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Fetch dynamic popular tags on open
  useEffect(() => {
    if (isOpen) {
      const fetchPopularTags = async () => {
        try {
          const data = await api.get("/popular-searches");
          if (Array.isArray(data)) {
            setPopularTags(data);
          } else {
            setPopularTags(POPULAR_TAGS);
          }
        } catch (error) {
          console.error("Failed to load popular searches:", error);
          setPopularTags(POPULAR_TAGS);
        }
      };
      fetchPopularTags();
    }
  }, [isOpen]);

  // Dynamic navbar height detection
  useEffect(() => {
    if (isOpen) {
      const header = document.querySelector("header");
      if (header) {
        setNavbarHeight(header.getBoundingClientRect().height);
      }
    }
  }, [isOpen]);

  const handleTagClick = (tag: string) => {
    setQuery(tag);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      onClose();
      navigate(`/collections/all?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!shouldRender) return null;

  const showResults = query.trim().length >= 2;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`sp-backdrop ${isClosing ? "closing" : ""}`}
        onClick={handleClose}
      />

      {/* Slide-down Popup Overlay */}
      <div
        className={`sp-overlay ${isClosing ? "closing" : ""}`}
        style={{ top: `${navbarHeight}px` }}
      >
        <div className="sp-container">
          {/* Search Input component */}
          <SearchInput
            value={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
            onSubmit={handleSearchSubmit}
            isOpen={isOpen}
          />

          {/* Search Content */}
          <div className="relative">
            {/* Default State: Popular Searches & Featured Products */}
            <div className={`sp-default-grid ${showResults ? "hidden" : ""}`}>
              <PopularTags onTagClick={handleTagClick} tags={popularTags} />
              <FeaturedProducts onProductClick={handleClose} />
            </div>

            {/* Results State: Live Search Results list or Loading Skeleton */}
            <div className={`sp-results-wrapper ${showResults ? "visible" : ""}`}>
              {showResults && (
                <>
                  {isLoading ? (
                    <SkeletonResults />
                  ) : (
                    <SearchResults
                      query={query}
                      results={results}
                      onResultClick={handleClose}
                      onSuggestionClick={handleTagClick}
                      tags={popularTags}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
export default SearchPopup;
