"use server";

import { createOrderSchema } from "@/types/order-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/server/auth";
import { db } from "@/server";
import { orderProduct, orders, products } from "@/server/schema";
import { Resend } from "resend";

const action = createSafeActionClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const createOrder = action
  .schema(createOrderSchema)
  .action(async ({
    parsedInput: {
      products,
      status,
      total,
      customerInfo,
      paymentMethod,
    }
  }) => {
    const user = await auth();
    if (!user) return { error: "User not found" };

    try {
      // 1. Create order
      const [order] = await db
        .insert(orders)
        .values({
          status,
          total,
          userID: user.user.id,
          customerName: customerInfo.fullName,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerWhatsapp: customerInfo.whatsapp,
          shippingAddress: customerInfo.address,
          shippingCity: customerInfo.city,
          shippingState: customerInfo.state,
          shippingPostalCode: customerInfo.postalCode,
          paymentMethod,
          created: new Date(),
        })
        .returning();

      // 2. Insert order items
      await Promise.all(
        products.map(async ({ productID, quantity, variantID }) => {
          await db.insert(orderProduct).values({
            quantity,
            orderID: order.id,
            productID,
            productVariantID: variantID,
          });
        })
      );

      // 3. Get product names & prices for the email
      const productDetails = await Promise.all(
        products.map(async ({ productID, quantity }) => {
          const prod = await db.query.products.findFirst({
            where: (fields, operators) => operators.eq(fields.id, productID),
            columns: { title: true, price: true },
          });
          return {
            name: prod?.title || `Product #${productID}`,
            quantity,
            price: prod?.price ?? 0,
          };
        })
      );

      // 4. Compose email HTML
      const itemsHtml = productDetails
        .map(
          (item) =>
            `<li>${item.quantity} × ${item.name} — ₦${item.price.toLocaleString()}</li>`
        )
        .join("");

      const emailHtml = `
        <h2>🛒 New Order Received </h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${customerInfo.fullName}</p>
        <p><strong>Email:</strong> ${customerInfo.email}</p>
        <p><strong>Phone:</strong> ${customerInfo.phone}</p>
        <p><strong>WhatsApp:</strong> ${customerInfo.whatsapp}</p>
        <p><strong>Address:</strong> ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state}, ${customerInfo.postalCode}</p>
        <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Items:</strong></p>
        <ul>${itemsHtml}</ul>
      `;

      // 5. Send email using Resend
      const { error } = await resend.emails.send({
         from: 'Your website <onboarding@resend.dev>',
    to: "codebyriven@gmail.com", 
        subject: `🛒 New Order from ${customerInfo.fullName}`,
        html: emailHtml,
      });

      if (error) {
        console.error("Email send error:", error);
      }

      return {
        success: "Order has been created successfully",
        orderId: order.id
      };
    } catch (error) {
      console.error("Error creating order:", error);
      return { error: "Failed to create order" };
    }
  });
