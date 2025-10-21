-- Update CategoryType enum to include finance categories
CREATE TYPE "CategoryTypeNew" AS ENUM (
  'STOCKS', 'COMMODITIES', 'FOREX', 'BONDS', 'INDICES', 'ETFS', 
  'CRYPTO', 'ECONOMICS', 'MARKETS', 'TECHNOLOGY', 'ENERGY', 'HEALTHCARE',
  'FINANCIAL_SERVICES', 'REAL_ESTATE', 'CONSUMER_GOODS', 'INDUSTRIALS'
);

-- Add new column with new enum type
ALTER TABLE "articles" ADD COLUMN "primaryCategoryNew" "CategoryTypeNew";

-- Add new column to news_sources
ALTER TABLE "news_sources" ADD COLUMN "primaryCategoryNew" "CategoryTypeNew";

-- Migrate existing data to new categories
UPDATE "articles" SET "primaryCategoryNew" = CASE 
  WHEN "primaryCategory" = 'BITCOIN' THEN 'CRYPTO'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'ALTCOINS' THEN 'CRYPTO'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'DEFI' THEN 'CRYPTO'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'MACRO' THEN 'ECONOMICS'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'WEB3' THEN 'TECHNOLOGY'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'NFT' THEN 'CRYPTO'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'GAMING' THEN 'TECHNOLOGY'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'METAVERSE' THEN 'TECHNOLOGY'::"CategoryTypeNew"
  ELSE 'MARKETS'::"CategoryTypeNew"
END;

-- Update news_sources
UPDATE "news_sources" SET "primaryCategoryNew" = CASE 
  WHEN "primaryCategory" = 'BITCOIN' THEN 'CRYPTO'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'ALTCOINS' THEN 'CRYPTO'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'DEFI' THEN 'CRYPTO'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'MACRO' THEN 'ECONOMICS'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'WEB3' THEN 'TECHNOLOGY'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'NFT' THEN 'CRYPTO'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'GAMING' THEN 'TECHNOLOGY'::"CategoryTypeNew"
  WHEN "primaryCategory" = 'METAVERSE' THEN 'TECHNOLOGY'::"CategoryTypeNew"
  ELSE 'MARKETS'::"CategoryTypeNew"
END;

-- Drop old columns
ALTER TABLE "articles" DROP COLUMN "primaryCategory";
ALTER TABLE "news_sources" DROP COLUMN "primaryCategory";

-- Rename new columns
ALTER TABLE "articles" RENAME COLUMN "primaryCategoryNew" TO "primaryCategory";
ALTER TABLE "news_sources" RENAME COLUMN "primaryCategoryNew" TO "primaryCategory";

-- Drop old enum type
DROP TYPE "CategoryType";

-- Rename new enum type
ALTER TYPE "CategoryTypeNew" RENAME TO "CategoryType";

-- Update categories table with new finance categories
DELETE FROM "categories";

INSERT INTO "categories" ("id", "name", "slug", "createdAt", "updatedAt") VALUES
('cat_stocks', 'Stocks', 'stocks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_commodities', 'Commodities', 'commodities', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_forex', 'Forex', 'forex', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_bonds', 'Bonds', 'bonds', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_indices', 'Indices', 'indices', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_etfs', 'ETFs', 'etfs', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_crypto', 'Crypto', 'crypto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_economics', 'Economics', 'economics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_markets', 'Markets', 'markets', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_technology', 'Technology', 'technology', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_energy', 'Energy', 'energy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_healthcare', 'Healthcare', 'healthcare', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_financial_services', 'Financial Services', 'financial-services', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_real_estate', 'Real Estate', 'real-estate', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_consumer_goods', 'Consumer Goods', 'consumer-goods', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_industrials', 'Industrials', 'industrials', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Update article-category relationships
DELETE FROM "article_categories";

INSERT INTO "article_categories" ("id", "articleId", "categoryId", "createdAt")
SELECT 
    gen_random_uuid(),
    a."id",
    c."id",
    CURRENT_TIMESTAMP
FROM "articles" a
JOIN "categories" c ON c."name" = a."primaryCategory"::text
ON CONFLICT ("articleId", "categoryId") DO NOTHING;
