import { Box } from "@mui/material";

const Loader = ({ height = "100px", width = "100px", color = "#4527A4" }) => {
  return (
    <Box className="flex justify-center items-center h-screen max-h-full">
      <svg style={{ width, height }} xmlns="http://www.w3.org/2000/svg" x="0" y="0" version="1.1" viewBox="0 0 100 100" xmlSpace="preserve">
        <circle cx="50" cy="50" r="47" fill="none" stroke={color} strokeDasharray="14.2472,14.2472" strokeMiterlimit="15" strokeWidth="6">
          <animateTransform attributeName="transform" attributeType="XML" dur="5s" from="0 50 50" repeatCount="indefinite" to="360 50 50" type="rotate"></animateTransform>
        </circle>
        <g fill={color}>
          <path d="M30 35H35V65H30z">
            <animateTransform attributeName="transform" begin="0.1" dur="1s" repeatCount="indefinite" type="translate" values="0 5 ; 0 -5; 0 5"></animateTransform>
          </path>
          <path d="M40 35H45V65H40z">
            <animateTransform attributeName="transform" begin="0.2" dur="1s" repeatCount="indefinite" type="translate" values="0 5 ; 0 -5; 0 5"></animateTransform>
          </path>
          <path d="M50 35H55V65H50z">
            <animateTransform attributeName="transform" begin="0.3" dur="1s" repeatCount="indefinite" type="translate" values="0 5 ; 0 -5; 0 5"></animateTransform>
          </path>
          <path d="M60 35H65V65H60z">
            <animateTransform attributeName="transform" begin="0.4" dur="1s" repeatCount="indefinite" type="translate" values="0 5 ; 0 -5; 0 5"></animateTransform>
          </path>
          <path d="M70 35H75V65H70z">
            <animateTransform attributeName="transform" begin="0.5" dur="1s" repeatCount="indefinite" type="translate" values="0 5 ; 0 -5; 0 5"></animateTransform>
          </path>
        </g>
      </svg>
    </Box>
  );
};

export default Loader;
