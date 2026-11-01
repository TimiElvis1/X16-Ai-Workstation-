import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  Star,
  Zap,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  MapPin,
  ArrowRight,
  PackageCheck,
  RefreshCw,
  Cpu,
  Home,
  Laptop,
  Shirt,
  Sparkles,
  ChevronDown,
  Filter,
  Check,
  Car,
  Rocket,
  Lock,
  Wallet,
  DollarSign,
  Building2,
  Smartphone,
  QrCode,
  ShieldAlert,
  Copy
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  category: string;
  badge: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice: number;
  isPrime: boolean;
  deliveryDate: string;
  inStock: boolean;
  stockCount: number;
  brand: string;
  image: string;
  description: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const EcommerceStudio: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPrimeOnly, setIsPrimeOnly] = useState<boolean>(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Payment Gateway Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [gatewayMethod, setGatewayMethod] = useState<'card' | 'crypto' | 'byte_vault' | 'bank' | 'apple_pay'>('card');
  const [shippingAddress, setShippingAddress] = useState<string>('100 Sovereign Way, San Francisco, CA 94105');
  
  // Card Form Inputs
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 8899');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvc, setCardCvc] = useState<string>('992');
  const [cardName, setCardName] = useState<string>('SubNet Sovereign User');

  // Crypto Gateway Inputs
  const [walletAddress, setWalletAddress] = useState<string>('SubNet_Sol_Escrow_8x99K...22P');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Order Placement Processing
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentStepText, setPaymentStepText] = useState<string>('Encrypting Payment Credentials...');
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Orders History State
  const [activeTab, setActiveTab] = useState<'shop' | 'orders'>('shop');
  const [ordersHistory, setOrdersHistory] = useState<any[]>([]);

  const departments = [
    'All Departments',
    'Vehicles',
    'Aerospace Equipment',
    'Electronics',
    'House Items',
    'Computers & Servers',
    'Fashionable Items'
  ];

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [selectedDepartment, isPrimeOnly]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedDepartment !== 'All Departments') queryParams.append('category', selectedDepartment);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (isPrimeOnly) queryParams.append('primeOnly', 'true');

      const res = await fetch(`/api/ecommerce/products?${queryParams.toString()}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
        }
      }
    } catch (err) {
      console.error('Error fetching marketplace products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/ecommerce/orders');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setOrdersHistory(data.orders || []);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrderGateway = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessingPayment(true);
    setPaymentStepText('1/3 Tokenizing Payment Data via 256-Bit SSL...');

    setTimeout(() => {
      setPaymentStepText('2/3 Locking Funds in Multi-Sig Gateway Escrow Vault...');
    }, 1200);

    setTimeout(async () => {
      setPaymentStepText('3/3 Verifying Reserve Liquidity & Generating Receipt...');

      try {
        const methodLabels = {
          card: `Cyber-Card Visa (${cardNumber.slice(-4)})`,
          crypto: `Solana Crypto Multi-Sig Escrow (${walletAddress.slice(0, 8)}...)`,
          byte_vault: `SubNet Byte Vault (Zero Fee Native Tokens)`,
          bank: `Sovereign Direct Wire / ACH Bank Transfer`,
          apple_pay: `Apple Pay / Google Pay Biometric Pass`
        };

        const res = await fetch('/api/ecommerce/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart,
            shippingAddress,
            paymentMethod: methodLabels[gatewayMethod],
            gatewayChannel: `SubNet Enterprise Payment Gateway - Channel: ${gatewayMethod.toUpperCase()}`,
            transactionHash: '0xSBN' + Math.random().toString(36).substring(2, 16).toUpperCase(),
            totalUSD: cartSubtotal,
            isPrimeDelivery: true
          })
        });

        const data = await res.json();
        if (data.success) {
          setCompletedOrder(data.order);
          setCart([]);
          fetchOrders();
        }
      } catch (err) {
        console.error('Error processing gateway payment:', err);
      } finally {
        setIsProcessingPayment(false);
      }
    }, 2400);
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= Math.floor(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-zinc-600'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      
      {/* SUBNET MONOPOLY MARKETPLACE NAVBAR */}
      <div className="bg-black border border-zinc-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('shop')}>
            <div className="p-2.5 rounded-xl bg-amber-500 text-black font-black flex items-center space-x-1.5 shadow-lg">
              <ShoppingBag className="h-5 w-5" />
              <span className="text-sm tracking-tight">subNet</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-black text-white tracking-tight">Monopoly Marketplace</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[9px] font-bold uppercase">
                  Sovereign Express
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">Vehicles • Aerospace • AI Compute • High-Spec Techwear</span>
            </div>
          </div>

          {/* Cart & Orders Quick Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab(activeTab === 'shop' ? 'orders' : 'shop')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
              }`}
            >
              <PackageCheck className="h-4 w-4" />
              <span>Orders &amp; Gateway Receipts ({ordersHistory.length})</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all flex items-center space-x-2 shadow-lg relative"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-black text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar & Department Selector */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-zinc-800/80">
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search SubNet Monopoly Marketplace for eVTOL flightcraft, AI supercomputing pods, CubeSats..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-3 pr-9 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-all"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPrimeOnly(!isPrimeOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border ${
              isPrimeOnly
                ? 'bg-amber-950 text-amber-300 border-amber-700'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Sovereign Direct Express</span>
          </button>
        </form>
      </div>

      {/* DEPARTMENT CATEGORY CAROUSEL */}
      {activeTab === 'shop' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <button
            onClick={() => setSelectedDepartment('Vehicles')}
            className={`p-3 rounded-xl border transition-all text-left space-y-1 ${
              selectedDepartment === 'Vehicles'
                ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <Car className="h-5 w-5 text-amber-400" />
            <div className="font-bold text-white">Vehicles</div>
            <div className="text-[10px] text-zinc-500">eVTOL, Cyber Trucks, Hydrofoils</div>
          </button>

          <button
            onClick={() => setSelectedDepartment('Aerospace Equipment')}
            className={`p-3 rounded-xl border transition-all text-left space-y-1 ${
              selectedDepartment === 'Aerospace Equipment'
                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <Rocket className="h-5 w-5 text-cyan-400" />
            <div className="font-bold text-white">Aerospace</div>
            <div className="text-[10px] text-zinc-500">CubeSats, Avionics, Ion Thrusters</div>
          </button>

          <button
            onClick={() => setSelectedDepartment('Electronics')}
            className={`p-3 rounded-xl border transition-all text-left space-y-1 ${
              selectedDepartment === 'Electronics'
                ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <Cpu className="h-5 w-5 text-purple-400" />
            <div className="font-bold text-white">Electronics</div>
            <div className="text-[10px] text-zinc-500">Beryllium Audio, BCI Headbands</div>
          </button>

          <button
            onClick={() => setSelectedDepartment('House Items')}
            className={`p-3 rounded-xl border transition-all text-left space-y-1 ${
              selectedDepartment === 'House Items'
                ? 'bg-orange-950/60 border-orange-500 text-orange-300'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <Home className="h-5 w-5 text-orange-400" />
            <div className="font-bold text-white">House &amp; Home</div>
            <div className="text-[10px] text-zinc-500">Domestic Humanoids, Recliners</div>
          </button>

          <button
            onClick={() => setSelectedDepartment('Computers & Servers')}
            className={`p-3 rounded-xl border transition-all text-left space-y-1 ${
              selectedDepartment === 'Computers & Servers'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <Laptop className="h-5 w-5 text-emerald-400" />
            <div className="font-bold text-white">Computers &amp; Servers</div>
            <div className="text-[10px] text-zinc-500">H100 Supercomputing, HSM Vaults</div>
          </button>

          <button
            onClick={() => setSelectedDepartment('Fashionable Items')}
            className={`p-3 rounded-xl border transition-all text-left space-y-1 ${
              selectedDepartment === 'Fashionable Items'
                ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <Shirt className="h-5 w-5 text-rose-400" />
            <div className="font-bold text-white">Fashion &amp; Apparel</div>
            <div className="text-[10px] text-zinc-500">Ballistic Suits, Titanium Watches</div>
          </button>
        </div>
      )}

      {/* SHOP VIEW: PRODUCT CATALOG */}
      {activeTab === 'shop' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Showing <strong>{products.length}</strong> High-Spec Monopolized Items in <strong>{selectedDepartment}</strong></span>
            {selectedDepartment !== 'All Departments' && (
              <button
                onClick={() => setSelectedDepartment('All Departments')}
                className="text-amber-400 hover:text-amber-300 font-bold"
              >
                Clear Department Filter
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="h-8 w-8 animate-spin text-amber-400 mx-auto" />
              <p className="text-xs text-zinc-400">Fetching Monopoly Marketplace Catalog...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-4 space-y-3 flex flex-col justify-between transition-all hover:shadow-2xl"
                >
                  <div className="space-y-2">
                    {/* Badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider">
                        {product.badge}
                      </span>
                      {product.isPrime && (
                        <span className="text-[10px] font-bold text-amber-400 flex items-center space-x-0.5">
                          <Zap className="h-3 w-3 fill-amber-400" />
                          <span>SOVEREIGN</span>
                        </span>
                      )}
                    </div>

                    {/* Image */}
                    <div className="h-44 bg-black rounded-xl overflow-hidden relative group">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Title & Brand */}
                    <div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase">{product.brand}</div>
                      <h3 className="text-xs font-bold text-white line-clamp-2 mt-0.5 hover:text-amber-300">
                        {product.title}
                      </h3>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 text-xs">
                      <div className="flex items-center">{renderRatingStars(product.rating)}</div>
                      <span className="text-amber-400 font-bold text-[11px]">{product.rating}</span>
                      <span className="text-[10px] text-zinc-500">({product.reviewsCount.toLocaleString()})</span>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Delivery */}
                  <div className="space-y-3 pt-2 border-t border-zinc-800">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-black text-amber-300">${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-zinc-500 line-through">
                            ${product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-emerald-400 flex items-center space-x-1 mt-0.5">
                        <Truck className="h-3 w-3" />
                        <span>FREE Direct Dispatch {product.deliveryDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all flex items-center justify-center space-x-1 shadow-md"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ORDERS HISTORY VIEW */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="font-bold text-white text-sm">Your Payment Gateway Orders &amp; Receipts</span>
            <button onClick={() => setActiveTab('shop')} className="text-amber-400 font-bold hover:underline">
              ← Return to Marketplace
            </button>
          </div>

          {ordersHistory.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-500 space-y-2">
              <PackageCheck className="h-10 w-10 mx-auto text-zinc-600" />
              <p className="text-xs font-bold text-zinc-300">No past gateway orders placed yet.</p>
              <p className="text-[11px]">Add items to your cart and complete payment gateway checkout to see tracking details here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersHistory.map(order => (
                <div key={order.orderId} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">ORDER PLACED</span>
                      <span className="text-white font-bold">{new Date(order.orderedAt).toLocaleDateString()}</span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[10px]">TOTAL CHARGED</span>
                      <span className="text-amber-300 font-bold">${order.totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[10px]">SHIP TO</span>
                      <span className="text-zinc-300 truncate max-w-[150px]">{order.shippingAddress}</span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[10px]">GATEWAY ORDER # {order.orderId}</span>
                      <span className="text-cyan-400 font-mono text-[11px] font-bold">{order.trackingNumber}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                      <Truck className="h-4 w-4" />
                      <span>Dispatch Status: {order.status}</span>
                    </div>

                    <div className="text-[10px] text-zinc-400 font-mono flex items-center space-x-1 bg-black px-2.5 py-1 rounded-lg border border-zinc-800">
                      <Lock className="h-3 w-3 text-emerald-400" />
                      <span>Tx: {order.transactionHash || '0xGATEWAY...'}</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    {(order?.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center space-x-3 bg-black p-2.5 rounded-xl border border-zinc-800 text-xs">
                        <img src={item.product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="font-bold text-white">{item.product.title}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">Qty: {item.quantity} | ${item.product.price.toLocaleString()} each</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CART SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-zinc-900 border-l border-zinc-800 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl font-mono text-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-amber-400" />
                    <h3 className="text-base font-black text-white">SubNet Shopping Cart ({cartItemCount})</h3>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white font-bold text-sm">
                    ✕
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 space-y-2">
                    <ShoppingBag className="h-10 w-10 mx-auto text-zinc-600" />
                    <p className="text-xs font-bold text-zinc-400">Your Shopping Cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {cart.map(item => (
                      <div key={item.product.id} className="bg-black border border-zinc-800 p-3 rounded-xl flex items-center space-x-3">
                        <img src={item.product.image} alt="" className="w-14 h-14 object-cover rounded-lg shrink-0" />
                        <div className="flex-1 space-y-1">
                          <h4 className="font-bold text-white line-clamp-1">{item.product.title}</h4>
                          <div className="text-amber-300 font-bold">${item.product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-bold text-white px-2">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal ({cartItemCount} items):</span>
                      <span className="text-white font-bold">${cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Sovereign Direct Express:</span>
                      <span className="text-emerald-400 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-amber-300 pt-2 border-t border-zinc-800">
                      <span>Total Amount:</span>
                      <span>${cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                      setCompletedOrder(null);
                    }}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-xl"
                  >
                    <span>Proceed to Payment Gateway</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MULTI-CHANNEL SUBNET ENTERPRISE PAYMENT GATEWAY MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full space-y-5 shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto"
          >
            {/* Gateway Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-black font-black">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">SubNet Enterprise Payment Gateway</h3>
                  <p className="text-[10px] text-zinc-400">256-Bit SSL Encrypted • PCI-DSS Level 1 • Multi-Sig Escrow Protected</p>
                </div>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-zinc-500 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            {!completedOrder ? (
              <form onSubmit={handlePlaceOrderGateway} className="space-y-5">
                
                {/* Shipping Address */}
                <div>
                  <label className="text-zinc-300 font-bold block mb-1.5 flex items-center space-x-1.5">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    <span>Sovereign Shipping Address</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* PAYMENT CHANNEL SELECTOR TABS */}
                <div className="space-y-2">
                  <label className="text-zinc-300 font-bold block flex items-center space-x-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-amber-400" />
                    <span>Select Payment Gateway Channel</span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => setGatewayMethod('card')}
                      className={`p-2.5 rounded-xl border text-center transition-all space-y-1 ${
                        gatewayMethod === 'card'
                          ? 'bg-amber-500 text-black font-black border-amber-400'
                          : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      <CreditCard className="h-4 w-4 mx-auto" />
                      <div className="text-[10px] leading-tight">Cyber-Card / Visa</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGatewayMethod('crypto')}
                      className={`p-2.5 rounded-xl border text-center transition-all space-y-1 ${
                        gatewayMethod === 'crypto'
                          ? 'bg-amber-500 text-black font-black border-amber-400'
                          : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      <Wallet className="h-4 w-4 mx-auto" />
                      <div className="text-[10px] leading-tight">Crypto Escrow</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGatewayMethod('byte_vault')}
                      className={`p-2.5 rounded-xl border text-center transition-all space-y-1 ${
                        gatewayMethod === 'byte_vault'
                          ? 'bg-amber-500 text-black font-black border-amber-400'
                          : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      <Zap className="h-4 w-4 mx-auto" />
                      <div className="text-[10px] leading-tight">Byte Vault</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGatewayMethod('bank')}
                      className={`p-2.5 rounded-xl border text-center transition-all space-y-1 ${
                        gatewayMethod === 'bank'
                          ? 'bg-amber-500 text-black font-black border-amber-400'
                          : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      <Building2 className="h-4 w-4 mx-auto" />
                      <div className="text-[10px] leading-tight">Bank Wire / ACH</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGatewayMethod('apple_pay')}
                      className={`p-2.5 rounded-xl border text-center transition-all space-y-1 ${
                        gatewayMethod === 'apple_pay'
                          ? 'bg-amber-500 text-black font-black border-amber-400'
                          : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      <Smartphone className="h-4 w-4 mx-auto" />
                      <div className="text-[10px] leading-tight">Apple / Google Pay</div>
                    </button>
                  </div>
                </div>

                {/* GATEWAY METHOD SPECIFIC INTERACTION CARDS */}
                {gatewayMethod === 'card' && (
                  <div className="bg-black border border-zinc-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                      <span>Cyber-Card Credit Processing</span>
                      <span className="text-[10px] text-zinc-500">Stripe PCI-DSS Gateway</span>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500 text-center"
                        />
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500 text-center"
                        />
                        <input
                          type="text"
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          placeholder="Cardholder Name"
                          className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500 truncate"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {gatewayMethod === 'crypto' && (
                  <div className="bg-black border border-zinc-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300">
                      <span>Solana &amp; BTC Multi-Sig Cryptographic Escrow</span>
                      <span className="text-[10px] text-emerald-400">Zero-Gas Rebate</span>
                    </div>

                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-2">
                      <div className="text-[10px] text-zinc-400">Gateway Multi-Sig Escrow Vault:</div>
                      <div className="font-mono text-xs text-amber-300 break-all bg-black p-2 rounded border border-zinc-800 flex items-center justify-between">
                        <span>{walletAddress}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCopiedHash(true);
                            setTimeout(() => setCopiedHash(false), 2000);
                          }}
                          className="p-1 hover:text-white"
                        >
                          {copiedHash ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {gatewayMethod === 'byte_vault' && (
                  <div className="bg-black border border-amber-500/30 p-4 rounded-xl space-y-2 text-amber-300">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center space-x-1.5">
                        <Zap className="h-4 w-4 text-amber-400" />
                        <span>SubNet Byte Token Vault</span>
                      </span>
                      <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-black">0% FEE</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Instant deduction from your Staked SubNet Byte Vault balance. Earns 2.5% cashback in network yield tokens.
                    </p>
                  </div>
                )}

                {gatewayMethod === 'bank' && (
                  <div className="bg-black border border-zinc-800 p-4 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-white">Sovereign Direct Wire &amp; Bank ACH</div>
                    <div className="text-[11px] text-zinc-400">
                      Bank Name: <strong className="text-white">SubNet Enterprise Bank NA</strong> | Routing: <strong className="text-white">121000358</strong>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold">Instant Plaid API Verification Simulated</div>
                  </div>
                )}

                {gatewayMethod === 'apple_pay' && (
                  <div className="bg-black border border-zinc-800 p-4 rounded-xl text-center space-y-2">
                    <Smartphone className="h-8 w-8 text-white mx-auto" />
                    <div className="font-black text-white text-sm">Apple Pay &amp; Google Pay Express Pass</div>
                    <div className="text-[11px] text-zinc-400">Double-click side button or use Face ID to authorize transaction.</div>
                  </div>
                )}

                {/* ITEMIZED SUMMARY */}
                <div className="p-3 bg-black border border-zinc-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-zinc-400 text-xs">
                    <span>Order Subtotal ({cartItemCount} items):</span>
                    <span className="text-white font-bold">${cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 text-xs">
                    <span>SubNet Payment Gateway Fee:</span>
                    <span className="text-emerald-400 font-bold">$0.00 (Waived)</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-amber-300 pt-2 border-t border-zinc-800">
                    <span>Total Gateway Charge:</span>
                    <span>${cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>
                  </div>
                </div>

                {/* Gateway Submit Action */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black flex items-center space-x-2 shadow-xl transition-all"
                  >
                    {isProcessingPayment ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4 fill-black" />}
                    <span>{isProcessingPayment ? paymentStepText : 'Authorize Gateway Payment'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* ORDER CONFIRMED RECEIPT VIEW */
              <div className="space-y-4 bg-black p-5 rounded-2xl border border-emerald-500/50">
                <div className="flex items-center space-x-3 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-400" />
                  <div>
                    <h4 className="text-base font-black text-white">SubNet Payment Gateway Confirmed!</h4>
                    <span className="text-[11px] text-emerald-400">Funds Secured in Gateway Escrow &amp; Sovereign Fleet Dispatched</span>
                  </div>
                </div>

                <div className="space-y-2 text-[11px] bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Gateway Receipt Order #:</span>
                    <span className="text-amber-300 font-bold">{completedOrder.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Carrier Tracking #:</span>
                    <span className="text-cyan-400 font-mono font-bold">{completedOrder.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Cryptographic Tx Hash:</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{completedOrder.transactionHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Estimated Sovereign Delivery:</span>
                    <span className="text-white font-bold">{completedOrder.estimatedDelivery}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-zinc-800">
                    <span className="text-zinc-400 font-bold">Total Authorized Amount:</span>
                    <span className="text-amber-300 font-black text-sm">${completedOrder.totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setActiveTab('orders');
                  }}
                  className="w-full py-3 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 transition-all shadow-lg"
                >
                  View Gateway Order Tracking Details
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

