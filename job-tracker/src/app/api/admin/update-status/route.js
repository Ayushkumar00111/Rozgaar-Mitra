import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import { getUserFromToken } from "@/utils/getUser";

export async function PUT(req) {
  await connectDB();

  const user = getUserFromToken(req);

  if (!user || user.role !== "admin") {
    return Response.json({ error: "Unauthorized" });
  }

  const { id, status } = await req.json();

  const app = await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  return Response.json(app);
}