import React from "react";

const SimpleLoader = ({ width = 10 }) => {
  return <span className="loader" style={{ width: `${width}px`, height: `${width}px`, borderWidth: `${width / 5}px`, borderTopWidth: `${width / 5}px` }}></span>;
};

export default SimpleLoader;
