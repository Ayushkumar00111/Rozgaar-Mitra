"use client";
import { useEffect, useState } from "react";

export default function AdminApplications() {
  const [data, setData] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const fetchData = async () => {
    const res = await fetch("/api/admin/applications", { // ✅ FIXED
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    console.log("ADMIN DATA:", result);

    setData(Array.isArray(result) ? result : []);
  };

  useEffect(() => {
    if (!token) return;   // ✅ FIXED
    fetchData();
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

    fetchData();
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Applicants</h1>

      {data.length === 0 ? (
        <p>No applications found</p>
      ) : (
        data.map((item) => (
          <div key={item._id} className="border p-3 my-2 rounded">
            <p><b>{item.user.name}</b> ({item.user.email})</p>
            <p>{item.job.company} - {item.job.role}</p>
            <p>Status: {item.status}</p>

            <button onClick={() => updateStatus(item._id, "Interview")}>
              Interview
            </button>

            <button onClick={() => updateStatus(item._id, "Rejected")}>
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}