"use server";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { orders, customOrders, orderProduct } from "@/server/schema";
import { Resend } from "resend";
import { createSafeActionClient } from "next-safe-action";
import { createOrderSchema } from "@/types/order-schema";

const resend = new Resend(process.env.RESEND_API_KEY);
const action = createSafeActionClient();

export const createOrder = action.schema(createOrderSchema).action(
  async ({ parsedInput }) => {
    const user = await auth();
    if (!user) return { error: "Unauthorized" };

    try {
      const { products, status, total, customerInfo, paymentMethod, isCustomCake, customCake } = parsedInput;

      // 1. Create base order
      const [order] = await db.insert(orders).values({
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
      }).returning();

      // 2. Handle products (both regular and custom cakes)
      if (products?.length) {
        await Promise.all(
          products.map(async (item) => {
            // First, insert the basic order product
            await db.insert(orderProduct).values({
              quantity: item.quantity,
              orderID: order.id,
              productID: item.productID,
              productVariantID: item.variantID,
            });

            // If this product has customization data, also insert into customOrders
            if (item.customization) {
              const customization = item.customization;
              
              await db.insert(customOrders).values({
                orderID: order.id,
                userID: user.user.id,
                size: customization.size,
                layers: customization.layers,
                flavour: customization.flavour || null,
                creamType: customization.creamType || 'Standard Buttercream',
                toppings: customization.toppings 
                  ? (Array.isArray(customization.toppings) 
                      ? customization.toppings.join(', ') 
                      : customization.toppings)
                  : null,
                // Fix: Keep addOns as array or convert to array if string
                addOns: customization.addOns 
                  ? (Array.isArray(customization.addOns) 
                      ? customization.addOns 
                      : [customization.addOns])
                  : null,
                message: customization.message || null,
                total: customization.totalPrice || item.price,
                fullName: customerInfo.fullName,
                email: customerInfo.email,
                phone: customerInfo.phone,
                whatsapp: customerInfo.whatsapp,
                address: customerInfo.address,
                city: customerInfo.city,
                state: customerInfo.state,
                postalCode: customerInfo.postalCode,
                paymentMethod: paymentMethod,
              });
            }
          })
        );
      }

      // 3. Handle legacy custom cake (if still using the old way)
      if (isCustomCake && customCake) {
        const customization = customCake;
        
        await db.insert(customOrders).values({
          orderID: order.id,
          userID: user.user.id,
          size: customization.size,
          layers: customization.layers,
          flavour: customization.flavour || null,
          creamType: customization.creamType || 'Standard Buttercream',
          toppings: customization.toppings 
            ? (Array.isArray(customization.toppings) 
                ? customization.toppings.join(', ') 
                : customization.toppings)
            : null,
          // Fix: Keep addOns as array or convert to array if string
          addOns: customization.addOns 
            ? (Array.isArray(customization.addOns) 
                ? customization.addOns 
                : [customization.addOns])
            : null,
          message: customization.message || null,
          total: total,
          fullName: customerInfo.fullName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          whatsapp: customerInfo.whatsapp,
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          postalCode: customerInfo.postalCode,
          paymentMethod: paymentMethod,
        });
      }

      // 4. Enhanced email with better customization display
      const customCakeDetails = products?.filter(p => p.customization).map(p => ({
        name: p.name,
        customization: p.customization!,  // Non-null assertion since we filtered
        quantity: p.quantity,
        price: p.price
      })) || [];

      const regularProducts = products?.filter(p => !p.customization).map(p => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price
      })) || [];

      const { data, error } = await resend.emails.send({
        from: 'Debbies Cakes <onboarding@resend.dev>',
        to: 'debbiescakesandpastries1@gmail.com',
        subject: `🎂 Order Confirmation #${order.id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h1 style="color: #ec4899; text-align: center;">Thank You For Your Order!</h1>
            <p style="font-size: 18px; text-align: center; margin-bottom: 30px;">Order #${order.id}</p>
            
            ${customCakeDetails.length > 0 ? `
              <div style="background-color: #fdf2f8; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ec4899;">
                <h2 style="color: #be185d; margin-top: 0;">Your Custom Cakes</h2>
                ${customCakeDetails.map(cake => `
                  <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f3e8ff;">
                    <h3 style="color: #7c3aed; margin: 0 0 10px 0;">${cake.name} (Qty: ${cake.quantity})</h3>
                    <p><strong>Size:</strong> ${cake.customization.size}</p>
                    <p><strong>Layers:</strong> ${cake.customization.layers}</p>
                    ${cake.customization.flavour && cake.customization.flavour !== 'None' ? `<p><strong>Flavour:</strong> ${cake.customization.flavour}</p>` : ''}
                    ${cake.customization.toppings?.length ? `<p><strong>Toppings:</strong> ${Array.isArray(cake.customization.toppings) ? cake.customization.toppings.join(', ') : cake.customization.toppings}</p>` : ''}
                    ${cake.customization.addOns?.length ? `<p><strong>Add-Ons:</strong> ${Array.isArray(cake.customization.addOns) ? cake.customization.addOns.join(', ') : cake.customization.addOns}</p>` : ''}
                    ${cake.customization.message ? `<p><strong>Message:</strong> "${cake.customization.message}"</p>` : ''}
                    <p><strong>Price:</strong> ₦${cake.price.toLocaleString()}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${regularProducts.length > 0 ? `
              <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #0ea5e9;">
                <h2 style="color: #0369a1; margin-top: 0;">Regular Products</h2>
                ${regularProducts.map(product => `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>${product.name} (x${product.quantity})</span>
                    <span><strong>₦${product.price.toLocaleString()}</strong></span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div style="margin-bottom: 20px;">
              <h2 style="color: #7c3aed; margin-top: 0;">Customer Details</h2>
              <p><strong>Name:</strong> ${customerInfo.fullName}</p>
              <p><strong>Email:</strong> ${customerInfo.email}</p>
              <p><strong>Phone:</strong> ${customerInfo.phone}</p>
              <p><strong>Address:</strong> ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.postalCode}</p>
            </div>

            <div style="background-color: #f5f3ff; padding: 15px; border-radius: 8px;">
              <h2 style="color: #7c3aed; margin-top: 0;">Order Summary</h2>
              <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("Email failed:", error);
        return { error: "Order created but email failed" };
      }

      return { success: true, orderId: order.id };

    } catch (err) {
      console.error("Order creation failed:", err);
      return { error: "Database error occurred" };
    }
  }
);