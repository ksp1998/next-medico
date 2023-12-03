import Supplier from "@/models/supplier";
import dbConnection from "@/utils/dbConnection";
import {
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
        { email: searchRegex },
        { number: searchRegex },
        { address: searchRegex },
      ],
    };

    const suppliers = await Supplier.find(findParams)
      .skip(page * limit)
      .limit(limit)
      .sort({ [orderBy]: order });

    const totalSuppliers = await Supplier.find(findParams).count();

    return sendResponseSuccess("Suppliers fetched successfully...", {
      count: totalSuppliers,
      suppliers,
    });
  } catch (error) {
    return sendServerError(error);
  }
}

export async function POST(req) {
  try {
    await dbConnection();
    const supplier = await req.json();

    if (!supplier?.name?.trim()) {
      return sendResponseError("Name Empty!");
    }
    if (!supplier?.number?.trim()) {
      return sendResponseError("Contact Number Empty!");
    }
    if (!supplier?.email?.trim()) {
      return sendResponseError("Email Empty!!");
    }
    if (!supplier?.address?.trim()) {
      return sendResponseError("Address Empty!");
    }

    let message, response;
    if (!supplier._id) {
      response = await Supplier.create(supplier);
      message = "Supplier added successfully...";
    } else {
      response = await Supplier.findByIdAndUpdate(supplier._id, supplier);
      message = "Supplier updated successfully...";
    }
    return sendResponseSuccess(message, response);
  } catch (error) {
    return sendServerError(error);
  }
}
