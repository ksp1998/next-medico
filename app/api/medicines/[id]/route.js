import Medicine from "@/models/medicine";
import dbConnection from "@/utils/dbConnection";
import { sendResponseError, sendResponseSuccess } from "@/utils/functions";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    await dbConnection();
    const params = {
      _id: res.params.id,
    };
    const medicine = await Medicine.findOne(params);
    return medicine
      ? NextResponse.json(medicine, { status: 200 })
      : sendResponseSuccess("Medicine does not exists!");
  } catch (error) {
    return sendServerError(error);
  }
}

// Write a next js code for route;s DELETE method to delete record with mongoose's deleteOne method.
export async function DELETE(req, res) {
  try {
    await dbConnection();
    const params = {
      _id: res.params.id,
    };
    const medicine = await Medicine.findOne(params);
    if (!medicine) {
      return sendResponseError("Medicine does not exists!", {
        error: "Medicine does not exists!",
      });
    }

    const result = await Medicine.deleteOne(params);
    if (result) {
      return sendResponseSuccess(
        `Medicine '${medicine.name}' deleted successfully...`
      );
    } else {
      return sendResponseError(
        `Failed to delete Medicine '${medicine.name}'...`
      );
    }
  } catch (error) {
    return sendServerError(error);
  }
}
