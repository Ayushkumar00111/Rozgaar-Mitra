"use client";
import { useEffect, useState } from "react";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [token, setToken] = useState(null);
  const [applications, setApplications] = useState([]);
  const [role, setRole] = useState(null);
  const [filter, setFilter] = useState("All");
   const [jobs, setJobs] = useState([]);


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("TOKEN: apllication page ", storedToken);
    const storedRole = localStorage.getItem("role");
    setRole(storedRole); // 👈 DEBUG
    setToken(storedToken);
  }, []);

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


    useEffect(() => {
      if (!token) return;

      fetchApplications();
    }, [token]);


    
    const updateStatus = async (id, status) => {
    await fetch("/api/admin/update-status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    });

   await fetchApplications();
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


  const filteredJobs = jobsWithStatus
    .filter((job) => (filter === "All" ? true : job.status === filter))
    .filter((job) => job.company.toLowerCase().includes(search.toLowerCase()));

  console.log(filteredJobs);

  useEffect(() => {
    if (!token) return;

    const fetchApps = async () => {
      const res = await fetch("/api/my-applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("APPLICATIONS:", data);

      setApps(Array.isArray(data) ? data : []);
    };

    fetchApps();
  }, [token]);

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">My Applications</h1>
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
      {applications.map((app) => (
        <div key={app._id} className="border p-3 my-2 rounded">
          <p>
            <b>Applied Name:</b> {app.user.name}
          </p>
          <p>
            <b>Company:</b> {app.job.company}
          </p>
          <p>
            <b>Role:</b> {app.job.role}
          </p>
          <p>
            <b>email:</b> {app.user.email}
          </p>
          <p><b>Status</b>{app.status}</p>
           <div className="mt-3">
                {role === "admin" && (
                <button
                  onClick={() => updateStatus(app._id, "Interview")}
                  className="bg-yellow-400 px-3 py-1 rounded mr-2"
                >
                  Interview
                </button>)}
                
{role === "admin" && (
                <button
                  onClick={() => updateStatus(app._id, "Rejected")}
                  className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                >
                  Reject
                </button>)}
                            

                </div>
        </div>
      ))}
    </div>
  );
}
