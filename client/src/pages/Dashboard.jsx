import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardChart from "../components/DashboardChart";

import {
FaSchool,
FaChalkboardTeacher,
FaUserGraduate,
FaClipboardCheck
} from "react-icons/fa";

function Dashboard() {
  const [data, setData] = useState({});
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/dashboard",
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">

          <h2 className="mb-4">Dashboard</h2>

          <div className="row g-4">

            {/* SUPER ADMIN */}
            {role === "superadmin" && (
              <>
                <div className="col-md-3">
                  <div
className="card shadow border-0"
style={{
background:"#4e73df",
color:"white",
borderRadius:"15px"
}}
>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5>Total Schools</h5>
                      <h2>{data.totalSchools}</h2>
                      <FaSchool size={45} />
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                                 <div
className="card shadow border-0"
style={{
background:"#4e73df",
color:"white",
borderRadius:"15px"
}}
>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5>Teachers</h5>
                      <h2>{data.totalTeachers}</h2>
                      <FaChalkboardTeacher size={45} />
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                                              <div
className="card shadow border-0"
style={{
background:"#4e73df",
color:"white",
borderRadius:"15px"
}}
>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5>Students</h5>
                      <h2>{data.totalStudents}</h2>
                      <FaUserGraduate size={45} />
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                                              <div
className="card shadow border-0"
style={{
background:"#4e73df",
color:"white",
borderRadius:"15px"
}}
>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5>Today's Attendance</h5>
                      <h2>{data.todayAttendance}</h2>
                      <FaClipboardCheck size={45} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SCHOOL ADMIN */}
            {role === "schooladmin" && (
              <>
                <div className="col-md-3">
                                                               <div
className="card shadow border-0"
style={{
background:"#4e73df",
color:"white",
borderRadius:"15px"
}}
>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5>Teachers</h5>
                      <h2>{data.totalTeachers}</h2>
                      <FaChalkboardTeacher size={45} />
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                                                               <div
className="card shadow border-0"
style={{
background:"#4e73df",
color:"white",
borderRadius:"15px"
}}
>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5>Students</h5>
                      <h2>{data.totalStudents}</h2>
                      <FaUserGraduate size={45} />
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                                                               <div
className="card shadow border-0"
style={{
background:"#4e73df",
color:"white",
borderRadius:"15px"
}}
>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5>Teacher Present</h5>
                      <h2>{data.teacherPresent}</h2>
                      <FaClipboardCheck size={45} />
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                                                               <div
className="card shadow border-0"
style={{
background:"#4e73df",
color:"white",
borderRadius:"15px"
}}
>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5>Student Present</h5>
                      <h2>{data.studentPresent}</h2>
                      <FaClipboardCheck size={45} />
                    </div>
                  </div>
                </div>
                
              </>
            )}

          </div>
        </div>
        <div className="mt-4">
  <DashboardChart
    teachers={data.totalTeachers || 0}
    students={data.totalStudents || 0}
  />
</div>
      </div>
    </div>
  );
}

export default Dashboard;