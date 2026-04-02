"use client";
import { useEffect, useState } from "react";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
     console.log("TOKEN: apllication page ", storedToken); // 👈 DEBUG
    setToken(storedToken);
  }, []);

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

      {apps.map((app) => (
        <div key={app._id} className="border p-3 my-2 rounded">
          <p><b>Applied Name:</b> {app.user.name}</p>
           <p><b>Company:</b> {app.job.company}</p>
            <p><b>Role:</b> {app.job.role}</p>
             <p><b>email:</b> {app.user.email}</p>
          <p>{app.status}</p>
        </div>
      ))}
    </div>
  );
}