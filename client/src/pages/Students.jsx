import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const role = localStorage.getItem("role");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    school: "",
  });

  useEffect(() => {
    loadStudents();
    loadSchools();
  }, []);

  const [schools, setSchools] = useState([]);

  const loadStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data);
  };

  const loadSchools = async () => {
    const res = await API.get("/schools");
    setSchools(res.data);
  };

  const addStudent = async (e) => {
  e.preventDefault();

  if (editingId) {
    await API.put(`/students/${editingId}`, {
      name: form.name,
      email: form.email,
      school: form.school,
    });

    setEditingId(null);
  } else {
    await API.post("/students", form);
  }

  setForm({
    name: "",
    email: "",
    password: "",
    school: "",
  });

  loadStudents();
};

  const deleteStudent = async (id) => {
    if (window.confirm("Delete this student?")) {
      await API.delete(`/students/${id}`);
      loadStudents();
    }
  };
  const editStudent = (student) => {
  setEditingId(student._id);

  setForm({
    name: student.name,
    email: student.email,
    password: "",
    school: student.school?._id || "",
  });
};
 const filteredStudents = students.filter((student) =>
  student.name.toLowerCase().includes(search.toLowerCase()) ||
  student.email.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">

          <h2>Students</h2>

          <form className="row g-3 mb-4" onSubmit={addStudent}>

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Name"
                value={form.name}
                onChange={(e)=>setForm({...form,name:e.target.value})}
              />
            </div>

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={(e)=>setForm({...form,email:e.target.value})}
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e)=>setForm({...form,password:e.target.value})}
              />
            </div>

            {role === "superadmin" && (
  <div className="col-md-2">
    <select
      className="form-select"
      value={form.school}
      onChange={(e) =>
        setForm({ ...form, school: e.target.value })
      }
    >
      <option value="">Select School</option>

      {schools.map((s) => (
        <option key={s._id} value={s._id}>
          {s.name}
        </option>
      ))}
    </select>
  </div>
)}

<div className="row mb-3">
  <div className="col-md-4">
    <input
      type="text"
      className="form-control"
      placeholder="Search by Name or Email"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
</div>

            <div className="col-md-2">
              <button className="btn btn-success w-100">
  {editingId ? "Update" : "Add"}
</button>
{editingId && (
  <div className="col-md-2">
    <button
      type="button"
      className="btn btn-secondary w-100"
      onClick={() => {
        setEditingId(null);

        setForm({
          name: "",
          email: "",
          password: "",
          school: "",
        });
      }}
    >
      Cancel
    </button>
  </div>
)}
            </div>

          </form>

          <table className="table table-bordered">

            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                {role === "superadmin" && <th>School</th>}
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.map((student)=>(
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  {role === "superadmin" && (
  <td>{student.school?.name || "No School Assigned"}</td>
)}
                  
                  <td>
  <button
    className="btn btn-primary btn-sm me-2"
    onClick={() => editStudent(student)}
  >
    Edit
  </button>

  <button
    className="btn btn-danger btn-sm"
    onClick={() => deleteStudent(student._id)}
  >
    Delete
  </button>
</td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}

export default Students;