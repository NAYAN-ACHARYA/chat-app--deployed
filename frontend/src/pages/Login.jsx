import React ,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';
import axios from 'axios';
function Login() {
  const navigate = useNavigate();
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[message,setMessage]=useState('');
  const goToSignUp = () => {
    navigate("/SignUp");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/api/login', {email, password });

      // Redirect to HomePage if login is successful
      setMessage(response.data.message);
      navigate(`/HomePage?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setMessage(`Invalid Credentials`);
    }
  };
  return (
    <div className="container">
      <div className="left">
        <img
    alt="Drone image"
    height="600"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm2gbl1B8S1Cz3yrmcPqVSPgOFEp8sDXaFIwKNoCd6NSWOfmVEVhpPBsSHortlZu0j_qE&usqp=CAU"
    width="450"
    style={{
      display: "block",
      margin: "auto",
      
    }}
  />

        <div className="text">
          <h1></h1>
          <p>Login to your account to process your UAV images.</p>
        </div>
      </div>
      <div className="right">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
        <input placeholder="Email..." type="text" onChange={(e)=>{setEmail(e.target.value)}}/>
        <input placeholder="Password..." type="password" onChange={(e)=>{setPassword(e.target.value)}} />
        <div className="error">{message}</div>
        <button className="btn btn-primary" type="submit">LOGIN</button>
        </form>
        <div className="or">Or</div>
        <button className="btn btn-secondary" onClick={goToSignUp}>
          CREATE ACCOUNT
        </button>
      </div>
    </div>
  );
}

export default Login;
