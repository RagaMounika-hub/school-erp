import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Schools() {
  const [schools, setSchools] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const res = await API.get("/schools");
      setSchools(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addSchool = async (e) => {
    e.preventDefault();

    try {
      await API.post("/schools", form);

      alert("School Added Successfully");

      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      loadSchools();

    } catch (err) {
      alert("Error adding school");
    }
  };

  const approveSchool = async (id) => {
    await API.put(`/schools/approve/${id}`);
    loadSchools();
  };

  return (
    <div className="d-flex">

      <Sidebar />

      <div className="flex-grow-1">

        <Navbar />

        <div className="container mt-4">

          <h2>Schools</h2>

          <form className="row g-3 mb-4" onSubmit={addSchool}>

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="School Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>

            <div className="col-md-2">
              <button className="btn btn-success w-100">
                Add School
              </button>
            </div>

          </form>

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {schools.map((school) => (

                <tr key={school._id}>

                  <td>{school.name}</td>

                  <td>{school.email}</td>

                  <td>{school.phone}</td>

                  <td>
                    <span
                      className={
                        school.status === "approved"
                          ? "badge bg-success"
                          : "badge bg-warning"
                      }
                    >
                      {school.status}
                    </span>
                  </td>

                  <td>

                    {school.status !== "approved" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          approveSchool(school._id)
                        }
                      >
                        Approve
                      </button>
                    )}

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

export default Schools;