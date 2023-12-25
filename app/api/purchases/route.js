import Medicine from "@/models/medicine";
import Purchase from "@/models/purchase";
import Stock from "@/models/stock";
import Supplier from "@/models/supplier";
import dbConnection from "@/utils/dbConnection";
import { defaultPaymentStatusesOptions } from "@/utils/defaults";
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

    const supplier = params.get("supplier") ?? "";
    const paymentStatus = params.get("paymentStatus") ?? "";

    let invoiceDate = params.get("invoiceDate");
    invoiceDate = invoiceDate ? new Date(invoiceDate) : "";

    const findParams = {
      date: invoiceDate || { $gte: start, $lt: end },
    };

    if (supplier) {
      findParams.supplier = supplier;
    }

    if (paymentStatus) {
      findParams.paymentStatus = paymentStatus;
    }

    const purchases = await Purchase.find(findParams)
      .populate("supplier")
      .skip(page * limit)
      .limit(limit)
      .sort({ [orderBy]: order });

    const purchasesCount = await Purchase.find(findParams).count();

    const purchaseTotal = await Purchase.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    return sendResponseSuccess("Purchases fetched successfully...", {
      count: purchasesCount,
      purchases,
      purchaseTotal: purchaseTotal[0]?.totalAmount,
    });
  } catch (error) {
    return sendServerError(error);
  }
}

export async function POST(req) {
  try {
    await dbConnection();
    const data = await req.json();

    const { purchaseDetails, medicines } = data;
    purchaseDetails.amount = 0;

    if (
      !purchaseDetails?.supplier ||
      (!purchaseDetails?.supplier?.id &&
        !(await Supplier.findById(purchaseDetails.supplier)))
    ) {
      return sendResponseError("Invalid Supplier!");
    }

    if (
      !purchaseDetails.invoiceNumber ||
      isNaN(Number(purchaseDetails.invoiceNumber))
    ) {
      return sendResponseError("Invalid invoice number!");
    }

    if (
      !purchaseDetails.paymentStatus ||
      !Object(defaultPaymentStatusesOptions)
        .map((option) => option.id)
        .includes(purchaseDetails.paymentStatus)
    ) {
      return sendResponseError("Invalid payment status!");
    }

    if (!purchaseDetails.date) {
      return sendResponseError("Invoice date is required!");
    }

    let medicine;
    for (medicine of Object.values(medicines)) {
      const id = medicine?.id?.trim();
      const name = medicine?.name?.trim();
      const expiry = medicine?.expiry?.trim();
      const quantity = Number(medicine?.quantity?.trim());
      const mrp = Number(medicine?.mrp?.trim());
      const rate = Number(medicine?.rate?.trim());
      const genericName = medicine?.genericName?.trim();

      if (!id && !name) {
        return sendResponseError("Missing Medicine Name!");
      }
      if (!/^\d{1,2}\/\d{2}$/.test(expiry)) {
        return sendResponseError(
          `Expiry must be in MM/YY! for medicine '${name}'!`
        );
      }
      if (quantity <= 0) {
        return sendResponseError(`Invalid quantity for medicine '${name}'!`);
      }
      if (mrp <= 0) {
        return sendResponseError(`Invalid MRP for medicine '${name}'!`);
      }
      if (rate <= 0) {
        return sendResponseError(`Invalid Rate for medicine '${name}'!`);
      }
      if (rate > mrp) {
        return sendResponseError(
          `Rate must be less than MRP for medicine '${name}'!`
        );
      }
      if (!id && name && !genericName) {
        return sendResponseError(`Generic name is required for new '${name}'!`);
      }

      purchaseDetails.amount += quantity * rate;
    }

    const purchaseExist = await Purchase.findOne({
      invoiceNumber: purchaseDetails.invoiceNumber,
    });
    if (purchaseExist) {
      return sendResponseError(
        `Purchase with invoice number '${purchaseDetails.invoiceNumber}' already exist!`
      );
    }

    const authRes = await authenticateUser();
    if (authRes) return sendResponseError(authRes);

    const newPurchase = await Purchase.create(purchaseDetails);

    for (medicine of Object.values(medicines)) {
      let id = medicine?.id?.trim();
      const name = medicine?.name?.trim();
      const packing = medicine?.packing?.trim().replace(" ", "").toUpperCase();
      const batchId = medicine?.batchId?.trim().toUpperCase();
      const expiry = medicine?.expiry?.trim();
      const quantity = Number(medicine?.quantity?.trim());
      const mrp = Number(medicine?.mrp?.trim());
      const rate = Number(medicine?.rate?.trim());
      const genericName = medicine?.genericName?.trim();

      const medicineExist = medicine.id
        ? await Medicine.findById(medicine.id)
        : false;

      if (!medicineExist) {
        const newMedicine = await Medicine.create({
          name,
          packing,
          genericName,
          supplier: purchaseDetails.supplier,
        });

        id = newMedicine._id;
      }

      let stockExist = await Stock.findOne({
        $and: [{ name }, { packing }],
      });

      stockExist = false;

      const stockData = {
        medicine: id,
        batchId,
        expiry,
        stock: Number(quantity),
        mrp,
        rate,
        purchase: newPurchase._id,
      };

      let newStock;
      if (stockExist) {
        stockData.stock += Number(stockExist.quantity);
        newStock = await Stock.findByIdAndUpdate(stockExist._id, stockData);
      } else {
        newStock = await Stock.create(stockData);
      }
    }

    return sendResponseSuccess("Purchase added successfully", newPurchase);
  } catch (error) {
    return sendServerError(error);
  }
}
