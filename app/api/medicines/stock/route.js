import Stock from "@/models/stock";
import Supplier from "@/models/supplier";
import Purchase from "@/models/purchase";
import dbConnection from "@/utils/dbConnection";
import { sendResponseSuccess, sendServerError } from "@/utils/functions";

export async function GET(req, res) {
  try {
    await dbConnection();

    const params = req.nextUrl.searchParams;
    const limit = params.get("limit") ?? 20;
    const page = params.get("page") ?? 0;
    const orderBy = params.get("orderBy") ?? "createdAt";
    const order = params.get("order") ?? "desc";
    const search = params.get("search") ?? "";
    const searchRegex = new RegExp(search, "i");

    const findParams = {};

    const medicine = params.get("medicine") ?? "";
    if (medicine) {
      findParams.medicine = medicine;
    }

    const supplier = params.get("supplier") ?? "";
    if (supplier) {
      const purchases = await Purchase.find({ supplier }).select("_id");
      // return sendResponseSuccess("Here we go!", {
      //   purchases: purchases.map((purchase) => purchase._id),
      // });
      findParams.purchase = { $in: purchases.map((purchase) => purchase._id) };
    }

    const outOfStock = params.get("outOfStock") ?? false;
    if (outOfStock === "true") {
      console.log(outOfStock);
      findParams.$expr = { $eq: ["$stock", "$sold"] };
    }

    const expired = params.get("expired") ?? false;
    if (expired === "true") {
      // Get the current date in "MM/YY" format
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns 0-based month
      const currentYear = currentDate.getFullYear();
      findParams.$expr = {
        $or: [
          { $lt: [{ $toInt: { $substr: ["$expiry", 3, 2] } }, currentYear] },
          {
            $and: [
              {
                $eq: [{ $toInt: { $substr: ["$expiry", 3, 2] } }, currentYear],
              },
              {
                $lt: [{ $toInt: { $substr: ["$expiry", 0, 2] } }, currentMonth],
              },
            ],
          },
        ],
      };
    }

    const medicinesStock = await Stock.find(findParams)
      .populate("medicine")
      .populate({
        path: "purchase",
        populate: "supplier",
      })
      .skip(page * limit)
      .limit(limit)
      .sort({ medicine: "asc", [orderBy]: order });

    const totalStock = await Stock.find(findParams).count();

    return sendResponseSuccess("Medicines stock fetched successfully...", {
      count: totalStock,
      medicinesStock,
    });
  } catch (error) {
    return sendServerError(error);
  }
}
