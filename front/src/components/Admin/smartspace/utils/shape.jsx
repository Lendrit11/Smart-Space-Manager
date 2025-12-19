// src/utils/shape.js
export const detectShape = (shape) => {
  if (shape === null || shape === undefined) return "Tavoline vogël";

  const normalize = (str) =>
    String(str)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const s = normalize(shape);

  const smallKeys = ["small", "vogel", "vogel", "vogël", "smalltable", "small_table", "small-table"];
  const largeKeys = ["large", "madhe", "big", "bigtable", "big_table"];
  const roundKeys = ["round", "rrethor", "rrethore", "circle", "roundtable"];

  if (smallKeys.some((k) => s === k || s.includes(k))) return "Tavoline vogël";
  if (largeKeys.some((k) => s === k || s.includes(k))) return "Tavoline e madhe";
  if (roundKeys.some((k) => s === k || s.includes(k))) return "Tavoline rrethore";

  try {
    if (typeof shape === "object") {
      const maybe = shape.type ?? shape.shape ?? shape.name ?? "";
      if (maybe) return detectShape(maybe);
    }
  } catch (e) {
    // noop
  }

  return "Tavoline vogël";
};
