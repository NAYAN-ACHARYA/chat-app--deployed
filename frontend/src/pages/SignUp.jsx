import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const goToLogin = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/signup", {
        username,
        email,
        password,
      });

      if (response.data.message === "OTP sent to your email") {
        alert("Check your email for the OTP");
        setShowOTP(true);
      }
    } catch (error) {
      setMessage(error.response.data.message || "Something went wrong");
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/verify-otp", { 
        email, username, password, otp 
      });

      if (response.data.message === "OTP verified") {
        alert("Account created successfully");
        navigate(`/HomePage?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      setMessage("Invalid OTP");
    }
  };

  return (
    <div className="container">
      <h2>{!showOTP ? "Create Your Chat Account" : "Verify OTP"}</h2>
      
      {!showOTP ? (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            type="text"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Email"
            type="email"
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
          <button type="submit">Create Account</button>
        </form>
      ) : (
        <form onSubmit={handleOTPSubmit}>
          <div className="otp-container">
            <input
              type="text"
              placeholder="Enter OTP"
              required
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className="error">{message}</div>
          <button type="submit">Verify OTP</button>
        </form>
      )}

      <div className="or">Or</div>
      <button className="btn-secondary" onClick={goToLogin}>Login</button>
    </div>
  );
}

export default SignUp;
