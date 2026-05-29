import React from "react";

interface PopularTagsProps {
  onTagClick: (tag: string) => void;
  tags: string[];
}

export const PopularTags: React.FC<PopularTagsProps> = ({ onTagClick, tags }) => {
  return (
    <div>
      <h3 className="sp-section-title">Popular Searches</h3>
      <div className="sp-tags-container">
        {tags.map((tag) => (
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
