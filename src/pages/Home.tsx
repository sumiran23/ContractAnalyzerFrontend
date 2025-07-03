import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Welcome to ContractAnalyzer</h1>
      <p
        style={{
          fontFamily: "Segoe UI, Arial, sans-serif",
          fontSize: "1.25rem",
          color: "#444",
          margin: "1.5rem 0",
        }}
      >
        Upload, summarize, and chat with your legal contracts using AI.
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginTop: "2rem",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
          alt="Legal contract"
          style={{
            width: 400,
            height: 400,
            objectFit: "cover",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80"
          alt="Signed document"
          style={{
            width: 400,
            height: 400,
            objectFit: "cover",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
          alt="Law books"
          style={{
            width: 400,
            height: 400,
            objectFit: "cover",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
