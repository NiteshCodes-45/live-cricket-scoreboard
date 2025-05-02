import React from "react";
import loaderImage from "/src/assets/score-cart-loader.png";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <img src={loaderImage} alt="Loading..." className="w-24 h-24" />
    </div>
  );
};

export default Loader;
