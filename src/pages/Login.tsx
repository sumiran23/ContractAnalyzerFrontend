import AuthForm from "../components/AuthForm";
import axios from "../services/customAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userEmail", email);
      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Login failed:", error);
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
};

export default Login;
