import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css"; // Using the same CSS as SignUp
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const goToSignUp = () => {
    navigate("/SignUp");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        email,
        password,
      });

      // Redirect to HomePage if login is successful
      setMessage(response.data.message);
      navigate(`/HomePage?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setMessage(`Invalid Credentials`);
    }
  };

  return (
    <div className="container">
      <h2>Welcome Back</h2>
      <p>Log in to chat and process your UAV images.</p>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          type="text"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="error">{message}</div>
        <button type="submit">LOGIN</button>
      </form>
      <div className="or">Or</div>
      <button className="btn-secondary" onClick={goToSignUp}>
        CREATE ACCOUNT
      </button>
    </div>
  );
}

export default Login;
