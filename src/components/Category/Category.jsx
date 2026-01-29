// eslint-disable-next-line no-unused-vars
import React from "react";
import Clue from "../Clue/Clue.jsx";
import "./Category.css";

const Category = ({ category }) => {
  const toTitleCase = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getFontSize = (text) => {
    if (text.length > 50) return "1.4rem";
    if (text.length > 30) return "1.8rem";
    return "2.4rem";
  };

  const title = toTitleCase(category.title);

  return (
    <div className="jeopardy-category">
      <h2 style={{ fontSize: getFontSize(title) }}>{title}</h2>
      {category.clues.map((clue, index) => (
        <Clue
          key={index}
          value={clue.value}
          clue={clue}
          categoryId={category.id}
          clueIndex={index}
        />
      ))}
    </div>
  );
};

export default Category;

