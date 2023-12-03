import Customer from "@/models/customer";
import dbConnection from "@/utils/dbConnection";
import {
  sendResponseError,
  sendResponseSuccess,
  sendServerError,
} from "@/utils/functions";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    await dbConnection();
    const params = {
      _id: res.params.id,
    };
    const customer = await Customer.findOne(params);
    return customer
      ? NextResponse.json(customer, { status: 200 })
      : sendResponseSuccess("Customer does not exists!");
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
    const customer = await Customer.findOne(params);
    if (!customer) {
      return sendResponseError("Customer does not exists!", {
        error: "Customer does not exists!",
      });
    }

    const result = await Customer.deleteOne(params);
    if (result) {
      return sendResponseSuccess(
        `Customer '${customer.name}' deleted successfully...`
      );
    } else {
      return sendResponseError(
        `Failed to delete Customer '${customer.name}'...`
      );
    }
  } catch (error) {
    return sendServerError(error);
  }
}
