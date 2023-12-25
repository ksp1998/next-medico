import Medicine from "@/models/medicine";
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
        { packing: searchRegex },
        { genericName: searchRegex },
      ],
    };

    const medicines = await Medicine.find(findParams)
      .skip(page * limit)
      .limit(limit)
      .sort({ [orderBy]: order });

    const totalMedicines = await Medicine.find(findParams).count();

    return sendResponseSuccess("Medicines fetched successfully...", {
      count: totalMedicines,
      medicines,
    });
  } catch (error) {
    return sendServerError(error);
  }
}

export async function POST(req) {
  try {
    await dbConnection();
    const medicine = await req.json();
    medicine.packing = medicine?.packing?.toUpperCase();

    if (!medicine?.name?.trim()) {
      return sendResponseError("Medicine name is empty!");
    }
    if (!medicine?.packing?.trim()) {
      return sendResponseError("Packing is empty!");
    }
    if (!medicine?.genericName?.trim()) {
      return sendResponseError("Generic name is empty!");
    }
    if (!medicine?.supplier?.trim()) {
      delete medicine.supplier;
      // return sendResponseError("Supplier name is empty!");
    }

    const authRes = await authenticateUser();
    if (authRes) return sendResponseError(authRes);

    medicine.packing = medicine?.packing?.trim().replace(" ", "").toUpperCase();

    let message, response;
    if (!medicine._id) {
      response = await Medicine.create(medicine);
      message = "Medicine added successfully...";
    } else {
      response = await Medicine.findByIdAndUpdate(medicine._id, medicine);
      message = "Medicine updated successfully...";
    }
    return sendResponseSuccess(message, response);
  } catch (error) {
    return sendServerError(error);
  }
}
