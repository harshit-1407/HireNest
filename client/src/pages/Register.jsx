import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker",
  });
  const [error, setError] = useState("");
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      saveSession(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <h1>Create account</h1>
      {error && <p className="error">{error}</p>}
      <label>Full name</label>
      <input name="name" value={form.name} onChange={update} required />
      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={update} required />
      <label>Password</label>
      <input
        name="password"
        type="password"
        minLength="6"
        value={form.password}
        onChange={update}
        required
      />
      <label>I am a</label>
      <select name="role" value={form.role} onChange={update}>
        <option value="seeker">Job seeker</option>
        <option value="employer">Employer</option>
      </select>
      <button className="btn btn-primary">Sign up</button>
      <p className="form-foot">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
