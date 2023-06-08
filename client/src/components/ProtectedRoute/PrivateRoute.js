import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ requiredRole = "customer", children }) => {
  const { activeRole, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (requiredRole !== activeRole) {
      navigate("/");
    }
  }, [user, navigate, requiredRole, activeRole]);

  return children;
};

export default PrivateRoute;
