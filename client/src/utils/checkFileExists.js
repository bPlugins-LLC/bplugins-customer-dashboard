const checkFileExists = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl, {
      method: "HEAD",
    });
    return response.ok; // Returns true if the file exists and the status is within 200-299 range
  } catch (error) {
    // console.error("Error checking file existence:", error);
    return false;
  }
};

export default checkFileExists;
