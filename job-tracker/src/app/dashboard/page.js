"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const [company, setCompany] = useState("");
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
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
useEffect(() => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    router.push("/login");
  }
}, []);
//logout
const handleLogout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
//load

  // 📥 Fetch Jobs
  const fetchJobs = async () => {
    setLoading(true)
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
    if (!company || !role) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch("/api/jobs/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ company, role }),
    });

    const data = await res.json();
    console.log("ADD:", data);

    setCompany("");
    setRole("");

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
  const filteredJobs = jobs
    .filter((job) => (filter === "All" ? true : job.status === filter))
    .filter((job) => job.company.toLowerCase().includes(search.toLowerCase()));
const jobsWithStatus = jobs.map((job) => {
  const app = applications.find(
    (a) => a.jobId === job._id
  );

  return {
    ...job,
    applied: !!app,
    status: app?.status || null,
  };
});
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
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">Total: {total}</div>
        <div className="bg-white rounded-xl shadow p-4">Applied: {applied}</div>
        <div className="bg-white rounded-xl shadow p-4">
          Interview: {interview}
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          Rejected: {rejected}
        </div>
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border rounded-lg p-2 m-2 bg-white"
      >
        <option>All</option>
        <option>Applied</option>
        <option>Interview</option>
        <option>Rejected</option>
      </select>

      {/* ➕ Add Job Form */}
      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border rounded-lg p-2 m-2 bg-white"
      />

      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border rounded-lg p-2 m-2 bg-white"
      />

      <button
        onClick={handleAdd}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Add Job
      </button>

      {/* 📋 Job List */}
      <div className="border rounded-lg shadow p-3 my-2">
        {jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : loading ? <p>Loading...</p> :(

        //  filteredJobs.map((job) => (
          jobsWithStatus.map((job) => (
            <div key={job._id} className="bg-white rounded-xl shadow p-4 my-3">
              <p className="font-semibold text-lg">
                <b>Company:</b> {job.company}
              </p>
              <p className="text-gray-600">
                {" "}
                <b>Role:</b> {job.role}
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
