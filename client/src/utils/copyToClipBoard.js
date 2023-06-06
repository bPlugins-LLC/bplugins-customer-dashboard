const copyToClipBoard = (str) => {
  const input = document.createElement("input");
  input.value = str;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
};

export default copyToClipBoard;
