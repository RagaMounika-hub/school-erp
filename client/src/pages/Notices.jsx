import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const role = localStorage.getItem("role");

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const res = await API.get("/notices");
      setNotices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addNotice = async (e) => {
  e.preventDefault();

  try {
    if (editingId) {
      await API.put(`/notices/${editingId}`, form);
      alert("Notice Updated Successfully");
      setEditingId(null);
    } else {
      await API.post("/notices", form);
      alert("Notice Added Successfully");
    }

    setForm({
      title: "",
      description: "",
    });

    loadNotices();

  } catch (err) {
    console.log(err);
  }
};

const editNotice = (notice) => {
  setEditingId(notice._id);

  setForm({
    title: notice.title,
    description: notice.description,
  });
};

const deleteNotice = async (id) => {
  if (!window.confirm("Delete this notice?")) return;

  try {
    await API.delete(`/notices/${id}`);

    alert("Notice Deleted Successfully");

    loadNotices();
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Navbar />

        <div className="container mt-4">

          <h2 className="mb-4">Notice Board</h2>

          {(role === "superadmin" || role === "schooladmin") && (
            <div className="card shadow p-3 mb-4">

              <h4>Add Notice</h4>

              <form onSubmit={addNotice}>

                <input
                  className="form-control mb-3"
                  placeholder="Notice Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />

                <textarea
                  className="form-control mb-3"
                  rows="4"
                  placeholder="Notice Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />

                <button className="btn btn-primary">
  {editingId ? "Update Notice" : "Add Notice"}
</button>

              </form>

            </div>
          )}

          <div className="card shadow p-3">

            <h4>All Notices</h4>

            <table className="table table-bordered">

              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>School</th>
                  <th>Posted By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {notices.map((notice) => (
                  <tr key={notice._id}>
  <td>{notice.title}</td>
  <td>{notice.description}</td>
  <td>{notice.school?.name || "All Schools"}</td>
  <td>{notice.createdBy?.name}</td>

  <td>
    {new Date(notice.createdAt).toLocaleDateString()}
  </td>

  <td>
    {(role === "superadmin" || role === "schooladmin") && (
      <>
        <button
          className="btn btn-warning btn-sm me-2"
          onClick={() => editNotice(notice)}
        >
          Edit
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => deleteNotice(notice._id)}
        >
          Delete
        </button>
      </>
    )}
  </td>
</tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Notices;