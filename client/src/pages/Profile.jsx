import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    school: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/profile");

      setProfile({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        school: res.data.school?.name || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await API.put("/profile", {
        name: profile.name,
        email: profile.email,
      });

      alert("Profile Updated Successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await API.put("/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert("Password Changed Successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

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

          <h2 className="mb-4">My Profile</h2>

          {/* Profile Card */}

          <div className="card shadow p-4 mb-4">

            <h4 className="mb-3">Profile Information</h4>

            <form onSubmit={updateProfile}>

              <div className="mb-3">
                <label>Name</label>

                <input
                  className="form-control"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label>Email</label>

                <input
                  className="form-control"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label>Role</label>

                <input
                  className="form-control"
                  value={profile.role}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label>School</label>

                <input
                  className="form-control"
                  value={profile.school}
                  disabled
                />
              </div>

              <button className="btn btn-primary">
                Update Profile
              </button>

            </form>

          </div>

          {/* Password Card */}

          <div className="card shadow p-4">

            <h4 className="mb-3">Change Password</h4>

            <form onSubmit={changePassword}>

              <div className="mb-3">

                <label>Current Password</label>

                <input
                  type="password"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />

              </div>

              <div className="mb-3">

                <label>New Password</label>

                <input
                  type="password"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />

              </div>

              <div className="mb-3">

                <label>Confirm Password</label>

                <input
                  type="password"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />

              </div>

              <button className="btn btn-success">
                Change Password
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;