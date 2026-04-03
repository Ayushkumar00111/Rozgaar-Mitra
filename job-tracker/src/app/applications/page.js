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


  // const filteredJobs = jobsWithStatus
  //   .filter((job) => (filter === "All" ? true : job.status === filter))
  //   .filter((job) => job.company.toLowerCase().includes(search.toLowerCase()));

  // console.log(filteredJobs);

const filteredData =
  role === "admin"
    ? applications.filter((a) =>
        filter === "All" ? true : a.status === filter
      )
    : jobsWithStatus.filter((job) =>
        filter === "All" ? true : job.status === filter
      );


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
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6 lg:p-8">
    {/* Header Section */}
    <div className="max-w-6xl mx-auto mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            My Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your job application status</p>
        </div>
      </div>
    </div>

    {/* Applications Grid */}
    <div className="max-w-6xl mx-auto">
      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-500">Start applying to jobs to see them here</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                {/* Status Badge */}
                <div className="flex justify-end mb-3">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    app.status === 'Interview' ? 'bg-green-100 text-green-800' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      app.status === 'Interview' ? 'bg-green-500' :
                      app.status === 'Rejected' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}></span>
                    {app.status}
                  </div>
                </div>

                {/* Applicant Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {app.user.name}
                    </h3>
                    <p className="text-sm text-gray-500">Applicant</p>
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Company</p>
                      <p className="text-sm font-semibold text-gray-900">{app.job.company}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                      <p className="text-sm font-semibold text-gray-900">{app.job.role}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:col-span-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-sm font-medium text-gray-900 break-all">{app.user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="mt-3 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-3">
                    {role === "admin" && (
                      <>
                        <button
                          onClick={() => updateStatus(app._id, "Interview")}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Interview
                        </button>
                        
                        <button
                          onClick={() => updateStatus(app._id, "Rejected")}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}
