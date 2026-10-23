import { useEffect, useState } from "react";
import api from "../api.js";
import JobCard from "../components/JobCard.jsx";

const types = ["", "Full-time", "Part-time", "Internship", "Contract"];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", location: "", type: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .get("/jobs", { params: filters })
        .then((res) => setJobs(res.data))
        .catch(() => setJobs([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const update = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <section>
      <div className="hero">
        <h1>Find work that fits the way you build.</h1>
        <p>Browse openings from companies hiring right now and apply in a minute.</p>
        <div className="search">
          <input
            name="q"
            value={filters.q}
            onChange={update}
            placeholder="Job title, company or skill"
          />
          <input
            name="location"
            value={filters.location}
            onChange={update}
            placeholder="Location"
          />
          <select name="type" value={filters.type} onChange={update}>
            {types.map((t) => (
              <option key={t} value={t}>
                {t || "All types"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="empty">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="empty">No jobs match your search. Try a different keyword.</p>
      ) : (
        <>
          <p className="count">{jobs.length} open positions</p>
          <div className="grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
