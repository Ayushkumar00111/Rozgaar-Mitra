"use client";
import { useEffect, useState } from "react";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const token = localStorage.getItem("token");

  const fetchApps = async () => {
    const res = await fetch("/api/applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setApps(data);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">My Applications</h1>

      {apps.map((app) => (
        <div key={app._id} className="border p-3 my-2 rounded">
          <p><b>Job ID:</b> {app.jobId}</p>

          <p
            className={`mt-1 ${
              app.status === "Interview"
                ? "text-blue-500"
                : app.status === "Rejected"
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {app.status}
          </p>
        </div>
      ))}
    </div>
  );
}