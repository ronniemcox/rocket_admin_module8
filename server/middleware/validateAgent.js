export default function validateAgent(req, res, next) {
  const body = req.body ?? {};

  // Required fields for CREATE (POST)
  const requiredFields = [
    "first_name",
    "last_name",
    "email",
    "region",
    "fee",
    "rating",
    "sales",
  ];

  // For PATCH, allow partial updates (only validate provided fields)
  const isPatch = req.method === "PATCH";

  const errors = [];

  const isEmptyString = (v) =>
    typeof v === "string" && v.trim().length === 0;

  const isNumberLike = (v) =>
    typeof v === "number" || (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v)));

  const normalizeNumber = (v) => (typeof v === "number" ? v : Number(v));

  const allowedRegions = ["north", "south", "east", "west"];

  // Validate required fields on POST
  if (!isPatch) {
    for (const f of requiredFields) {
      if (!(f in body)) errors.push(`${f} is required`);
      else if (isEmptyString(body[f])) errors.push(`${f} cannot be empty`);
    }
  }

  // Validate fields if present (POST or PATCH)
  if ("email" in body) {
    const email = String(body.email).trim().toLowerCase();
    const ok = /^\S+@\S+\.\S+$/.test(email);
    if (!ok) errors.push("email is invalid");
    req.body.email = email;
  }

  if ("region" in body) {
    const region = String(body.region).trim().toLowerCase();
    if (!allowedRegions.includes(region)) {
      errors.push(`region must be one of: ${allowedRegions.join(", ")}`);
    }
    req.body.region = region;
  }

  if ("fee" in body) {
    if (!isNumberLike(body.fee)) errors.push("fee must be a number");
    else {
      const n = normalizeNumber(body.fee);
      if (n < 0) errors.push("fee must be >= 0");
      req.body.fee = n;
    }
  }

  if ("rating" in body) {
    if (!isNumberLike(body.rating)) errors.push("rating must be a number");
    else {
      const n = normalizeNumber(body.rating);
      if (n < 0 || n > 100) errors.push("rating must be between 0 and 100");
      req.body.rating = n;
    }
  }

  if ("sales" in body) {
    if (!isNumberLike(body.sales)) errors.push("sales must be a number");
    else {
      const n = normalizeNumber(body.sales);
      if (n < 0) errors.push("sales must be >= 0");
      req.body.sales = n;
    }
  }

  if ("first_name" in body && isEmptyString(body.first_name)) errors.push("first_name cannot be empty");
  if ("last_name" in body && isEmptyString(body.last_name)) errors.push("last_name cannot be empty");

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  next();
}
