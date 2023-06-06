const getLicenseQuantity = (variant) => {
  const variants = {
    "(Single Site)": 1,
    "Single Site ": 1,
    "(3 Sites)": 3,
    "( 3 Sites)": 3,
    "3 Sites": 3,
    "3 Sites License": 3,
    "(5 Sites)": 5,
    "5 Sties": 5,
    "(Developer  - Unlimited)": 1000,
    "Developer / Unlimited sites": 1000,
    "(Developer)": 1000,
    "Developer/Agency License - Unlimited Site": 1000,
  };
  return variants[variant] || 1;
};

export default getLicenseQuantity;
