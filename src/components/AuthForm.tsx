import { useState } from "react";
import styles from "../styles/AuthForm.module.css";

interface Props {
  type: "login" | "register";
  onSubmit: (email: string, password: string) => void;
}

const AuthForm = ({ type, onSubmit }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(email, password);
      }}
    >
      <h2>{type === "login" ? "Login" : "Register"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{type === "login" ? "Login" : "Register"}</button>
    </form>
  );
};

export default AuthForm;
