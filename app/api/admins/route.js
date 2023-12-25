import Admin from "@/models/admin";
import dbConnection from "@/utils/dbConnection";
import { hash, compare } from "bcrypt";
import {
  authenticateUser,
  sendResponseError,
  sendResponseSuccess,
  sendServerError,
  validate,
} from "@/utils/functions";

export async function GET(req, res) {
  try {
    await dbConnection();

    const params = req.nextUrl.searchParams;
    const limit = params.get("limit") ?? 20;
    const page = params.get("page") ?? 0;
    const orderBy = params.get("orderBy") ?? "createdAt";
    const order = params.get("order") ?? "desc";
    const search = params.get("search") ?? "";

    const findParams = {
      $or: [
        { name: { $regex: search } },
        { number: { $regex: search } },
        { address: { $regex: search } },
        { doctorName: { $regex: search } },
        { doctorAddress: { $regex: search } },
      ],
    };

    const admins = await Admin.find(findParams)
      .skip(page * limit)
      .limit(limit)
      .sort({ [orderBy]: order })
      .select("-password -isLoggedIn");

    const totalAdmins = await Admin.findOne(findParams).count();

    return sendResponseSuccess("Admins fetched successfully...", {
      count: totalAdmins,
      admins,
    });
  } catch (error) {
    return sendResponseError(
      "Server error, Please try again!",
      { message: error?.message },
      500
    );
  }
}

export async function POST(req, res) {
  try {
    const params = req.nextUrl.searchParams;
    const action = params.get("action") ?? "";
    const admin = await req.json();
    const {
      _id,
      name,
      username,
      email,
      number,
      oldPassword,
      password,
      confirmPassword,
      address,
    } = admin;

    let error, message, response;

    if (action !== "password" && validate(username, "username")) {
      return sendResponseError("Username must contain valid characters!");
    }
    if (action !== "password" && validate(name, "name")) {
      return sendResponseError("Name must contain valid characters!");
    }
    if (action !== "password" && (error = validate(email, "email", false))) {
      return sendResponseError(error);
    }
    if (action !== "password" && validate(number, "number", false)) {
      return sendResponseError("Contact number must contain 10 digits!");
    }

    if (
      action !== "profile" &&
      (error = validate(password, "password", false))
    ) {
      return sendResponseError(error);
    }
    if (action !== "profile" && password !== confirmPassword) {
      return sendResponseError("Confirm password do not match with password!");
    }

    if (action === "password") {
      if (!_id) {
        return sendResponseError("Invalid admin reference!");
      }
      response = await Admin.findById(_id);
      if (!response) {
        return sendResponseError("Invalid admin reference!");
      }

      if (!(await compare(oldPassword, response.password))) {
        return sendResponseError(
          "Old password do not match with the current password!"
        );
      }
    }

    const authRes = await authenticateUser();
    if (authRes) return sendResponseError(authRes);

    if (action !== "profile") {
      admin.password = await hash(password, 10);
    }

    if (_id && action === "profile") {
      response = await Admin.findByIdAndUpdate(_id, {
        name,
        username,
        email,
        number,
        address,
      });
      message = "Admin details updated successfully.";
    } else if (_id && action === "password") {
      response = await Admin.findByIdAndUpdate(_id, {
        password: admin.password,
      });
      message = "Password changed successfully.";
    } else {
      const count = await Admin.find({}).count();
      if (count > 0) {
        return sendResponseSuccess(
          "You are not allowed to register new admin!"
        );
      }
      response = await Admin.create(admin);
      message = "Setup Done...";
    }

    return sendResponseSuccess(message, { response });
  } catch (error) {
    return sendServerError(error);
  }
}
