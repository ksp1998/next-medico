import Purchase from "@/models/purchase";
import dbConnection from "@/utils/dbConnection";
import { sendResponseSuccess, sendServerError } from "@/utils/functions";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    await dbConnection();
    const params = {
      invoiceNumber: res.params.id,
    };
    const purchase = await Purchase.findOne(params);
    return purchase
      ? NextResponse.json(purchase, { status: 200 })
      : sendResponseSuccess("Purchase does not exists!");
  } catch (error) {
    return sendServerError(error);
  }
}
