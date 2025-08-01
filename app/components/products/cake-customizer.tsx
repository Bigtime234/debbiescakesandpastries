"use client"

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Gift, Cake, Minus, Plus, Sparkles, Crown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import formatPrice from '@/lib/format-price';
import { useCartStore } from '@/lib/client-store';
import { toast } from 'sonner';

// Type definitions
type SizeType = '6 inches' | '8 inches' | '10 inches';
type LayerType = '1 layer' | '2 layers' | '3 layers';
type FlavourType = 'None' | 'Red Velvet' | 'Vanilla' | 'Chocolate';
type UpgradeType = 'None' | '1 Layer-2 Layers' | '3 Layers-5 Layers' | 'Tiered Cake';
type ToppingType = 'Mixed Toppings';
type AddOnType = 'Cupcake Candle' | 'Gold Cake Candle' | 'Acrylic Age Topper' | 'Flowers: A Stem of Rose' | 'Flowers: A Stem of Chrysanthemum' | 'Balloon: Classic Happy Birthday (Helium Filled)' | 'Balloon: Classic Heart (Helium Filled)';

interface CakeCustomizerProps {
  variant: any;
  basePrice: number;
  productType?: 'cake' | 'smallchops'; // Optional - defaults to 'cake'
}

const CakeCustomizer: React.FC<CakeCustomizerProps> = ({ 
  variant, 
  basePrice, 
  productType = 'cake' 
}) => {
  // Import the cart store
  const { addToCart } = useCartStore();
  
  const [selectedSize, setSelectedSize] = useState<SizeType | ''>('');
  const [selectedLayers, setSelectedLayers] = useState<LayerType | ''>('');
  const [selectedFlavour, setSelectedFlavour] = useState<FlavourType>('None');
  const [selectedUpgrade, setSelectedUpgrade] = useState<UpgradeType>('None');
  const [selectedToppings, setSelectedToppings] = useState<ToppingType[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnType[]>([]);
  const [message, setMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(basePrice);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const sizePricing: Record<SizeType, Record<LayerType, number>> = {
    '6 inches': { '1 layer': 13500, '2 layers': 24500, '3 layers': 32500 },
    '8 inches': { '1 layer': 18500, '2 layers': 37000, '3 layers': 46000 },
    '10 inches': { '1 layer': 20500, '2 layers': 40000, '3 layers': 53000 }
  };

  const upgradePricing: Record<UpgradeType, number> = {
    'None': 0,
    '1 Layer-2 Layers': 5000,
    '3 Layers-5 Layers': 8000,
    'Tiered Cake': 15000
  };

  const toppingsPricing: Record<ToppingType, number> = {
    'Mixed Toppings': 3000
  };

  const addOnsPricing: Record<AddOnType, number> = {
    'Cupcake Candle': 500,
    'Gold Cake Candle': 1000,
    'Acrylic Age Topper': 3000,
    'Flowers: A Stem of Rose': 8500,
    'Flowers: A Stem of Chrysanthemum': 6000,
    'Balloon: Classic Happy Birthday (Helium Filled)': 15000,
    'Balloon: Classic Heart (Helium Filled)': 12000
  };

  // Calculate total price whenever selections change
  useEffect(() => {
    let price = basePrice;
    
    // Only apply cake customization pricing if it's a cake and customizations are selected
    if (productType === 'cake' && selectedSize && selectedLayers && selectedSize in sizePricing) {
      const sizeData = sizePricing[selectedSize as SizeType];
      if (selectedLayers in sizeData) {
        price = sizeData[selectedLayers as LayerType];
      }
    }
    
    price += upgradePricing[selectedUpgrade];
    
    selectedToppings.forEach(topping => {
      price += toppingsPricing[topping];
    });
    
    selectedAddOns.forEach(addOn => {
      price += addOnsPricing[addOn];
    });
    
    setTotalPrice(price);

    // Update the main price display on the page
    const priceElement = document.getElementById('price-display');
    if (priceElement) {
      priceElement.innerHTML = `<p class="text-2xl font-medium py-2">${formatPrice(price)}</p>`;
    }
  }, [selectedSize, selectedLayers, selectedUpgrade, selectedToppings, selectedAddOns, basePrice, productType]);

  const handleToppingsChange = (topping: ToppingType, checked: boolean) => {
    setSelectedToppings(prev => 
      checked 
        ? [...prev, topping]
        : prev.filter(t => t !== topping)
    );
  };

  const handleAddOnsChange = (addOn: AddOnType, checked: boolean) => {
    setSelectedAddOns(prev => 
      checked 
        ? [...prev, addOn]
        : prev.filter(a => a !== addOn)
    );
  };

  const clearSelections = () => {
    setSelectedSize('');
    setSelectedLayers('');
    setSelectedFlavour('None');
    setSelectedUpgrade('None');
    setSelectedToppings([]);
    setSelectedAddOns([]);
    setMessage('');
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    // No validation required - allow adding to cart with or without customizations
    setIsAddingToCart(true);
    
    try {
      // Create a detailed product name with customizations
      const customizationDetails = [
        selectedSize,
        selectedLayers,
        selectedFlavour !== 'None' ? selectedFlavour : null,
        selectedUpgrade !== 'None' ? selectedUpgrade : null,
        ...selectedToppings,
        ...selectedAddOns
      ].filter(Boolean);

      const customizedName = customizationDetails.length > 0 
        ? `${variant?.product?.title || 'Product'} (${customizationDetails.join(', ')})`
        : variant?.product?.title || 'Product';
      
      // ✅ FIXED: Use the actual cart store function
      addToCart({
        id: variant?.product?.id || variant?.productID,
        variant: { 
          variantID: variant?.id, 
          quantity: quantity,
        },
        name: customizedName,
        price: totalPrice,
        image: variant?.product?.productVariants?.[0]?.variantImages?.[0]?.url || '/placeholder-cake.jpg',
        customization: productType === 'cake' && (selectedSize || selectedLayers || selectedFlavour !== 'None' || selectedUpgrade !== 'None' || selectedToppings.length > 0 || selectedAddOns.length > 0) ? {
          size: selectedSize,
          layers: selectedLayers,
          flavour: selectedFlavour,
          upgrade: selectedUpgrade,
          toppings: selectedToppings,
          addOns: selectedAddOns,
          message: message.trim(),
          basePrice: basePrice,
          totalPrice: totalPrice
        } : undefined
      });

      toast.success(`Added customized ${variant?.product?.title || 'product'} to your cart!`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const hasCustomizations = selectedSize || selectedLayers || selectedFlavour !== 'None' || 
                           selectedUpgrade !== 'None' || selectedToppings.length > 0 || 
                           selectedAddOns.length > 0;

  const isCustomizationValid = true; // Always allow adding to cart

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">
      {/* Product Summary Card */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-pink-200 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
            <div className="bg-gradient-to-br from-pink-400 to-purple-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
              {productType === 'cake' ? (
                <Cake className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              ) : (
                <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent truncate">
                {variant?.product?.title || 'Delicious Treat'}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                {productType === 'cake' && hasCustomizations 
                  ? `${selectedSize || 'Custom'}, ${selectedLayers || 'Layered'}${selectedFlavour !== 'None' ? `, ${selectedFlavour}` : ''}`
                  : productType === 'cake' 
                    ? 'Customize your perfect cake - Optional customization available'
                    : 'Fresh & delicious small chops - Ready to order'
                }
              </p>
            </div>
          </div>
          
          <div className="w-full sm:w-auto flex flex-col items-center sm:items-end">
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-pink-200 w-full sm:w-auto">
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent text-center sm:text-right">
                {formatPrice(totalPrice)}
              </p>
              <div className="mt-2 sm:mt-3 flex flex-col gap-2">
                {productType === 'cake' && (
                  <button
                    onClick={() => setShowCustomizer(!showCustomizer)}
                    className="w-full px-4 sm:px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-xs sm:text-sm font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {showCustomizer ? '✨ Hide Options' : '🎂 Customize'}
                  </button>
                )}
                
                {/* Customization Info Alert */}
                <div className="flex items-start gap-2 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-700 leading-tight">
                      <span className="font-semibold">Note:</span> Cake customization is optional and available only for cake products. Small chops come ready-to-enjoy as-is.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Panel - Only for cakes */}
      {productType === 'cake' && showCustomizer && (
        <div className="space-y-4 sm:space-y-6 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-pink-100">
          <div className="text-center mb-4 sm:mb-8">
            <div className="flex items-center justify-center mb-3 sm:mb-4 flex-wrap gap-2">
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Dream Cake
              </h2>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
            </div>
            <p className="text-gray-600 text-sm sm:text-base">Every cake is made with love, just for you ✨</p>
          </div>

          {/* Size Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Gift className="w-5 h-5 text-pink-500 mr-2" />
                Select Size *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedSize} onValueChange={(value) => {
                setSelectedSize(value as SizeType);
                setSelectedLayers('');
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose cake size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6 inches">6 inches</SelectItem>
                  <SelectItem value="8 inches">8 inches</SelectItem>
                  <SelectItem value="10 inches">10 inches</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Layers Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Cake Layers *</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSize && selectedSize in sizePricing ? (
                <RadioGroup value={selectedLayers} onValueChange={(value) => setSelectedLayers(value as LayerType)}>
                  <div className="space-y-3">
                    {Object.entries(sizePricing[selectedSize as SizeType]).map(([layer, price]) => (
                      <div key={layer} className="flex items-center space-x-2 p-3 bg-pink-50 rounded-lg">
                        <RadioGroupItem value={layer} id={layer} />
                        <Label htmlFor={layer} className="flex-1 font-medium cursor-pointer">
                          {layer}
                        </Label>
                        <span className="font-bold text-pink-600">{formatPrice(price)}</span>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <p className="text-gray-500 italic">Please select a size first</p>
              )}
            </CardContent>
          </Card>

          {/* Flavour Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Flavour</CardTitle>
              <p className="text-sm text-gray-600">Selected flavour will be mixed with other flavours.</p>
            </CardHeader>
            <CardContent>
              <Select value={selectedFlavour} onValueChange={(value) => setSelectedFlavour(value as FlavourType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose flavour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Red Velvet">Red Velvet</SelectItem>
                  <SelectItem value="Vanilla">Vanilla</SelectItem>
                  <SelectItem value="Chocolate">Chocolate</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Cream Upgrade */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upgrade From Buttercream to Whipped Cream</CardTitle>
              <p className="text-sm text-gray-600">Optional upgrade from buttercream to whipped cream covering.</p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedUpgrade} onValueChange={(value) => setSelectedUpgrade(value as UpgradeType)}>
                <div className="space-y-3">
                  {Object.entries(upgradePricing).map(([upgrade, price]) => (
                    <div key={upgrade} className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                      <RadioGroupItem value={upgrade} id={upgrade} />
                      <Label htmlFor={upgrade} className="flex-1 font-medium cursor-pointer">
                        {upgrade}
                      </Label>
                      {price > 0 && (
                        <span className="font-bold text-purple-600">+{formatPrice(price)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Toppings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Toppings</CardTitle>
              <p className="text-sm text-gray-600">We use creative toppings including edible cookies, fruits, and decorative elements.</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                <Checkbox
                  id="mixed-toppings"
                  checked={selectedToppings.includes('Mixed Toppings')}
                  onCheckedChange={(checked) => handleToppingsChange('Mixed Toppings', checked as boolean)}
                />
                <Label htmlFor="mixed-toppings" className="flex-1 font-medium cursor-pointer">
                  Mixed Toppings
                </Label>
                <span className="font-bold text-green-600">+{formatPrice(toppingsPricing['Mixed Toppings'])}</span>
              </div>
            </CardContent>
          </Card>

          {/* Add-Ons */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Cake Add-Ons (Optional Extras)</CardTitle>
              <p className="text-sm text-gray-600">Make your cake special with our premium add-ons.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(addOnsPricing).map(([addOn, price]) => (
                  <div key={addOn} className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                    <Checkbox
                      id={addOn}
                      checked={selectedAddOns.includes(addOn as AddOnType)}
                      onCheckedChange={(checked) => handleAddOnsChange(addOn as AddOnType, checked as boolean)}
                    />
                    <Label htmlFor={addOn} className="flex-1 font-medium cursor-pointer text-sm">
                      {addOn}
                    </Label>
                    <span className="font-bold text-yellow-600 text-sm">+{formatPrice(price)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Cake inscription.(eg Happy Birthday Mom,Dad,son,My Love)</CardTitle>
              <p className="text-sm text-gray-600">Specify your topping type tooo eg (straw berry,caramel,chocolate chips).</p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your special message here..."
                className="resize-none"
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{message.length}/200 characters</p>
            </CardContent>
          </Card>

          {/* Quantity Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quantity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 justify-stretch">
                <Button
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    }
                  }}
                  variant="secondary"
                  className="text-primary"
                  disabled={quantity <= 1}
                >
                  <Minus size={18} strokeWidth={3} />
                </Button>
                <Button variant="secondary" className="flex-1">
                  Quantity: {quantity}
                </Button>
                <Button
                  onClick={() => {
                    setQuantity(quantity + 1);
                  }}
                  variant="secondary"
                  className="text-primary"
                >
                  <Plus size={18} strokeWidth={3} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={clearSelections}
              variant="outline" 
              className="flex-1"
              disabled={isAddingToCart}
            >
              Clear All
            </Button>
            <Button 
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
              disabled={!isCustomizationValid || isAddingToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isAddingToCart ? 'Adding...' : `Add to Cart - ${formatPrice(totalPrice * quantity)}`}
            </Button>
          </div>
          
          {!isCustomizationValid && productType === 'cake' && false && (
            <p className="text-sm text-red-500 text-center">
              * Please select cake size and layers to continue
            </p>
          )}
        </div>
      )}

      {/* Quantity Selection - Always Visible for Small Chops */}
      {productType === 'smallchops' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">Select Quantity</h3>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-green-300 flex items-center justify-center hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <Minus className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </button>
            <div className="bg-white rounded-xl sm:rounded-2xl px-6 sm:px-8 py-3 sm:py-4 border-2 border-green-300 shadow-lg">
              <span className="text-xl sm:text-2xl font-bold text-green-600">{quantity}</span>
            </div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-green-300 flex items-center justify-center hover:bg-green-50 transition-all duration-300"
            >
              <Plus className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </button>
          </div>
        </div>
      )}

      {/* Add to Cart Section - Always Visible for Both Product Types */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
        <div className="text-center text-white mb-3 sm:mb-4">
          <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Ready to Order?</h3>
          <p className="text-pink-100 text-sm sm:text-base px-2">
            {productType === 'smallchops' 
              ? "Fresh small chops made to perfection! No customization needed - they're perfect as-is."
              : hasCustomizations 
                ? "Your beautifully customized cake awaits! All customizations are optional."
                : "Add this delicious cake to your cart! Customize it to make it uniquely yours, or order as-is."
            }
          </p>
        </div>
        
        {quantity > 1 && (
          <div className="text-center mb-3 sm:mb-4">
            <div className="inline-flex items-center bg-white/20 rounded-full px-3 sm:px-4 py-1 sm:py-2">
              <span className="text-white text-sm sm:text-base font-semibold">
                {quantity} × {formatPrice(totalPrice)} = {formatPrice(totalPrice * quantity)}
              </span>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleAddToCart}
          disabled={!isCustomizationValid || isAddingToCart}
          className="w-full bg-white text-purple-600 py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
        >
          {isAddingToCart ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 sm:h-6 sm:w-6 border-b-2 border-purple-600 mr-2 sm:mr-3"></div>
              <span className="text-sm sm:text-base">Adding to Cart...</span>
            </div>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              <span className="text-sm sm:text-xl">Add to Cart - {formatPrice(totalPrice * quantity)}</span>
            </>
          )}
        </button>
        
        {!isCustomizationValid && productType === 'cake' && false && (
          <p className="text-sm text-pink-200 text-center mt-2">
            * Please select cake size and layers to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default CakeCustomizer;