CREATE TABLE "custom_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"size" varchar(50) NOT NULL,
	"layers" varchar(50) NOT NULL,
	"flavour" varchar(50),
	"cream_type" varchar(100),
	"toppings" varchar(100),
	"add_ons" json,
	"message" text,
	"total" integer NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"whatsapp" varchar(20),
	"address" varchar(500) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"created" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "custom_orders" ADD CONSTRAINT "custom_orders_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;