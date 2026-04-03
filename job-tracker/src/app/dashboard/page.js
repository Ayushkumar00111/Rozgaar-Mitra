"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [company, setCompany] = useState("");
  const [jobrole, setjobRole] = useState("");
  const [jobs, setJobs] = useState([]);
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const [search, setSearch] = useState("");
  const [role, setRole] = useState(null);

  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    if (token) {
      fetchJobs();
      fetchApplications();
    }
  }, [token]);

  // ✅ AB yaha lagao
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      setRole(storedRole);
    }

    setAuthChecked(true);
  }, []);
 
  //logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };
  //load

  // 📥 Fetch Jobs
  const fetchJobs = async () => {
    setLoading(true);
    if (!token) return null;

    const res = await fetch("/api/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("API JOBS:", data);
    setJobs(data);
    setLoading(false);
  };

  // ➕ Add Job
  const handleAdd = async () => {
    if (!company || !jobrole) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch("/api/jobs/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ company, jobrole }),
    });

    const data = await res.json();
    console.log("ADD:", data);

    setCompany("");
    setjobRole("");

    fetchJobs();
  };
  //fatch application
  const fetchApplications = async () => {
    if (!token) return;

    const res = await fetch("/api/my-applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("APPLICATIONS: User login ", data);

    setApplications(Array.isArray(data) ? data : []);
  };

  const jobsWithStatus = jobs.map((job) => {
    const app = Array.isArray(applications)
      ? applications.find((a) => a?.jobId?.toString() === job?._id?.toString())
      : null;

    return {
      ...job,
      applied: !!app,
      status: app?.status || "Not Applied",
    };
  });

  // 🔄 Update Status

  // 🗑️ Delete Job
  const deleteJob = async (id) => {
    await fetch("/api/jobs/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    fetchJobs();
  };
  const handleApply = async (jobId) => {
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jobId }),
    });

    const data = await res.json();
    console.log("APPLY: dashboard", data);

    await fetchApplications();
    await fetchJobs(); // refresh
  };

  // 🚀 Run when token available
  useEffect(() => {
    if (token) {
      fetchJobs();
      fetchApplications();
    }
  }, [token]);

  const total = jobsWithStatus.length;

  const appliedCount = jobsWithStatus.filter(
    (j) => j.status === "Applied",
  ).length;

  const userInterviewCount = applications.filter(
    (a) => a.status === "Interview",
  ).length;

  const userRejectedCount = applications.filter(
    (a) => a.status === "Rejected",
  ).length;

  const userAppliedCount = applications.length;

  const adminInterviewCount = applications.filter(
    (a) => a.status === "Interview",
  ).length;

  const adminRejectedCount = applications.filter(
    (a) => a.status === "Rejected",
  ).length;

  const filteredJobs = jobsWithStatus
    .filter((job) => (filter === "All" ? true : job.status === filter))
    .filter((job) => job.company.toLowerCase().includes(search.toLowerCase()));

  console.log(filteredJobs);
  // ✅ ALL hooks upar hone chahiye
 if (!authChecked) {
    return <p>Loading...</p>;
  }
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <input
        placeholder="Search company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg p-2 m-2 bg-white"
      />
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
      {role === "user" && (
        <button
          onClick={() => router.push("/applications")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          My Applications
        </button>
      )}
      {role === "admin" && (
        <button
          onClick={() => router.push("/applications")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Recived Applicants
        </button>
      )}
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {role === "admin" && (
          <div className="bg-white rounded-xl shadow p-4">Total: {total}</div>
        )}

        {role === "admin" && (
          <div className="bg-white rounded-xl shadow p-4">
            Interview: {adminInterviewCount}
          </div>
        )}

        {role === "admin" && (
          <div className="bg-white rounded-xl shadow p-4">
            Rejected: {adminRejectedCount}
          </div>
        )}

        {role === "user" && <div>Applied: {userAppliedCount}</div>}
        {role === "user" && <div>Interview: {userInterviewCount}</div>}
        {role === "user" && <div>Rejected: {userRejectedCount}</div>}
      </div>

      {/* ➕ Add Job Form */}
      {role === "admin" && (
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border rounded-lg p-2 m-2 bg-white"
        />
      )}
      {role === "admin" && (
        <input
          placeholder="Role"
          value={jobrole}
          onChange={(e) => setjobRole(e.target.value)}
          className="border rounded-lg p-2 m-2 bg-white"
        />
      )}
      {role === "admin" && (
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add Job
        </button>
      )}

      {/* 📋 Job List */}
      <div className="border rounded-lg shadow p-3 my-2">
        {jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-xl shadow p-4 my-3">
              <p className="font-semibold text-lg">
                <b>Company:</b> {job.company}
              </p>
              <p className="text-gray-600">
                <b>Role:</b> {job.jobrole}
              </p>
              {role === "user" && (
                <p className="text-gray-600">
                  <b>Status:</b> {job.status}
                </p>
              )}

              <div className="mt-3">
                {role === "admin" && (
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="bg-gray-800 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                )}

                {role === "user" && (
                  <button
                    onClick={() => handleApply(job._id)}
                    disabled={job.applied}
                    className={`px-3 py-1 rounded text-white ${
                      job.status === "Interview"
                        ? "bg-yellow-500"
                        : job.status === "Rejected"
                          ? "bg-red-500"
                          : job.status === "Applied"
                            ? "bg-green-500"
                            : "bg-blue-500"
                    }`}
                  >
                    {job.status === "Not Applied" ? "Apply" : job.status}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
