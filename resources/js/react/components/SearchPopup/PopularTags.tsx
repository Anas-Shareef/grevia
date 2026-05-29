import React from "react";
import { POPULAR_TAGS } from "@/constants/searchConstants";

interface PopularTagsProps {
  onTagClick: (tag: string) => void;
}

export const PopularTags: React.FC<PopularTagsProps> = ({ onTagClick }) => {
  return (
    <div>
      <h3 className="sp-section-title">Popular Searches</h3>
      <div className="sp-tags-container">
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            className="sp-tag-pill"
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
export default PopularTags;
