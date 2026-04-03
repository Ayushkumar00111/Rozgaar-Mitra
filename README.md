Rozgaar-Mitra is (Job Tracker) Project Readme
🚀 Job Tracker Application

A full-stack Job Tracker web application where users can apply for jobs and admins can manage job postings and applications.

📌 Features
👤 User
Sign up / Login
View all jobs
Apply to jobs
Track application status (Applied / Interview / Rejected)
Filter jobs based on status
🛠️ Admin
Login as Admin
Add new jobs
Delete jobs
View all applicants
Update application status (Interview / Rejected)
Filter applicants by status
🧑‍💻 Tech Stack
Frontend: Next.js (App Router), React, Tailwind CSS
Backend: Next.js API Routes
Database: MongoDB (Mongoose)
Authentication: JWT (JSON Web Token)
<img width="1366" height="626" alt="image" src="https://github.com/user-attachments/assets/7f250300-ca07-4d53-bc97-242991f86722" />
<img width="1366" height="632" alt="image" src="https://github.com/user-attachments/assets/433abd6c-e4ff-4b6b-9558-a3535259b325" />

📂 Folder Structure

/app
  /api
    /jobs
    /apply
    /admin
    /my-applications
  /dashboard
  /applications
/lib
  db.js
/models
  Job.js
  Application.js
  User.js
/utils
  getUser.js

🔐 Authentication
JWT token stored in localStorage
Sent via Authorization: Bearer <token> header
Role-based access:
user
admin

🧠 Tech Stack

Frontend:

React.js (Next.js App Router)
Tailwind CSS

Backend:

Next.js API Routes

Database:

MongoDB (Mongoose)

Authentication:

JWT (JSON Web Token)
<img width="1366" height="633" alt="image" src="https://github.com/user-attachments/assets/ffdb9e67-b32d-4f73-b5aa-ec66651e44ea" />
<img width="1311" height="351" alt="image" src="https://github.com/user-attachments/assets/c51e77bb-5441-4e8e-9866-b5c571705aae" />

🔁 Core Logic
Job + Application Mapping

Each job card is merged with application status:
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

📊 Dashboard Metrics
User
Applied Count
Interview Count
Rejected Count
Admin
Total Jobs
Total Interviews Given
Total Rejections
🔍 Filtering

Users and Admins can filter data using:

All
Applied
Interview
Rejected

▶️ Getting Started
1. Clone Repo
   git clone <your-repo-url>
   cd job-tracker
2. Install Dependencies
   npm install
3. Setup Environment
   MONGODB_URI=*****
   JWT_SECRET=*****
4. Run Project
   npm run dev
   

🌟 Future Improvements
Toast notifications
Loading skeletons
Real-time updates (WebSockets)
Resume upload feature
🤝 Contribution

Feel free to fork and improve this project.

📄 License

This project is open-source and free to use.

💡 Author

Ayush Kumar


