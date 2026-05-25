export const BULK_PRODUCT_TEMPLATE_COLUMNS = [
  {
    label: "Product Name",
    field: "name",
    required: true,
    guide: "Required. Enter the product name.",
  },
  {
    label: "Description",
    field: "description",
    required: false,
    guide: "Optional. Short product details or summary.",
  },
  {
    label: "Price",
    field: "price",
    required: true,
    guide: "Required. Numbers only, for example 149.75.",
  },
  {
    label: "Category",
    field: "categoryTag",
    required: false,
    guide: "Optional. Use the saved category tag or leave blank.",
  },
  {
    label: "Show on Homepage",
    field: "isFeatured",
    required: false,
    guide: "Optional. Enter Yes or No.",
  },
  {
    label: "Prescription Required",
    field: "isPrescriptionRequired",
    required: false,
    guide: "Optional. Enter Yes or No.",
  },
  {
    label: "VAT Exempt",
    field: "isVatItem",
    required: false,
    guide: "Optional. Enter Yes or No.",
  },
  {
    label: "Image URL",
    field: "image",
    required: false,
    guide: "Optional. Paste a direct image link.",
  },
] as const;

export const BULK_PRODUCT_TEMPLATE_HEADERS = BULK_PRODUCT_TEMPLATE_COLUMNS.map(
  (column) => column.label
);

export const BULK_PRODUCT_TEMPLATE_HEADER_TO_FIELD =
  BULK_PRODUCT_TEMPLATE_COLUMNS.reduce<Record<string, string>>(
    (result, column) => {
      result[column.label] = column.field;
      return result;
    },
    {}
  );

export const BULK_PRODUCT_TEMPLATE_GUIDELINES = [
  "Do not rename, remove, or reorder the column headers in the Products sheet.",
  "Required columns: Product Name and Price.",
  "For Yes/No fields, you may use Yes, No, True, False, 1, or 0.",
  "Category should match an existing saved category tag in the system.",
  "Leave optional fields blank if they are not needed.",
  "Existing products with the same name or generated tag are updated during save.",
] as const;
