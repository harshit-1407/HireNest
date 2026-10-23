import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  const posted = new Date(job.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <Link to={`/jobs/${job._id}`} className="job-card">
      <div className="job-card-top">
        <h3>{job.title}</h3>
        <span className="tag">{job.type}</span>
      </div>
      <p className="job-company">{job.company}</p>
      <p className="job-meta">
        {job.location}
        {job.salary ? `, ${job.salary}` : ""}
      </p>
      {job.skills.length > 0 && (
        <div className="skills">
          {job.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="chip">
              {skill}
            </span>
          ))}
        </div>
      )}
      <p className="job-date">Posted {posted}</p>
    </Link>
  );
}
