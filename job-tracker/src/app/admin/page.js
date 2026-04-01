// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminPage() {
//   const router = useRouter();
//   const [data, setData] = useState([]);
//   const token = localStorage.getItem("token");
//   useEffect(() => {
//     const role = localStorage.getItem("role");

//     if (!role) {
//       router.push("/login");
//     }

//     if (role !== "admin") {
//       router.push("/dashboard");
//     }
//   }, []);

//   const fetchData = async () => {
//     const res = await fetch("/api/admin/applications", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const result = await res.json();
//     console.log("ADMIN DATA:", result);
//     setData(result);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="p-5">
//       <h1 className="text-xl font-bold mb-4">Applications</h1>

//       {data.map((item) => (
//         <div key={item._id} className="border p-3 my-2">
//           <p>
//             <b>{item.job.company}</b> - {item.job.role}
//           </p>
//           <p>
//             {item.user.name} ({item.user.email})
//           </p>
//           <p>Status: {item.status}</p>
//           <button
//             onClick={async () => {
//               await fetch("/api/admin/update-status", {
//                 method: "PUT",
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                   id: item._id,
//                   status: "Interview",
//                 }),
//               });
//               fetchData();
//             }}
//             className="bg-blue-500 text-white px-2 py-1 m-1"
//           >
//             Interview
//           </button>

//           <button
//             onClick={async () => {
//               await fetch("/api/admin/update-status", {
//                 method: "PUT",
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                   id: item._id,
//                   status: "Rejected",
//                 }),
//               });
//               fetchData();
//             }}
//             className="bg-red-500 text-white px-2 py-1 m-1"
//           >
//             Reject
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";

export default function AdminApplications() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    const res = await fetch("/api/admin/applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

      {data.map((item) => (
        <div key={item._id} className="border p-3 my-2 rounded">
          <p><b>{item.user.name}</b> ({item.user.email})</p>
          <p>{item.job.company} - {item.job.role}</p>
          <p>Status: {item.status}</p>

          <button
            onClick={() => updateStatus(item._id, "Interview")}
            className="bg-blue-500 text-white px-2 py-1 m-1"
          >
            Interview
          </button>

          <button
            onClick={() => updateStatus(item._id, "Rejected")}
            className="bg-red-500 text-white px-2 py-1 m-1"
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}