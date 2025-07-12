ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paymentMethod" text DEFAULT 'PalmPay';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customerName" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customerEmail" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customerPhone" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customerWhatsapp" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingAddress" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingCity" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingState" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shippingPostalCode" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updatedAt" timestamp DEFAULT now();