"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [company, setCompany] = useState("");
  const [jobrole, setjobRole] = useState("");
  const [role, setRole] = useState("");
  const [jobs, setJobs] = useState([]);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const total = jobs.length;
  const applied = jobs.filter((j) => j.status === "Applied").length;
  const interview = jobs.filter((j) => j.status === "Interview").length;
  const rejected = jobs.filter((j) => j.status === "Rejected").length;
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // 🔐 Get token from localStorage
  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");
  //   if (storedToken) {
  //     setToken(storedToken);
  //   }
  // }, []);
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
    if (!storedToken && !role) {
      router.push("/login");
    }
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
    if (!token) return;

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

  // 🚀 Run when token available
  useEffect(() => {
    if (token) {
      fetchJobs();
      fetchApplications();
    }
  }, [token]);

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

    const res = await fetch("/api/applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("APPLICATIONS:", data);
    setApplications(data);
  };
   const jobsWithStatus = jobs.map((job) => {
  const app = Array.isArray(applications)
    ? applications.find(
        (a) => a.jobId.toString() === job._id.toString()
      )
    : null;

  return {
    ...job,
    applied: !!app,
    status: app?.status || "Not Applied",
  };
});

  // 🔄 Update Status
  const updateStatus = async (id, status) => {
    await fetch("/api/jobs/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    });

    fetchJobs();
  };

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
    console.log("APPLY:", data);

    fetchApplications(); // refresh
  };


  const appliedCount = jobsWithStatus.filter(
    (j) => j.status === "Applied",
  ).length;

  const rejectedCount = jobsWithStatus.filter(
    (j) => j.status === "Rejected",
  ).length;
  const filteredJobs = jobsWithStatus
    .filter((job) => (filter === "All" ? true : job.status === filter))
    .filter((job) => job.company.toLowerCase().includes(search.toLowerCase()));

  console.log(role);

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
          onClick={() => router.push("/admin")}
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
        <div className="bg-white rounded-xl shadow p-4">
          Applied: {appliedCount}
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          Interview: {appliedCount}
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          Rejected: {rejectedCount}
        </div>
      </div>
      {role === "admin" && (
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg p-2 m-2 bg-white"
        >
          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Not Applied</option>
        </select>
      )}
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
              <p className="text-gray-600">
                <b>Status:</b> {job.status}
              </p>
              <div className="mt-3">
                <button
                  onClick={() => updateStatus(job._id, "Interview")}
                  className="bg-yellow-400 px-3 py-1 rounded mr-2"
                >
                  Interview
                </button>

                <button
                  onClick={() => updateStatus(job._id, "Rejected")}
                  className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                >
                  Reject
                </button>

                <button
                  onClick={() => deleteJob(job._id)}
                  className="bg-gray-800 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
                {role === "user" && (
                  <button
                    onClick={() => handleApply(job._id)}
                    disabled={job.applied}
                    className={`px-3 py-1 rounded text-white ${
                      job.status === "Interview"
                        ? "bg-blue-500"
                        : job.status === "Rejected"
                          ? "bg-gray-500"
                          : job.applied
                            ? "bg-green-500"
                            : "bg-black"
                    }`}
                  >
                    {job.status
                      ? job.status
                      : job.applied
                        ? "Applied"
                        : "Apply"}
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
