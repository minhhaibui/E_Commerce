import modelProduct from "../models/product.js";
import asynHandler from "express-async-handler";
import slugify from "slugify";

const createProduct = asynHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await modelProduct.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    newProduct: newProduct ? newProduct : "can't create product",
  });
});

const getProduct = asynHandler(async (req, res) => {
  const { id } = req.params;
  const product = await modelProduct.findById(id);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "product not found",
  });
});
//filtering, sorting , pagination
const getProducts = asynHandler(async (req, res) => {
  const queries = { ...req.query };
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  //fittering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = modelProduct.find(formatedQueries);

  //sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  // fields limiting
  if (req.query.fields) {
    const fields = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  //pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMITPAGE;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  try {
    const response = await queryCommand.exec();
    const length = response.length;
    // const counts = await modelProduct.countDocuments(formatedQueries);
    return res.status(200).json({
      success: response ? true : false,
      // counts,
      length,
      productsData: response ? response : "can not get product",
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

const updateProduct = asynHandler(async (req, res) => {
  const { id } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updateProduct = await modelProduct.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateProduct ? true : false,
    updateProduct: updateProduct ? updateProduct : "can't update product",
  });
});

const deleteProduct = asynHandler(async (req, res) => {
  const { id } = req.params;
  const deleteProduct = await modelProduct.findByIdAndDelete(id, { new: true });
  return res.status(200).json({
    success: deleteProduct ? true : false,
    deleteProduct: deleteProduct ? deleteProduct : "can't delete product",
  });
});
const ratings = asynHandler(async (req, res) => {
  const { _id } = req.user;

  const { star, comment, pid } = req.body;

  if (!star || !pid) throw new Error("missing inputsssss");
  const ratingProduct = await modelProduct.findById(pid);
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );
  console.log("alreadyRating", alreadyRating);
  if (alreadyRating) {
    // update them coment
    await modelProduct.updateOne(
      { ratings: { $elemMatch: alreadyRating } },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      }
    );
  } else {
    const response = await modelProduct.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
  }
  const updatedRatingProduct = await modelProduct.findById(pid);
  const ratingsCount = updatedRatingProduct.ratings.length;
  const sumRatings = updatedRatingProduct.ratings.reduce(
    (sum, el) => sum + Number(el.star),
    0
  );
  updatedRatingProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingsCount) / 10;
  await updatedRatingProduct.save();
  return res.status(200).json({
    status: true,
    updatedRatingProduct,
  });
});

const upLoadImagesProduct = asynHandler(async (req, res) => {
  console.log(req.files);
  const { pid } = req.params;
  if (!req.files) throw new Error("missing input");
  const response = await modelProduct.findByIdAndUpdate(
    pid,
    {
      $push: {
        images: {
          $each: req.files.map((el) => el.path),
        },
      },
    },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    updatedProduct: response ? response : "can't upload images product",
  });
});
export default {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  upLoadImagesProduct,
};
