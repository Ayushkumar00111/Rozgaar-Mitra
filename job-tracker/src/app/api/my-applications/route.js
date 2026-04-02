import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import { getUserFromToken } from "@/utils/getUser";
import Job from "@/models/Job";
import User from "@/models/User";
export async function GET(req) {
  await connectDB();

  const user = getUserFromToken(req);

  if (!user) {
    return Response.json([]);
  }

  let applications;

  // ✅ USER → only his applications
  if (user.role === "user") {
    applications = await Application.find({ userId: user.id });
  }

  // ✅ ADMIN → all applications
  if (user.role === "admin") {
    applications = await Application.find();
  }

  const result = await Promise.all(
    applications.map(async (app) => {
      const job = await Job.findById(app.jobId);
      const applicant = await User.findById(app.userId);

      return {
        _id: app._id,
        status: app.status || "Applied",
        job: {
          company: job?.company,
          role: job?.jobrole,
        },
        user: {
          name: applicant?.name,
          email: applicant?.email,
        },
      };
    })
  );

  return Response.json(result);
}
