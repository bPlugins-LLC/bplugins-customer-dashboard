import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ requiredRole = "customer", children }) => {
  const { activeRole, user, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
    if (!loading && requiredRole !== activeRole) {
      navigate("/");
    }
  }, [user, navigate, requiredRole, activeRole, loading]);

  return children;
};

export default PrivateRoute;
