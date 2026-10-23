import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errorMessage } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  const apply = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post(`/applications/${id}`, { coverLetter });
      setApplied(true);
      setMessage("Application sent. Track it from your dashboard.");
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  if (error) return <p className="empty">{error}</p>;
  if (!job) return <p className="empty">Loading...</p>;

  return (
    <article className="detail">
      <Link to="/" className="back">
        Back to jobs
      </Link>
      <div className="detail-head">
        <div>
          <h1>{job.title}</h1>
          <p className="job-company">{job.company}</p>
          <p className="job-meta">
            {job.location} &middot; {job.type}
            {job.salary ? ` · ${job.salary}` : ""}
          </p>
        </div>
      </div>

      {job.skills.length > 0 && (
        <div className="skills">
          {job.skills.map((skill) => (
            <span key={skill} className="chip">
              {skill}
            </span>
          ))}
        </div>
      )}

      <h2>About the role</h2>
      <p className="description">{job.description}</p>

      <div className="panel">
        {!user && (
          <p>
            <Link to="/login">Log in</Link> as a job seeker to apply for this role.
          </p>
        )}
        {user?.role === "employer" && (
          <p>Employer accounts cannot apply to jobs.</p>
        )}
        {user?.role === "seeker" && !applied && (
          <form onSubmit={apply}>
            <h2>Apply for this job</h2>
            <label>Cover letter</label>
            <textarea
              rows="5"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell them why you are a good fit"
            />
            <button className="btn btn-primary">Submit application</button>
          </form>
        )}
        {message && <p className="notice">{message}</p>}
      </div>
    </article>
  );
}
