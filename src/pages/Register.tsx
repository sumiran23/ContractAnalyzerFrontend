import AuthForm from "../components/AuthForm";
import axios from "../services/customAxios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (email: string, password: string) => {
    try {
      await axios.post("/auth/register", { email, password });
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
};

export default Register;
