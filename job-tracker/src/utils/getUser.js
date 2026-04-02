import jwt from "jsonwebtoken";

export const getUserFromToken = (req) => {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) return null;

    const token = authHeader.split(" ")[1]; // 🔥 IMPORTANT

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded;
  } catch (err) {
    console.log("TOKEN ERROR:", err.message);
    return null;
  }
};