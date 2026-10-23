import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          HireNest
        </Link>
        <nav className="nav-links">
          <NavLink to="/">Jobs</NavLink>
          {user?.role === "employer" && <NavLink to="/post-job">Post a job</NavLink>}
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          {user ? (
            <>
              <span className="nav-user">{user.name}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <Link to="/register" className="btn btn-accent">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
