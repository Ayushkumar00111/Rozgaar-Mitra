"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobs, setJobs] = useState([]);
  const [token, setToken] = useState(null);
const total = jobs.length;
const applied = jobs.filter(j => j.status === "Applied").length;
const interview = jobs.filter(j => j.status === "Interview").length;
const rejected = jobs.filter(j => j.status === "Rejected").length;
const [filter, setFilter] = useState("All");
const [search, setSearch] = useState(""); 
// 🔐 Get token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // 📥 Fetch Jobs
  const fetchJobs = async () => {
    if (!token) return;

    const res = await fetch("/api/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("API JOBS:", data);
    setJobs(data);
  };

  // 🚀 Run when token available
  useEffect(() => {
    if (token) {
      fetchJobs();
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
  
  
  const filteredJobs = jobs
  .filter((job) =>
    filter === "All" ? true : job.status === filter
  )
  .filter((job) =>
    job.company.toLowerCase().includes(search.toLowerCase())
  );
  
  
  
  return (
    <div className="p-5">
      <input
  placeholder="Search company..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border p-2 m-2"
/>
      <h1 className="text-xl font-bold">Dashboard</h1>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-5">
  <div className="bg-blue-200 p-3">Total: {total}</div>
  <div className="bg-yellow-200 p-3">Applied: {applied}</div>
  <div className="bg-green-200 p-3">Interview: {interview}</div>
  <div className="bg-red-200 p-3">Rejected: {rejected}</div>
</div>


<select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className="border p-2 m-2"
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
        className="border p-2 m-2"
      />

      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 m-2"
      />

      <button
        onClick={handleAdd}
       className="bg-blue-500 hover:bg-blue-600 text-white p-2"
      >
        Add Job
      </button>

      {/* 📋 Job List */}
    <div className="border rounded-lg shadow p-3 my-2">
        {jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
         filteredJobs.map((job) => (
            <div key={job._id} className="border p-2 my-2">
              <p><b>Company:</b> {job.company}</p>
              <p><b>Role:</b> {job.role}</p>
              <p><b>Status:</b> {job.status}</p>

              <button
                onClick={() => updateStatus(job._id, "Interview")}
                className="bg-yellow-500 text-white p-1 m-1"
              >
                Interview
              </button>

              <button
                onClick={() => updateStatus(job._id, "Rejected")}
                className="bg-red-500 text-white p-1 m-1"
              >
                Reject
              </button>

              <button
                onClick={() => deleteJob(job._id)}
                className="bg-black text-white p-1 m-1"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}