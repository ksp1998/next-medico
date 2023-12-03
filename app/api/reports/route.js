import Invoice from "@/models/invoice";
import Purchase from "@/models/purchase";
import dbConnection from "@/utils/dbConnection";
import { sendServerError } from "@/utils/functions";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    await dbConnection();
    const params = req.nextUrl.searchParams;

    const today = params.get("today") ?? false;
    let start = params.get("start") || new Date("1970-01-01T00:00:00.000Z");
    let end = params.get("end") || new Date();

    if (today) {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    }

    const sales = await Invoice.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: null, totalAmount: { $sum: "$total" } } },
    ]);

    const purchases = await Purchase.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    return NextResponse.json({
      sale: sales[0] ?? { totalAmount: 0 },
      purchase: purchases[0] ?? { totalAmount: 0 },
    });
  } catch (error) {
    return sendServerError(error);
  }
}
