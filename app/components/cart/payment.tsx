"use client"
import { useState } from 'react';
import { Package, User, Phone, MessageCircle, MapPin, Check, Copy } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from "@/lib/client-store";
import { createOrder } from "@/lib/actions/create-order";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";

// Define the form data type
type FormData = {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: string;
};

export default function CheckoutForm() {
  const { cart, clearCart, setCheckoutProgress } = useCartStore();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'palmpay'
  });

  const [copied, setCopied] = useState(false);

  const accountNumber = '9166813017';
  const accountName = 'Johnson Busayo Deborah';

  // Calculate total from cart - handle custom pricing
  const total = cart.reduce((sum, item) => {
    const itemPrice = item.customization?.totalPrice || item.price;
    return sum + (itemPrice * item.variant.quantity);
  }, 0);

  const { execute, status } = useAction(createOrder, {
    onSuccess: ({ data }) => {
      if ((data as { success?: boolean })?.success) {
        clearCart();
        toast.success("Order created successfully!");
        // Set checkout progress to navigate to confirmation page
        setCheckoutProgress("confirmation-page");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to create order");
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate form - Fixed TypeScript error
    const requiredFields: (keyof FormData)[] = ['fullName', 'email', 'phone', 'whatsapp', 'address', 'city', 'state', 'postalCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare order data with complete product information
    const orderData = {
      products: cart.map(item => ({
        productID: item.id,
        variantID: item.variant.variantID,
        quantity: item.variant.quantity,
        name: item.name,
        price: item.customization?.totalPrice || item.price, // Use custom price if available
        image: item.image,
        customization: item.customization, // Include customization data
      })),
      status: "pending",
      total,
      customerInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
      },
      paymentMethod: formData.paymentMethod,
    };

    execute(orderData);
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Complete Your Order
          </h1>
          <p className="text-gray-600 text-lg">Total: ₦{total.toLocaleString()}</p>
        </div>

        {/* Enhanced Order Summary with Customization Details */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <h2 className="text-2xl font-bold text-white">Order Summary</h2>
          </div>
          <div className="p-6">
            {cart.map((item) => {
              const itemPrice = item.customization?.totalPrice || item.price;
              const itemTotal = itemPrice * item.variant.quantity;
              
              return (
                <div key={`${item.id}-${item.variant.variantID}-${JSON.stringify(item.customization)}`} 
                     className="py-4 border-b last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.variant.quantity}</p>
                        
                        {/* Display customization details */}
                        {item.customization && (
                          <div className="mt-2 p-3 bg-pink-50 rounded-lg border border-pink-200">
                            <div className="text-xs text-pink-800 font-medium mb-1">Custom Cake Details:</div>
                            <div className="text-xs text-gray-700 space-y-1">
                              <div><strong>Size:</strong> {item.customization.size}</div>
                              <div><strong>Layers:</strong> {item.customization.layers}</div>
                              {item.customization.flavour && item.customization.flavour !== 'None' && (
                                <div><strong>Flavour:</strong> {item.customization.flavour}</div>
                              )}
                              {item.customization.toppings && item.customization.toppings.length > 0 && (
                                <div><strong>Toppings:</strong> {item.customization.toppings.join(', ')}</div>
                              )}
                              {item.customization.addOns && item.customization.addOns.length > 0 && (
                                <div><strong>Add-Ons:</strong> {item.customization.addOns.join(', ')}</div>
                              )}
                              {item.customization.message && (
                                <div><strong>Message:</strong> "{item.customization.message}"</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="font-semibold text-gray-900">
                        ₦{itemTotal.toLocaleString()}
                      </div>
                      {item.customization && (
                        <div className="text-xs text-gray-500">
                          ₦{itemPrice.toLocaleString()} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <h2 className="text-2xl font-bold text-white">Checkout Details</h2>
          </div>

          <div className="p-8 space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <Phone className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="+234 xxx xxx xxxx"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-3.5 w-5 h-5 text-green-500" />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="+234 xxx xxx xxxx"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <MapPin className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-900">Shipping Address</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Street Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Enter your complete address"
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="City"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="State"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="100001"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-6 h-6 relative">
                  <Image 
                    src="/Palmpay.jpg" 
                    alt="PalmPay Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Payment Method</h3>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 relative">
                    <Image 
                      src="/Palmpay.jpg" 
                      alt="PalmPay Logo" 
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900">PalmPay</h4>
                    <p className="text-sm text-gray-600">Secure and instant payment</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 space-y-4">
                  {/* Account Number - Mobile First Design */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Account Number:</div>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="font-mono text-lg font-bold text-gray-900 tracking-wider">
                        {accountNumber}
                      </span>
                      <button
                        onClick={copyAccountNumber}
                        className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                        title="Copy account number"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Account Name - Stack on Mobile */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Account Name:</div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {accountName}
                      </span>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Amount:</div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <span className="font-bold text-lg text-green-600">
                        ₦{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {copied && (
                    <div className="text-center py-2">
                      <span className="text-sm text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full">
                        ✓ Account number copied!
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <strong>Payment Instructions:</strong> Transfer the exact amount ₦{total.toLocaleString()} to the account above. 
                    Your order will be processed after payment confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === 'executing'}
                className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  status === 'executing'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {status === 'executing' ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  'Complete Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}