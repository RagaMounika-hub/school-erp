import { Link } from "react-router-dom";
import {
  FaHome,
  FaSchool,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaClipboardCheck,
  FaSignOutAlt,
  FaBullhorn,
} from "react-icons/fa";

function Sidebar() {
  const role = localStorage.getItem("role");
  
  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        minHeight: "100vh",
      }}
    >
      <h3 className="text-center mb-4">School ERP</h3>

      <ul className="nav flex-column">

        <li className="nav-item mb-3">
          <Link className="nav-link text-white" to="/dashboard">
            <FaHome /> Dashboard
          </Link>
        </li>

        {/* Super Admin */}
{role === "superadmin" && (
  <>
    <li className="nav-item mb-3">
      <Link className="nav-link text-white" to="/schools">
        <FaSchool /> Schools
      </Link>
    </li>

    <li className="nav-item mb-3">
      <Link className="nav-link text-white" to="/teachers">
        <FaChalkboardTeacher /> Teachers
      </Link>
    </li>

    <li className="nav-item mb-3">
      <Link className="nav-link text-white" to="/students">
        <FaUserGraduate /> Students
      </Link>
    </li>

    <li className="nav-item mb-3">
      <Link className="nav-link text-white" to="/attendance">
        <FaClipboardCheck /> Attendance
      </Link>
    </li>
    <li className="nav-item mb-3">
  <Link className="nav-link text-white" to="/notices">
    <FaBullhorn /> Notice Board
  </Link>
</li>
  </>
)}

{/* School Admin */}
{role === "schooladmin" && (
  <>
    <li className="nav-item mb-3">
      <Link className="nav-link text-white" to="/teachers">
        <FaChalkboardTeacher /> Teachers
      </Link>
    </li>

    <li className="nav-item mb-3">
      <Link className="nav-link text-white" to="/students">
        <FaUserGraduate /> Students
      </Link>
    </li>

    <li className="nav-item mb-3">
      <Link className="nav-link text-white" to="/attendance">
        <FaClipboardCheck /> Attendance
      </Link>
    </li>

    <li className="nav-item mb-3">
      <Link className="nav-link text-white" to="/leave">
        📝 Leave Requests
      </Link>
    </li>
    <li className="nav-item mb-3">
  <Link className="nav-link text-white" to="/notices">
    <FaBullhorn /> Notice Board
  </Link>
</li>
  </>
)}

{/* Teacher */}
{role === "teacher" && (
  <>
    

    <li className="nav-item mb-3">
      <Link className="nav-link text-white" to="/leave">
        📝 Leave
      </Link>
    </li>
    <li className="nav-item mb-3">
      <Link className="nav-link text-white" to="/notices">
        <FaBullhorn /> Notice Board
      </Link>
    </li>
  </>
)}

{role === "student" && (
  <>
  

    <li className="nav-item mb-3">
      <Link className="nav-link text-white" to="/notices">
        <FaBullhorn /> Notice Board
      </Link>
    </li>
  </>
)}

        <li className="nav-item mb-3">
  <Link className="nav-link text-white" to="/profile">
    👤 Profile
  </Link>
</li>

        <li className="nav-item mt-5">
          <button
            className="btn btn-danger w-100"
            onClick={() => {
              localStorage.clear();
              window.location = "/";
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </li>

        

      </ul>
    </div>
  );
}

export default Sidebar;