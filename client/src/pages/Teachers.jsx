import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
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
    loadTeachers();
    loadSchools();
  }, []);

  const [schools, setSchools] = useState([]);

  const loadTeachers = async () => {
    const res = await API.get("/teachers");
    setTeachers(res.data);
  };

  const loadSchools = async () => {
    const res = await API.get("/schools");
    setSchools(res.data);
  };

  const addTeacher = async (e) => {
  e.preventDefault();

  if (editingId) {
    await API.put(`/teachers/${editingId}`, {
      name: form.name,
      email: form.email,
      school: form.school,
    });

    setEditingId(null);
  } else {
    await API.post("/teachers", form);
  }

  setForm({
    name: "",
    email: "",
    password: "",
    school: "",
  });

  loadTeachers();
};

  const deleteTeacher = async (id) => {
    if (window.confirm("Delete this teacher?")) {
      await API.delete(`/teachers/${id}`);
      loadTeachers();
    }
  };
  const editTeacher = (teacher) => {
  setEditingId(teacher._id);

  setForm({
    name: teacher.name,
    email: teacher.email,
    password: "",
    school: teacher.school?._id || "",
  });
};

const filteredTeachers = teachers.filter((teacher) =>
  teacher.name.toLowerCase().includes(search.toLowerCase()) ||
  teacher.email.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">

          <h2>Teachers</h2>

          <form className="row g-3 mb-4" onSubmit={addTeacher}>

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

              {filteredTeachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  {role === "superadmin" && (
  <td>{teacher.school?.name || "No School Assigned"}</td>
)}
                  <td>
                    <td>
  <button
    className="btn btn-primary btn-sm me-2"
    onClick={() => editTeacher(teacher)}
  >
    Edit
  </button>

  <button
    className="btn btn-danger btn-sm"
    onClick={() => deleteTeacher(teacher._id)}
  >
    Delete
  </button>
</td>
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

export default Teachers;