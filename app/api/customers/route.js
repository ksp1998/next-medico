import Customer from "@/models/customer";
import dbConnection from "@/utils/dbConnection";
import {
  authenticateUser,
  sendResponseError,
  sendResponseSuccess,
  sendServerError,
} from "@/utils/functions";

export async function GET(req, res) {
  try {
    await dbConnection();

    const params = req.nextUrl.searchParams;
    const limit = params.get("limit") ?? 20;
    const page = params.get("page") ?? 0;
    const orderBy = params.get("orderBy") ?? "createdAt";
    const order = params.get("order") ?? "desc";
    const search = (params.get("search") ?? "").toLowerCase();

    const searchRegex = new RegExp(search, "i");

    const findParams = {
      $or: [
        { name: searchRegex },
        { number: searchRegex },
        { address: searchRegex },
        { doctorName: searchRegex },
        { doctorAddress: searchRegex },
      ],
    };

    const customers = await Customer.find(findParams)
      .skip(page * limit)
      .limit(limit)
      .sort({ [orderBy]: order });

    const totalCustomers = await Customer.find(findParams).count();

    return sendResponseSuccess("Customers fetched successfully...", {
      count: totalCustomers,
      customers,
    });
  } catch (error) {
    return sendServerError(error);
  }
}

export async function POST(req) {
  try {
    await dbConnection();

    const customer = await req.json();

    if (!customer?.name?.trim()) {
      return sendResponseError("Name Empty!");
    }
    if (!customer?.number?.trim()) {
      return sendResponseError("Contact Number Empty!");
    }
    if (!customer?.address?.trim()) {
      return sendResponseError("Address Empty!");
    }
    if (!customer?.doctorName?.trim()) {
      return sendResponseError("Doctor Name Empty!!");
    }
    if (!customer?.doctorAddress?.trim()) {
      return sendResponseError("Doctor Address Empty!!");
    }

    const authRes = await authenticateUser();
    if (authRes) return sendResponseError(authRes);

    let message, response;
    if (!customer._id) {
      response = await Customer.create(customer);
      message = "Customer added successfully...";
    } else {
      response = await Customer.findByIdAndUpdate(customer._id, customer);
      message = "Customer updated successfully...";
    }
    return sendResponseSuccess(message, response);
  } catch (error) {
    return sendServerError(error);
  }
}
