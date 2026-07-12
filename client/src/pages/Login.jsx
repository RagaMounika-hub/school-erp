import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
localStorage.setItem("role", res.data.user.role);
localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Login");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "#f4f6f9" }}
    >
      <div className="card p-4 shadow" style={{ width: "380px" }}>
        <h2 className="text-center mb-4">School ERP Login</h2>

        <form onSubmit={login}>
          <input
            className="form-control mb-3"
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-control mb-3"
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;