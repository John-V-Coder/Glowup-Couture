import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Address from "@/components/shopping-view/address";
import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { 
  Smartphone, CreditCard, Package, ArrowRight, User, 
  MapPin, Plus, Edit, CheckCircle, AlertCircle 
} from "lucide-react";
import PageWrapper from "@/components/common/page-wrapper";
import CouponInput from "@/components/shopping-view/coupon-input";
import PaystackPayment from "@/components/shopping-view/paystack-payment"; // Import PaystackPayment

// Define shipping locations and prices
const SHIPPING_PRICES = {
  nairobi: {
    base: 300,
    subLocations: {
      "CBD": 0,
      "Westlands": 50,
      "Kilimani": 50,
      "Ruiru": 150,
    },
  },
  kisumu: {
    base: 250,
    subLocations: {
      "CBD": 0,
      "Milimani": 40,
      "Kondele": 40,
      "Nyalenda": 60,
    },
  },
};

const BASE_SHIPPING_FEE = 1500; // Default shipping fee for outside Nairobi/Kisumu

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Extract actual cart items array - handle both structures
  const actualCartItems = cartItems?.items || cartItems || [];

  // Address management states
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormMode, setAddressFormMode] = useState('add'); // 'add' or 'edit'
  
  // Contact information state
  const [contactInfo, setContactInfo] = useState({
    email: user?.email || "",
  });

  // Shipping states
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSubLocation, setSelectedSubLocation] = useState("");
  
  // Coupon state
  const [appliedCouponData, setAppliedCouponData] = useState(null);
  const [isValidated, setIsValidated] = useState(false);

  // Guest address state
  const [guestAddress, setGuestAddress] = useState({
    userName: "",
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  });

  console.log("Guest Address:", guestAddress);

  // Initialize contact info when user data is available
  useEffect(() => {
    if (user) {
      setContactInfo(prev => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user]);

  // Auto-select or sync address when the list changes
  useEffect(() => {
    console.log("useEffect triggered. isAuthenticated:", isAuthenticated, "addressList:", addressList, "currentSelectedAddress:", currentSelectedAddress);
    if (isAuthenticated && addressList?.length > 0) {
      const selectedId = currentSelectedAddress?._id;
      const selectedAddressInNewList = selectedId ? addressList.find(addr => addr._id === selectedId) : null;

      if (selectedAddressInNewList) {
        if (JSON.stringify(selectedAddressInNewList) !== JSON.stringify(currentSelectedAddress)) {
          console.log("Updating currentSelectedAddress to found address:", selectedAddressInNewList);
          setCurrentSelectedAddress(selectedAddressInNewList);
        }
      } else {
        const defaultAddress = addressList.find(addr => addr.isDefault) || addressList[0];
        if (defaultAddress) {
          console.log("Setting default address:", defaultAddress);
          setCurrentSelectedAddress(defaultAddress);
          updateShippingLocation(defaultAddress);
        } else {
          console.log("No default or first address found in addressList.");
          setCurrentSelectedAddress(null);
        }
      }
    } else if (isAuthenticated && addressList?.length === 0) {
        console.log("Authenticated but no addresses in list. Setting currentSelectedAddress to null.");
        setCurrentSelectedAddress(null);
    } else if (!isAuthenticated) {
      console.log("User is not authenticated. Clearing currentSelectedAddress.");
      setCurrentSelectedAddress(null);
    }
  }, [addressList, isAuthenticated, currentSelectedAddress]);

  // Update shipping location based on address
  const updateShippingLocation = (address) => {
    if (address?.city?.toLowerCase().includes('nairobi')) {
      setSelectedCity("nairobi");
      setSelectedSubLocation("CBD");
    } else if (address?.city?.toLowerCase().includes('kisumu')) {
      setSelectedCity("kisumu");
      setSelectedSubLocation("CBD");
    } else if (address?.city) {
      setSelectedCity("other");
      setSelectedSubLocation("other");
    }
  };

  // Handle address selection
  const handleAddressSelect = (address) => {
    setCurrentSelectedAddress(address);
    setShowAddressForm(false);
    updateShippingLocation(address);
  };

  // Handle adding a new address
  const handleAddNewAddress = () => {
    setAddressFormMode('add');
    setShowAddressForm(true);
  };

  // Handle editing an address
  const handleEditAddress = (address) => {
    setCurrentSelectedAddress(address);
    setAddressFormMode('edit');
    setShowAddressForm(true);
  };

  // Handle address form submission
  const handleAddressSubmit = (submittedAddress) => {
    setShowAddressForm(false);
    if (submittedAddress) {
      setCurrentSelectedAddress(submittedAddress); // Explicitly set the submitted address as current
      updateShippingLocation(submittedAddress); // Update shipping based on the new address
    } else if (addressList?.length > 0 && !currentSelectedAddress) {
      // If no specific address was submitted (e.g., form cancelled after edit)
      // and no address was previously selected, set a default if available.
      const defaultAddress = addressList.find(addr => addr.isDefault) || addressList[0];
      setCurrentSelectedAddress(defaultAddress);
      updateShippingLocation(defaultAddress);
    }
  };

  // Handle address form cancellation
  const handleAddressCancel = () => {
    setShowAddressForm(false);
    if (addressList?.length > 0 && !currentSelectedAddress) {
      setCurrentSelectedAddress(addressList[0]);
    }
  };

  // Validate guest address
  const validateGuestAddress = () => {
    const { userName, address, city, phone } = guestAddress;
    
    if (!userName.trim() || userName.trim().length < 2) {
      return "Full name is required (min 2 characters)";
    }
    
    if (!address.trim()) {
      return "Address is required";
    }
    
    if (!city.trim()) {
      return "City is required";
    }
    
    if (!phone.trim() || phone.trim().length < 10) {
      return "Valid phone number is required (min 10 digits)";
    }
    
    return null;
  };

  function validateCheckoutData() {
    const email = (contactInfo.email || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailOk) {
      toast({
        title: "Valid Email Required",
        description: "Enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (isAuthenticated) {
      if (!currentSelectedAddress) {
        toast({
          title: "Delivery Address Required",
          description: "Please select or add a delivery address",
          variant: "destructive",
        });
        return false;
      }
    } else {
      const guestAddressError = validateGuestAddress();
      if (guestAddressError) {
        toast({
          title: "Address Information Required",
          description: guestAddressError,
          variant: "destructive",
        });
        return false;
      }
    }

    if (!selectedCity || !selectedSubLocation) {
      toast({
        title: "Shipment Location Required",
        description: "Please select your city and sub-location for delivery",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }

  const handleProceedToPayment = () => {
    if (validateCheckoutData()) {
      setIsValidated(true);
    }
  };

  const shippingFee = useMemo(() => {
    if (selectedCity === "nairobi" && selectedSubLocation) {
      return SHIPPING_PRICES.nairobi.base + (SHIPPING_PRICES.nairobi.subLocations[selectedSubLocation] || 0);
    }
    if (selectedCity === "kisumu" && selectedSubLocation) {
      return SHIPPING_PRICES.kisumu.base + (SHIPPING_PRICES.kisumu.subLocations[selectedSubLocation] || 0);
    }
    if (selectedCity === "other") {
      return BASE_SHIPPING_FEE;
    }
    return 0;
  }, [selectedCity, selectedSubLocation]);

  const subtotal = actualCartItems?.reduce((total, item) => 
    total + (item.salePrice || item.price) * item.quantity, 0) || 0;
  const couponDiscount = appliedCouponData?.discountAmount || 0;
  const total = subtotal + shippingFee - couponDiscount;

  const handleCouponApplied = (couponData) => {
    setAppliedCouponData(couponData);
  };

  const getOrderData = () => {
    const addressData = isAuthenticated ? currentSelectedAddress : {
      ...guestAddress,
      userName: guestAddress.userName,
    };

    return {
      userId: user?.id,
      cartItems: actualCartItems,
      addressInfo: addressData,
      shipmentMethod: "Standard",
      paymentMethod: "paystack",
      totalAmount: total,
      cartId: cartItems?._id,
      customerEmail: contactInfo?.email,
      customerName: addressData?.userName || user?.userName || 'Guest Customer',
      couponCode: appliedCouponData?.coupon?.code || null,
    };
  };

  return (
    <PageWrapper message="Loading checkout...">
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="relative h-[200px] w-full overflow-hidden">
          <img
            src="https://via.placeholder.com/1500x200"
            alt="Secure checkout banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white">Checkout</h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Contact Information</h2>
                {!isAuthenticated && (
                  <div className="ml-auto">
                    <Link to="/auth/login" className="text-blue-600 hover:underline text-sm">
                      Log in to save your information
                    </Link>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>
                
                {isAuthenticated && !showAddressForm && (
                  <Button
                    onClick={handleAddNewAddress}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                )}
              </div>

              {showAddressForm ? (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">
                    {addressFormMode === 'add' ? 'Add New Address' : 'Edit Address'}
                  </h3>
                  <Address
                    onAddressSubmit={handleAddressSubmit}
                    editingAddress={addressFormMode === 'edit' ? currentSelectedAddress : null}
                    onCancel={handleAddressCancel}
                    compact={true}
                  />
                </div>
              ) : isAuthenticated ? (
                <div>
                  {currentSelectedAddress && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            Selected Address
                            {currentSelectedAddress.isDefault && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </h3>
                          <div className="text-sm text-gray-700">
                            <p className="font-semibold">{currentSelectedAddress.userName}</p>
                            <p>{currentSelectedAddress.address}</p>
                            <p>{currentSelectedAddress.city}, {currentSelectedAddress.pincode}</p>
                            <p>Phone: {currentSelectedAddress.phone}</p>
                            {currentSelectedAddress.notes && (
                              <p className="text-gray-500">Notes: {currentSelectedAddress.notes}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAddress(currentSelectedAddress)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {addressList?.length > 0 ? (
                      addressList.map((address) => (
                        <div
                          key={address._id}
                          className={`border rounded-lg p-4 transition-all ${
                            currentSelectedAddress?._id === address._id
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300 cursor-pointer"
                          }`}
                          onClick={() => currentSelectedAddress?._id !== address._id && handleAddressSelect(address)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-4 h-4 rounded-full border-2 mt-1 ${
                                  currentSelectedAddress?._id === address._id
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {currentSelectedAddress?._id === address._id && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-gray-900">{address.userName}</p>
                                  {address.isDefault && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{address.address}</p>
                                <p className="text-sm text-gray-600">{address.city}, {address.pincode}</p>
                                <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                                {address.notes && (
                                  <p className="text-xs text-gray-500 mt-1">{address.notes}</p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAddress(address);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No saved addresses found</p>
                        <Button
                          onClick={handleAddNewAddress}
                          variant="outline"
                          className="mt-3"
                        >
                          Add Your First Address
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestAddress.userName}
                      onChange={(e) => {
                        console.log("userName onChange fired:", e.target.value);
                        setGuestAddress(prev => ({ ...prev, userName: e.target.value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={guestAddress.phone}
                      onChange={(e) => setGuestAddress(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={guestAddress.address}
                      onChange={(e) => setGuestAddress(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={guestAddress.city}
                        onChange={(e) => setGuestAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal code (optional)
                      </label>
                      <input
                        type="text"
                        value={guestAddress.pincode}
                        onChange={(e) => setGuestAddress(prev => ({ ...prev, pincode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Postal code (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Notes (optional)
                    </label>
                    <textarea
                      value={guestAddress.notes}
                      onChange={(e) => setGuestAddress(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any special delivery instructions"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-orange-600" />
                <h2 className="text-xl font-semibold">Shipping method</h2>
              </div>
              
              <div className="space-y-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCity === "nairobi"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedCity("nairobi");
                    setSelectedSubLocation("CBD");
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedCity === "nairobi"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedCity === "nairobi" && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Home Delivery within Nairobi (1-3 Days)</p>
                        <p className="text-sm text-gray-600">Fast delivery within Nairobi</p>
                      </div>
                    </div>
                    <p className="font-semibold">Ksh {SHIPPING_PRICES.nairobi.base + (selectedSubLocation ? SHIPPING_PRICES.nairobi.subLocations[selectedSubLocation] || 0 : 0)}.00</p>
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCity === "kisumu"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedCity("kisumu");
                    setSelectedSubLocation("CBD");
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedCity === "kisumu"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedCity === "kisumu" && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Home Delivery within Kisumu (1-3 Days)</p>
                        <p className="text-sm text-gray-600">Fast delivery within Kisumu</p>
                      </div>
                    </div>
                    <p className="font-semibold">Ksh {SHIPPING_PRICES.kisumu.base + (selectedSubLocation ? SHIPPING_PRICES.kisumu.subLocations[selectedSubLocation] || 0 : 0)}.00</p>
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCity === "other"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedCity("other");
                    setSelectedSubLocation("other");
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedCity === "other"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedCity === "other" && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Other Towns (3-5 Days)</p>
                        <p className="text-sm text-gray-600">Delivery to other locations within Kenya</p>
                      </div>
                    </div>
                    <p className="font-semibold">Ksh {BASE_SHIPPING_FEE}.00</p>
                  </div>
                </div>
              </div>

              {(selectedCity === "nairobi" || selectedCity === "kisumu") && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Sub-location *
                  </label>
                  <select
                    value={selectedSubLocation}
                    onChange={(e) => setSelectedSubLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Sub-location</option>
                    {Object.entries(SHIPPING_PRICES[selectedCity].subLocations).map(([sub, cost]) => (
                      <option key={sub} value={sub}>
                        {sub} {cost > 0 && `(+KSH ${cost})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {actualCartItems?.length > 0 ? actualCartItems.map((item) => {
                    console.log("Item size in checkout:", item.size);
                    return (
                    <div key={`${item.productId}-${item.size || 'default'}`} className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={item.image || "https://via.placeholder.com/60x60"}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        {item.quantity > 1 && (
                          <div className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.brand} • {item.category}
                        </p>
                        {item.size && (
                          <p className="text-xs text-gray-500">Size: {item.size}</p>
                        )}
                      </div>
                      <div className="text-sm font-medium">
                        KSh {((item.salePrice || item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  )}) : (
                    <p className="text-gray-500 text-center py-4">No items in cart</p>
                  )}
                </div>

                <div className="mb-6 pb-6 border-b">
                  <CouponInput
                    orderAmount={subtotal}
                    cartItems={actualCartItems}
                    userId={user?.id}
                    onCouponApplied={handleCouponApplied}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      KSh {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">KSh {shippingFee.toFixed(2)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount ({appliedCouponData?.coupon?.code})</span>
                      <span className="font-medium">-KSh {couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>KSh {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full mt-6"
                    onClick={handleProceedToPayment}
                    disabled={actualCartItems?.length === 0}
                  >
                    Proceed to Payment
                  </Button>

                  {isValidated && (
                    <div className="mt-6">
                      <PaystackPayment
                        orderData={getOrderData()}
                        onSuccess={() => {
                          toast({ title: "Payment successful!" });
                          navigate('/shop/payment-success');
                        }}
                        onError={(error) => {
                          toast({
                            title: "Payment Error",
                            description: error.message || "An error occurred during payment.",
                            variant: "destructive",
                          });
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default ShoppingCheckout;