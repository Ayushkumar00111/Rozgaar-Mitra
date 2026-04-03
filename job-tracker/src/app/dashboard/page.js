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

  useEffect(() => {
    if (token) {
      fetchJobs();
      fetchApplications();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const fetchJobs = async () => {
    setLoading(true);

    const res = await fetch("/api/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setJobs(data);
    setLoading(false);
  };

  const fetchApplications = async () => {
    const res = await fetch("/api/my-applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setApplications(Array.isArray(data) ? data : []);
  };

  const handleAdd = async () => {
    if (!company || !jobrole) {
      alert("Fill all fields");
      return;
    }

    await fetch("/api/jobs/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ company, jobrole }),
    });

    setCompany("");
    setjobRole("");
    fetchJobs();
  };

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
    await fetch("/api/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jobId }),
    });

    fetchApplications();
    fetchJobs();
  };

  const jobsWithStatus = jobs.map((job) => {
    const app = applications.find(
      (a) => a?.jobId?.toString() === job?._id?.toString()
    );

    return {
      ...job,
      applied: !!app,
      status: app?.status || "Not Applied",
    };
  });

  const filteredJobs = jobsWithStatus.filter((job) =>
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  const userInterviewCount = applications.filter(
    (a) => a.status === "Interview"
  ).length;

  const userRejectedCount = applications.filter(
    (a) => a.status === "Rejected"
  ).length;

  const userAppliedCount = applications.length;

  if (!authChecked) return <p className="text-center text-gray-600 mt-20 text-lg animate-pulse">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Navbar */}
      <div className="bg-white/90 backdrop-blur-md shadow-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Job Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <input
                placeholder="🔍 Search company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-2 border-gray-200 rounded-xl px-4 py-2 w-64 pl-10 focus:border-blue-400 focus:outline-none transition-all duration-300 group-hover:shadow-md"
              />
              <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {role === "user" && (
              <button
                onClick={() => router.push("/applications")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium"
              >
                📄 My Apps
              </button>
            )}

            {role === "admin" && (
              <button
                onClick={() => router.push("/applications")}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium"
              >
                👥 Applicants
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-blue-700 font-semibold text-lg">Total Applications</p>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-blue-800">{userAppliedCount}</h2>
              <p className="text-blue-600 text-sm mt-2">jobs applied</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-green-700 font-semibold text-lg">Interviews</p>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-green-800">{userInterviewCount}</h2>
              <p className="text-green-600 text-sm mt-2">scheduled interviews</p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-red-700 font-semibold text-lg">Rejections</p>
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-red-800">{userRejectedCount}</h2>
              <p className="text-red-600 text-sm mt-2">applications rejected</p>
            </div>
          </div>
        </div>

        {/* Admin Add Job Section */}
        {role === "admin" && (
          <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3">
              <h3 className="text-white font-semibold text-lg">➕ Add New Job Position</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    placeholder="e.g., Google, Microsoft, Amazon..."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-400 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
                  <input
                    placeholder="e.g., Frontend Developer, UI/UX Designer..."
                    value={jobrole}
                    onChange={(e) => setjobRole(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-400 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    📌 Add Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job List */}
        <div className="flex flex-col gap-4">
          {jobs.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 text-lg">No jobs found</p>
            </div>
          ) : loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-gray-600 mt-4">Loading jobs...</p>
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <div
                key={job._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">
                          {job.company.charAt(0)}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {job.company}
                      </h2>
                    </div>
                    <p className="text-gray-600 ml-13 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {job.jobrole}
                    </p>
                    {role === "user" && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === "Interview" ? "bg-yellow-100 text-yellow-800" :
                          job.status === "Rejected" ? "bg-red-100 text-red-800" :
                          job.status === "Applied" ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          Status: {job.status}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {role === "admin" && (
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-5 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    )}

                    {role === "user" && (
                      <button
                        onClick={() => handleApply(job._id)}
                        disabled={job.applied}
                        className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                          job.status === "Interview"
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg"
                            : job.status === "Rejected"
                            ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                            : job.status === "Applied"
                            ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl"
                        }`}
                      >
                        {job.status === "Not Applied" && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {job.status === "Not Applied"
                          ? "Apply Now"
                          : job.status === "Interview"
                          ? "📅 Interview Scheduled"
                          : job.status === "Rejected"
                          ? "❌ Rejected"
                          : "✅ Applied"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}