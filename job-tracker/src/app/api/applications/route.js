import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import { getUserFromToken } from "@/utils/getUser";

export async function GET(req) {
  await connectDB();

  const user = getUserFromToken(req);
  if (!user) {
    return Response.json([]);
  }

  const applications = await Application.find({
    userId: user.id,
  });

  return Response.json(applications);
}