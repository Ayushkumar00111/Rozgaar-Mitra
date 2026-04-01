import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import Job from "@/models/Job";
import User from "@/models/User";
import { getUserFromToken } from "@/utils/getUser";

export async function GET(req) {
  await connectDB();

  const user = getUserFromToken(req);

  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" });
  }

  // get jobs created by this admin
  const jobs = await Job.find({ createdBy: user.id });

  const jobIds = jobs.map((job) => job._id);

  // get applications on those jobs
  const applications = await Application.find({
    jobId: { $in: jobIds },
  });

  // populate manually
  const result = await Promise.all(
    applications.map(async (app) => {
      const job = await Job.findById(app.jobId);
      const applicant = await User.findById(app.userId);

      return {
        _id: app._id,
        status: app.status,
        job: {
          company: job.company,
          role: job.role,
        },
        user: {
          name: applicant.name,
          email: applicant.email,
        },
      };
    })
  );

  return Response.json(result);
}