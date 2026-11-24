import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Leave() {
  const role = localStorage.getItem("role");

  const [leaveForm, setLeaveForm] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      const res = await API.get("/leaves");
      setLeaves(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const applyLeave = async (e) => {
    e.preventDefault();

    try {
      await API.post("/leaves", leaveForm);

      alert("Leave Applied Successfully");

      setLeaveForm({
        fromDate: "",
        toDate: "",
        reason: "",
      });

      loadLeaves();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/leaves/${id}`, { status });

      alert("Leave Status Updated");

      loadLeaves();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="d-flex">

      <Sidebar />

      <div className="flex-grow-1">

        <Navbar />

        <div className="container mt-4">

          <h2 className="mb-4">Leave Management</h2>

          {role === "teacher" && (
            <div className="card shadow p-4 mb-4">

              <h4>Apply Leave</h4>

              <form onSubmit={applyLeave}>

                <div className="mb-3">
                  <label>From Date</label>

                  <input
                    type="date"
                    className="form-control"
                    value={leaveForm.fromDate}
                    onChange={(e) =>
                      setLeaveForm({
                        ...leaveForm,
                        fromDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>To Date</label>

                  <input
                    type="date"
                    className="form-control"
                    value={leaveForm.toDate}
                    onChange={(e) =>
                      setLeaveForm({
                        ...leaveForm,
                        toDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>Reason</label>

                  <textarea
                    className="form-control"
                    rows="3"
                    value={leaveForm.reason}
                    onChange={(e) =>
                      setLeaveForm({
                        ...leaveForm,
                        reason: e.target.value,
                      })
                    }
                  />
                </div>

                <button className="btn btn-primary">
                  Apply Leave
                </button>

              </form>

            </div>
          )}

          <div className="card shadow p-4">

            <h4>Leave Requests</h4>

            <table className="table table-bordered table-hover">

              <thead className="table-dark">

                <tr>

                  <th>Teacher</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>

                  {["schooladmin", "superadmin"].includes(role) && (
                    <th>Action</th>
                  )}

                </tr>

              </thead>

              <tbody>

                {leaves.map((leave) => (

                  <tr key={leave._id}>

                    <td>{leave.teacher?.name}</td>

                    <td>
                      {new Date(
                        leave.fromDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(
                        leave.toDate
                      ).toLocaleDateString()}
                    </td>

                    <td>{leave.reason}</td>

                    <td>

                      <span
                        className={
                          leave.status === "Approved"
                            ? "badge bg-success"
                            : leave.status === "Rejected"
                            ? "badge bg-danger"
                            : "badge bg-warning text-dark"
                        }
                      >
                        {leave.status}
                      </span>

                    </td>

                    {["schooladmin", "superadmin"].includes(role) && (

                      <td>

                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() =>
                            updateStatus(
                              leave._id,
                              "Approved"
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            updateStatus(
                              leave._id,
                              "Rejected"
                            )
                          }
                        >
                          Reject
                        </button>

                      </td>

                    )}

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

export default Leave;