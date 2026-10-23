import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      saveSession(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <h1>Log in</h1>
      {error && <p className="error">{error}</p>}
      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={update} required />
      <label>Password</label>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={update}
        required
      />
      <button className="btn btn-primary">Log in</button>
      <p className="form-foot">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </form>
  );
}
