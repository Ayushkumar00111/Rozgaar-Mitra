import jwt from "jsonwebtoken";

export const getUserFromToken = (req) => {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded;
  } catch (error) {
    return null;
  }
};