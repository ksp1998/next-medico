import Supplier from "@/models/supplier";
import dbConnection from "@/utils/dbConnection";
import { sendResponseError, sendResponseSuccess } from "@/utils/functions";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    await dbConnection();
    const params = {
      _id: res.params.id,
    };
    const supplier = await Supplier.findOne(params);
    return supplier
      ? NextResponse.json(supplier, { status: 200 })
      : sendResponseSuccess("Supplier does not exists!");
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
    const supplier = await Supplier.findOne(params);
    if (!supplier) {
      return sendResponseError("Supplier does not exists!", {
        error: "Supplier does not exists!",
      });
    }

    const result = await Supplier.deleteOne(params);
    if (result) {
      return sendResponseSuccess(
        `Supplier '${supplier.name}' deleted successfully...`
      );
    } else {
      return sendResponseError(
        `Failed to delete Supplier '${supplier.name}'...`
      );
    }
  } catch (error) {
    return sendServerError(error);
  }
}
