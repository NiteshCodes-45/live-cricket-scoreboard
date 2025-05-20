import React from "react";
import loaderImage from "/src/assets/score-cart-loader.png";

const Loader = ({ isLoading }) => {
  return (
    <div
      className={`flex justify-center items-center min-h-screen bg-white transition-opacity duration-1000 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <img src={loaderImage} alt="Loading..." className="w-24 h-24" />
    </div>
  );
};

export default Loader;
