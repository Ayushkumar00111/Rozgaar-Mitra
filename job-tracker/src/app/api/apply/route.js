import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import { getUserFromToken } from "@/utils/getUser";

export async function POST(req) {
  try {
    await connectDB();

    const user = getUserFromToken(req);
    if (!user) {
      return Response.json({ error: "Unauthorized" });
    }

    const { jobId } = await req.json();

    // check already applied
    const existing = await Application.findOne({
      userId: user.id,
      jobId,
    });

    if (existing) {
      return Response.json({ message: "Already applied" });
    }

    const application = await Application.create({
      userId: user.id,
      jobId,
    });

    return Response.json({ message: "Applied", application });
  } catch (err) {
    return Response.json({ error: err.message });
  }
}