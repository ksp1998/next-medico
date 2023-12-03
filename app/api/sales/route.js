import Invoice from "@/models/invoice";
import dbConnection from "@/utils/dbConnection";
import { sendResponseSuccess, sendServerError } from "@/utils/functions";

export async function GET(req, res) {
  try {
    await dbConnection();
    const params = req.nextUrl.searchParams;

    // const today = params.get("today");

    // if (today) {
    // }

    let today = new Date();
    const d = today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the start of the day
    // today.setMilliseconds(d); // Use find for debugging purposes

    today = new Date(
      `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}T00:00:00.000Z`
    );

    const response = await Invoice.aggregate([
      {
        $match: {
          date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$total" },
        },
      },
    ]);

    return sendResponseSuccess("Sales fetched successfully...", {
      response,
      today: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    });

    // .exec((findErr, findResult) => {
    //   if (findErr) {
    //     console.error("Error during find:", findErr);
    //     return;
    //   }

    //   console.log("Documents found during find:", findResult);

    //   // Now, use aggregate
    //   Invoice.aggregate([
    //     {
    //       $match: {
    //         date: {
    //           $gte: today,
    //           $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next day
    //         },
    //       },
    //     },
    //     {
    //       $group: {
    //         _id: null,
    //         totalAmount: { $sum: "$total" }, // Assuming 'total' is the field to sum
    //       },
    //     },
    //   ]).exec((aggErr, result) => {
    //     if (aggErr) {
    //       console.error("Error during aggregation:", aggErr);
    //       return;
    //     }

    //     console.log("Aggregation Result:", result);

    //     if (result.length > 0) {
    //       const totalAmount = result[0].totalAmount;
    //       console.log(`Total amount for today: ${totalAmount}`);
    //     } else {
    //       console.log("No invoices found for today.");
    //     }
    //   });
    // });

    return sendResponseSuccess("Sales fetched successfully...", {
      response,
      today,
    });
  } catch (error) {
    return sendServerError(error);
  }
}
