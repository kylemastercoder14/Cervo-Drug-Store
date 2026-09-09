-- Keep the newest copy of each normalized product and preserve all relations.
BEGIN;

CREATE TEMP TABLE "_ProductDuplicateMap" ON COMMIT DROP AS
WITH ranked_products AS (
  SELECT
    "id",
    FIRST_VALUE("id") OVER (
      PARTITION BY LOWER(BTRIM(REGEXP_REPLACE("name", '[[:space:]]+', ' ', 'g')))
      ORDER BY "createdAt" DESC, "id" DESC
    ) AS "keeperId",
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(BTRIM(REGEXP_REPLACE("name", '[[:space:]]+', ' ', 'g')))
      ORDER BY "createdAt" DESC, "id" DESC
    ) AS "duplicateRank"
  FROM "Products"
)
SELECT "id" AS "duplicateId", "keeperId"
FROM ranked_products
WHERE "duplicateRank" > 1;

UPDATE "OrderItems" AS order_item
SET "productId" = duplicate_map."keeperId"
FROM "_ProductDuplicateMap" AS duplicate_map
WHERE order_item."productId" = duplicate_map."duplicateId";

UPDATE "Inventory" AS inventory
SET "productId" = duplicate_map."keeperId"
FROM "_ProductDuplicateMap" AS duplicate_map
WHERE inventory."productId" = duplicate_map."duplicateId";

DELETE FROM "Products" AS product
USING "_ProductDuplicateMap" AS duplicate_map
WHERE product."id" = duplicate_map."duplicateId";

-- Canonical names/tags prevent whitespace-only variants from returning.
UPDATE "Products"
SET
  "name" = BTRIM(REGEXP_REPLACE("name", '[[:space:]]+', ' ', 'g')),
  "tags" = REPLACE(
    REGEXP_REPLACE(
      REPLACE(LOWER(BTRIM(REGEXP_REPLACE("name", '[[:space:]]+', ' ', 'g'))), ',', ''),
      '[[:space:]]+',
      '-',
      'g'
    ),
    '&',
    'and'
  );

CREATE UNIQUE INDEX IF NOT EXISTS "Products_tags_key" ON "Products"("tags");

COMMIT;
