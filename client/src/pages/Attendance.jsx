import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Attendance() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState("");
const [status, setStatus] = useState("");
const [type, setType] = useState("");


  const [teacherForm, setTeacherForm] = useState({
    teacher: "",
    status: "Present",
  });

  const [studentForm, setStudentForm] = useState({
    student: "",
    status: "Present",
  });

  useEffect(() => {
    loadTeachers();
    loadStudents();
    loadAttendance();
  }, []);

  const loadTeachers = async () => {
    try {
      const res = await API.get("/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAttendance = async () => {
    try {
      const res = await API.get("/attendance");
      setAttendance(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const markTeacherAttendance = async (e) => {
    e.preventDefault();

    try {
      await API.post("/attendance", teacherForm);

      alert("Teacher Attendance Marked");

      setTeacherForm({
        teacher: "",
        status: "Present",
      });

      loadAttendance();
    } catch (err) {
      console.log(err);
    }
  };

  const markStudentAttendance = async (e) => {
    e.preventDefault();

    try {
      await API.post("/attendance", studentForm);

      alert("Student Attendance Marked");

      setStudentForm({
        student: "",
        status: "Present",
      });

      loadAttendance();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredAttendance = attendance.filter((item) => {

  const matchDate =
    !date ||
    new Date(item.createdAt).toISOString().split("T")[0] === date;

  const matchStatus =
    !status || item.status === status;

  const matchType =
    !type ||
    (type === "teacher" && item.teacher) ||
    (type === "student" && item.student);

  return matchDate && matchStatus && matchType;

});
const exportStudentAttendance = () => {
  const data = filteredAttendance
    .filter((item) => item.student)
    .map((item) => ({
      Student: item.student?.name,
      Status: item.status,
      Date: new Date(item.createdAt).toLocaleDateString(),
    }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  XLSX.writeFile(workbook, "Student_Attendance.xlsx");
};
const exportTeacherAttendance = () => {
  const data = filteredAttendance
    .filter((item) => item.teacher)
    .map((item) => ({
      Teacher: item.teacher?.name,
      Status: item.status,
      Date: new Date(item.createdAt).toLocaleDateString(),
    }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");

  XLSX.writeFile(workbook, "Teacher_Attendance.xlsx");
};

const exportStudentPDF = () => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text("SCHOOL ERP SYSTEM", 105, 15, { align: "center" });

  doc.setFontSize(15);
  doc.setTextColor(0, 0, 0);
  doc.text("Student Attendance Report", 105, 25, { align: "center" });

  // Date
  doc.setFontSize(11);
  doc.text(
    "Generated On: " + new Date().toLocaleString(),
    14,
    35
  );

  const tableData = filteredAttendance
    .filter((item) => item.student)
    .map((item, index) => [
      index + 1,
      item.student?.name,
      item.status,
      new Date(item.createdAt).toLocaleDateString(),
    ]);

  autoTable(doc, {
    startY: 42,
    head: [["S.No", "Student", "Status", "Date"]],
    body: tableData,
    headStyles: {
      fillColor: [52, 73, 94],
      textColor: 255,
      halign: "center",
    },
    bodyStyles: {
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save("Student_Attendance_Report.pdf");
};

const exportTeacherPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text("SCHOOL ERP SYSTEM", 105, 15, { align: "center" });

  doc.setFontSize(15);
  doc.setTextColor(0, 0, 0);
  doc.text("Teacher Attendance Report", 105, 25, { align: "center" });

  doc.setFontSize(11);
  doc.text(
    "Generated On: " + new Date().toLocaleString(),
    14,
    35
  );

  const tableData = filteredAttendance
    .filter((item) => item.teacher)
    .map((item, index) => [
      index + 1,
      item.teacher?.name,
      item.status,
      new Date(item.createdAt).toLocaleDateString(),
    ]);

  autoTable(doc, {
    startY: 42,
    head: [["S.No", "Teacher", "Status", "Date"]],
    body: tableData,
    headStyles: {
      fillColor: [52, 73, 94],
      textColor: 255,
      halign: "center",
    },
    bodyStyles: {
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save("Teacher_Attendance_Report.pdf");
};

const exportAttendance = () => {
  const data = filteredAttendance.map((item) => ({
    Name: item.teacher?.name || item.student?.name,
    Type: item.teacher ? "Teacher" : "Student",
    Status: item.status,
    Date: new Date(item.createdAt).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Attendance"
  );

  XLSX.writeFile(workbook, "Attendance_Report.xlsx");
};

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">

          <h2 className="mb-4">Attendance Management</h2>

          <div className="card shadow p-3 mb-4">
            

            <h4>Student Attendance</h4>

            <form className="row g-3" onSubmit={markStudentAttendance}>

              <div className="col-md-4">
                <select
                  className="form-select"
                  value={studentForm.student}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      student: e.target.value,
                    })
                  }
                >
                  <option value="">Select Student</option>

                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={studentForm.status}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      status: e.target.value,
                    })
                  }
                >
                  <option>Present</option>
                  <option>Absent</option>
                </select>
              </div>

              <div className="col-md-3">
                <button className="btn btn-success w-100">
                  Mark Student Attendance
                </button>
              </div>

            </form>

          </div>

          {["superadmin", "schooladmin"].includes(localStorage.getItem("role")) && (
  <div className="card shadow p-3 mb-4">

    <h4>Teacher Attendance</h4>

    <form className="row g-3" onSubmit={markTeacherAttendance}>

      <div className="col-md-4">
        <select
          className="form-select"
          value={teacherForm.teacher}
          onChange={(e) =>
            setTeacherForm({
              ...teacherForm,
              teacher: e.target.value,
            })
          }
        >
          <option value="">Select Teacher</option>

          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3">
        <select
          className="form-select"
          value={teacherForm.status}
          onChange={(e) =>
            setTeacherForm({
              ...teacherForm,
              status: e.target.value,
            })
          }
        >
          <option>Present</option>
          <option>Absent</option>
        </select>
      </div>

      <div className="col-md-3">
        <button className="btn btn-primary w-100">
          Mark Teacher Attendance
        </button>
      </div>

    </form>

  </div>
)}
                    <div className="card shadow p-3 mb-4">
                      <button
  className="btn btn-success mb-3"
  onClick={exportStudentAttendance}
>
  Export Student Attendance
</button>
<button
  className="btn btn-danger mb-3 ms-2"
  onClick={exportStudentPDF}
>
  Export Student PDF
</button>

            <h4>Student Attendance Records</h4>
            <div className="row mb-3">

  <div className="col-md-3">
    <input
      type="date"
      className="form-control"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  </div>

  <div className="col-md-3">
    <select
      className="form-select"
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    >
      <option value="">All Status</option>
      <option value="Present">Present</option>
      <option value="Absent">Absent</option>
    </select>
  </div>

  <div className="col-md-3">
    <select
      className="form-select"
      value={type}
      onChange={(e) => setType(e.target.value)}
    >
      <option value="">All</option>
      <option value="teacher">Teachers</option>
      <option value="student">Students</option>
    </select>
  </div>

</div>

            <table className="table table-bordered table-hover">

              <thead className="table-dark">
                <tr>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {filteredAttendance
                  .filter((item) => item.student)
                  .map((item) => (
                    <tr key={item._id}>
                      <td>{item.student?.name}</td>

                      <td>
                        <span
                          className={
                            item.status === "Present"
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}

              </tbody>

            </table>

          </div>

          {["superadmin", "schooladmin"].includes(localStorage.getItem("role")) && (
  <div className="card shadow p-3">

    <button
      className="btn btn-primary mb-3"
      onClick={exportTeacherAttendance}
    >
      Export Teacher Attendance
    </button>

    <button
      className="btn btn-danger mb-3 ms-2"
      onClick={exportTeacherPDF}
    >
      Export Teacher PDF
    </button>

    <h4>Teacher Attendance Records</h4>

    <table className="table table-bordered table-hover">

      <thead className="table-dark">
        <tr>
          <th>Teacher</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {filteredAttendance
          .filter((item) => item.teacher)
          .map((item) => (
            <tr key={item._id}>
              <td>{item.teacher?.name}</td>

              <td>
                <span
                  className={
                    item.status === "Present"
                      ? "badge bg-success"
                      : "badge bg-danger"
                  }
                >
                  {item.status}
                </span>
              </td>

              <td>
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
      </tbody>

    </table>

  </div>
)}

        </div>

      </div>

    </div>
  );
}

export default Attendance;