import Admin from "@/models/admin";
import dbConnection from "@/utils/dbConnection";
import bcrypt from "bcrypt";
import { sendResponseError, sendResponseSuccess } from "@/utils/functions";

export async function GET(req, res) {
  try {
    await dbConnection();

    const admin = await Admin.findOne({
      $or: [{ username: data.username }, { email: data.username }],
    });

    if (admin) {
      if (await bcrypt.compare(data?.password, user?.password)) {
        return sendResponseSuccess("User Authenticated Successfully...");
      }
      return sendResponseSuccess("Incorrect Password...");
    }
    return sendResponseError("Incorrect Username or Password!");
  } catch (error) {
    return sendResponseError(
      "Server error, Please try again!",
      { message: error?.message },
      500
    );
  }
}

export async function POST(req) {
  try {
    await dbConnection();
    const data = await req.json();
    const user = await Admin.findOne({
      $or: [{ username: data.username }, { email: data.username }],
    });

    if (user) {
      if (await bcrypt.compare(data?.password, user?.password)) {
        return sendResponseSuccess("User Authenticated Successfully...");
      }
      return sendResponseSuccess("Incorrect Password...");
    }
    return sendResponseError("Incorrect Username or Password!");
  } catch (error) {
    return sendResponseError(
      "Server error, Please try again!",
      { message: error?.message },
      500
    );
  }
}
