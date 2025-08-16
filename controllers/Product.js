const product = require("../models/Product");

const getAllProductsStatic = async (req, res, next) => {
  const products = await product.find({}).sort("-name");
  res.status(200).json({ noofHits: products.length, products });
};

const getAllProducts = async (req, res, next) => {
  const search = {};
  const { featured, company, name, sort, numericFilters, fields, limit, page } =
    req.query;

  if (featured) {
    search.featured = featured === "true" ? true : false;
  }

  if (company) {
    search.company = company;
  }

  if (name) {
    search.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      "<": "$lt",
      ">=": "$gte",
      "<=": "$lte",
      "=": "$eq",
    };

    const regEx = /(<|>|<=|>=|=)/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `_${operatorMap[match]}_`
    );
    console.log(filters);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("_");

      //   console.log(`field ${field} operator ${operator} value ${value}`);
      if (options.includes(field)) {
        search[field] = { [operator]: Number(value) };
      }
    });
  }

  //   console.log(search);

  let result = product.find(search);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result.sort(sortList);
  } else {
    result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  const limitNum = Number(limit) || 10;
  const pageNum = Number(page) || 1;

  result = result.skip((pageNum - 1) * limitNum);

  result = result.limit(limitNum);

  const products = await result;
  res.status(200).json({ noofHits: products.length, products });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
