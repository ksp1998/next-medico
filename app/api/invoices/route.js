import Customer from "@/models/customer";
import Invoice from "@/models/invoice";
import Medicine from "@/models/medicine";
import Sale from "@/models/sale";
import Stock from "@/models/stock";
import dbConnection from "@/utils/dbConnection";
import { defaultPaymentTypeOptions } from "@/utils/defaults";
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
    const search = params.get("search") ?? "";

    let start = new Date(params.get("start") || "1970-01-01T00:00:00.000Z");
    let end = params.get("end");
    end = end ? new Date(end) : new Date();
    end.setHours(23, 59, 59, 999);

    const invoiceNumber = params.get("invoiceNumber") ?? "";

    const customer = params.get("customer") ?? "";

    let invoiceDate = params.get("invoiceDate");
    invoiceDate = invoiceDate ? new Date(invoiceDate) : "";

    const searchRegex = new RegExp(search, "i");

    const findParams = {
      date: invoiceDate || { $gte: start, $lt: end },
    };

    if (customer) {
      findParams.customer = customer;
    }

    if (invoiceNumber) {
      findParams.$expr = {
        $regexMatch: {
          input: { $toString: `$invoiceNumber` },
          regex: new RegExp(invoiceNumber),
        },
      };
    }

    const invoices = await Invoice.find(findParams)
      .populate("customer")
      .skip(page * limit)
      .limit(limit)
      .sort({ [orderBy]: order });

    const invoicesCount = await Invoice.find(findParams).count();

    const salesTotal = await Invoice.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: null, totalAmount: { $sum: "$total" } } },
    ]);

    return sendResponseSuccess("Invoices fetched successfully...", {
      count: invoicesCount,
      invoiceNumber,
      invoices,
      salesTotal: salesTotal[0]?.totalAmount ?? 0,
    });
  } catch (error) {
    return sendServerError(error);
  }
}

export async function POST(req) {
  try {
    await dbConnection();
    const data = await req.json();

    const { customer, invoiceDetails, items } = data;
    invoiceDetails.subtotal = 0;
    invoiceDetails.discount = 0;
    invoiceDetails.total = 0;

    if (!customer?.id || !(await Customer.findById(customer?.id))) {
      return sendResponseError("Invalid Customer!");
    }

    if (
      !invoiceDetails.invoiceNumber ||
      isNaN(Number(invoiceDetails.invoiceNumber))
    ) {
      return sendResponseError("Invalid invoice number!");
    }

    if (
      !invoiceDetails.paymentType ||
      !Object(defaultPaymentTypeOptions)
        .map((option) => option.id)
        .includes(invoiceDetails.paymentType)
    ) {
      return sendResponseError("Invalid payment type!");
    }

    if (!invoiceDetails.date) {
      return sendResponseError("Invoice date is required!");
    }

    for (const [key, item] of Object.entries(items)) {
      item.medicine =
        item?.medicine && (await Medicine.findById(item?.medicine));

      if (!item?.medicine) {
        return sendResponseError("Missing Medicine Name!");
      }

      if (
        !item?.stock ||
        !(item.stock = await Stock.findById(item?.stock).populate("medicine"))
      ) {
        return sendResponseError(
          `Please select the batch id for item '${item?.medicine?.name}'!`
        );
      }

      // if (!/^\d{1,2}\/\d{2}$/.test(item?.stock?.expiry)) {
      //   return sendResponseError(
      //     `Expiry must be in MM/YY! for medicine '${medicine.name}'!`
      //   );
      // }

      if (item?.quantity <= 0) {
        return sendResponseError(
          `Invalid quantity for item '${item.stock.medicine.name}'!`
        );
      }

      if (item.stock.stock - item.stock.sold <= 0) {
        return sendResponseError(
          `There is no enough stock for item '${item.stock.medicine.name}'!`
        );
      }

      if (item?.quantity > item.stock.stock - item.stock.sold) {
        return sendResponseError(
          `Maximum ${
            item.stock.stock - item.stock.sold
          } quantity can be selected for item '${item.stock.medicine.name}'!`
        );
      }

      if (item?.discount < 0) {
        return sendResponseError(
          `Invalid discount % for item '${item.stock.medicine.name}'!`
        );
      }

      invoiceDetails.subtotal += item?.quantity * item.stock.mrp;
      const discountAmt = item.discount
        ? (item?.quantity * item.stock.mrp * item.discount) / 100
        : 0;
      invoiceDetails.discount += discountAmt;
      invoiceDetails.total += item?.quantity * item.stock.mrp - discountAmt;

      items[key] = { ...item, stock: item.stock };
    }

    const invoiceExist = await Invoice.findOne({
      invoiceNumber: invoiceDetails.invoiceNumber,
    });
    if (invoiceExist) {
      return sendResponseError(
        `Invoice with invoice number '${invoiceDetails.invoiceNumber}' already exist!`
      );
    }

    const authRes = await authenticateUser();
    if (authRes) return sendResponseError(authRes);

    const newInvoice = await Invoice.create({
      ...invoiceDetails,
      customer: customer.id,
    });

    newInvoice.sales = [];
    for (const item of Object.values(items)) {
      const saleData = {
        customer: customer.id,
        invoiceNumber: newInvoice._id,
        medicine: item.medicine._id,
        batchId: item.stock.batchId,
        expiry: item.stock.expiry,
        quantity: item.quantity,
        mrp: item.mrp,
        discount: item.discount,
      };

      const newSale = await Sale.create(saleData);
      newInvoice.sales.push(newSale);

      const soldQuantity = Number(item.stock.sold) + Number(item.quantity);
      const result = await Stock.findByIdAndUpdate(item.stock._id, {
        sold: soldQuantity,
      });
    }

    return sendResponseSuccess("Invoice saved!", newInvoice);
  } catch (error) {
    return sendServerError(error);
  }
}
