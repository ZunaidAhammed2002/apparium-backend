import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Contact } from "../models/contact.model.js";
import { sendSupportMessage } from "../utils/sendSupportMessage.js";

const submitQuery = asyncHandler(async (req, res) => {
  const { name, email, number, message } = req.body;

  if ([name, email, number, message].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please send all required fields");
  }

  const contact = await Contact.create({
    name,
    email,
    number,
    message,
  });

  const getContact = await Contact.findById(contact._id).select(
    "-_id -__v -updatedAt -createdAt"
  );

  if (!getContact)
    throw new ApiError(400, "Something went wrong while posting the query.");

  await sendSupportMessage(name, email);

  return res
    .status(200)
    .json(new ApiResponse(200, getContact, "Query submitted successfully."));
});

const getAllQueries = asyncHandler(async (req, res) => {
  const { offset = 0, limit = 8, range = "7 days" } = req.query;

  // Calculate the date range filter
  let dateFilter = {};
  const currentDate = new Date();
  switch (range) {
    case "7 days":
      dateFilter = {
        createdAt: {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)),
        },
      };
      break;
    case "30 days":
      dateFilter = {
        createdAt: {
          $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
        },
      };
      break;
    case "90 days":
      dateFilter = {
        createdAt: {
          $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 3)),
        },
      };
      break;
    // Add more ranges as needed
    default:
      dateFilter = {};
  }

  const allQueries = await Contact.find(dateFilter)
    .select("-__v -updatedAt -createdAt")
    .skip(parseInt(offset))
    .limit(parseInt(limit));

  if (!allQueries) {
    throw new ApiError(400, "Something went wrong while fetching the queries.");
  }

  const totalUnseenItems = await Contact.countDocuments({
    ...dateFilter,
    isSeen: false,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { queries: allQueries, totalUnseenItems },
        "All queries fetched successfully."
      )
    );
});

const seenMessage = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  if (!_id) throw new ApiError(400, "ID is required to find the document.");

  const query = await Contact.findById(_id);

  if (!query)
    throw new ApiError(400, "Any query with provided id does not exist.");

  query.isSeen = true;

  await query.save();

  return res
    .status(200)
    .json(new ApiResponse(200, query, "Query seen successfully."));
});

const deleteQuery = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  if (!_id) throw new ApiError(400, "ID is required to find the document.");

  const isQueryExists = await Contact.findById(_id);

  if (!isQueryExists)
    throw new ApiError(404, "Any query with provided id does not exist");

  const query = await Contact.deleteOne({
    _id: isQueryExists._id,
  });

  if (!query)
    throw new ApiError(400, "Something went wrong while deleting the query.");

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Query deleted successfully."));
});

const getRangeQueries = asyncHandler(async (req, res) => {
  const { days } = req.body;

  const today = new Date();

  const previousDate = new Date(today);
  previousDate.setDate(today.getDate() - days);

  const queries = await Contact.find({
    createdAt: {
      $gte: previousDate,
      $lt: today,
    },
  }).select("-__v -updatedAt");

  return res
    .status(200)
    .json(
      new ApiResponse(200, queries, `All the queries of last ${days} days.`)
    );
});

export {
  submitQuery,
  seenMessage,
  getAllQueries,
  deleteQuery,
  getRangeQueries,
};
