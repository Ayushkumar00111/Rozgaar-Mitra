import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import { getUserFromToken } from "@/utils/getUser";

export async function POST(req) {
  await connectDB();

  const user = getUserFromToken(req);

  if (!user) {
    return Response.json({ error: "Unauthorized" });
  }

  const { company, jobrole } = await req.json();

  const job = await Job.create({
    company,
    jobrole,
    userId: user.id, 
    createdBy: user.id 
  });

  return Response.json(job);
}