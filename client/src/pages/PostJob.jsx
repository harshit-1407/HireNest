import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api.js";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    skills: "",
    description: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/jobs", form);
      navigate(`/jobs/${res.data._id}`);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <form className="form-card wide" onSubmit={submit}>
      <h1>Post a job</h1>
      {error && <p className="error">{error}</p>}
      <label>Job title</label>
      <input name="title" value={form.title} onChange={update} required />
      <label>Company</label>
      <input name="company" value={form.company} onChange={update} required />
      <div className="row">
        <div>
          <label>Location</label>
          <input name="location" value={form.location} onChange={update} required />
        </div>
        <div>
          <label>Job type</label>
          <select name="type" value={form.type} onChange={update}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
        </div>
      </div>
      <label>Salary</label>
      <input
        name="salary"
        value={form.salary}
        onChange={update}
        placeholder="e.g. 6 LPA or 20k per month"
      />
      <label>Skills (comma separated)</label>
      <input
        name="skills"
        value={form.skills}
        onChange={update}
        placeholder="React, Node.js, MongoDB"
      />
      <label>Description</label>
      <textarea
        name="description"
        rows="7"
        value={form.description}
        onChange={update}
        required
      />
      <button className="btn btn-primary">Publish job</button>
    </form>
  );
}
