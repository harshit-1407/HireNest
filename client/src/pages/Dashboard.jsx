import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

function SeekerDashboard() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/applications/mine")
      .then((res) => setApps(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="empty">Loading...</p>;

  return (
    <section>
      <h1>My applications</h1>
      {apps.length === 0 ? (
        <p className="empty">
          You have not applied anywhere yet. <Link to="/">Browse jobs</Link>
        </p>
      ) : (
        <div className="list">
          {apps.map((app) => (
            <div key={app._id} className="list-item">
              <div>
                <Link to={`/jobs/${app.job._id}`} className="item-title">
                  {app.job.title}
                </Link>
                <p className="job-meta">
                  {app.job.company}, {app.job.location}
                </p>
              </div>
              <span className={`status ${app.status}`}>{app.status}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openJob, setOpenJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState("");

  const loadJobs = () =>
    api
      .get("/jobs/mine/list")
      .then((res) => setJobs(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    loadJobs();
  }, []);

  const toggleApplicants = async (jobId) => {
    if (openJob === jobId) {
      setOpenJob(null);
      return;
    }
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplicants(res.data);
      setOpenJob(jobId);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const changeStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApplicants(
        applicants.map((a) => (a._id === appId ? { ...a, status } : a))
      );
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const removeJob = async (jobId) => {
    if (!window.confirm("Delete this job and all its applications?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      if (openJob === jobId) setOpenJob(null);
      loadJobs();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  if (loading) return <p className="empty">Loading...</p>;

  return (
    <section>
      <div className="section-head">
        <h1>My job posts</h1>
        <Link to="/post-job" className="btn btn-accent">
          Post a job
        </Link>
      </div>
      {error && <p className="error">{error}</p>}
      {jobs.length === 0 ? (
        <p className="empty">You have not posted any jobs yet.</p>
      ) : (
        <div className="list">
          {jobs.map((job) => (
            <div key={job._id} className="list-block">
              <div className="list-item">
                <div>
                  <Link to={`/jobs/${job._id}`} className="item-title">
                    {job.title}
                  </Link>
                  <p className="job-meta">
                    {job.company}, {job.location}
                  </p>
                </div>
                <div className="actions">
                  <button className="btn btn-ghost" onClick={() => toggleApplicants(job._id)}>
                    {openJob === job._id ? "Hide applicants" : "View applicants"}
                  </button>
                  <button className="btn btn-danger" onClick={() => removeJob(job._id)}>
                    Delete
                  </button>
                </div>
              </div>
              {openJob === job._id && (
                <div className="applicants">
                  {applicants.length === 0 ? (
                    <p className="empty small">No applications yet.</p>
                  ) : (
                    applicants.map((a) => (
                      <div key={a._id} className="applicant">
                        <div>
                          <strong>{a.applicant.name}</strong>
                          <p className="job-meta">{a.applicant.email}</p>
                          {a.coverLetter && <p className="cover">{a.coverLetter}</p>}
                        </div>
                        <select
                          value={a.status}
                          onChange={(e) => changeStatus(a._id, e.target.value)}
                          className={`status-select ${a.status}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  return user.role === "employer" ? <EmployerDashboard /> : <SeekerDashboard />;
}
