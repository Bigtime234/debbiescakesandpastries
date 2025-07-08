CREATE TABLE "productVariants" (
	"id" serial PRIMARY KEY NOT NULL,
	"color" text NOT NULL,
	"productType" text NOT NULL,
	"updated" timestamp DEFAULT now(),
	"productID" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"title" text NOT NULL,
	"created" timestamp DEFAULT now(),
	"price" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" real NOT NULL,
	"userID" text NOT NULL,
	"productID" serial NOT NULL,
	"comment" text NOT NULL,
	"created" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "variantImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"size" real NOT NULL,
	"name" text NOT NULL,
	"order" real NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variantTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "productVariants" ADD CONSTRAINT "productVariants_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variantImages" ADD CONSTRAINT "variantImages_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variantTags" ADD CONSTRAINT "variantTags_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "productIdx" ON "reviews" USING btree ("productID");--> statement-breakpoint
CREATE INDEX "userIdx" ON "reviews" USING btree ("userID");