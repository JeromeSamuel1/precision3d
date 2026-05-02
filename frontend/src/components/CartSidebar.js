import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total, itemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/order');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-[#040914] border-l border-white/10 w-full sm:max-w-md" data-testid="cart-sidebar">
        <SheetHeader>
          <SheetTitle className="text-[#F8FAFC] font-['Outfit'] text-xl">
            Your Cart <span className="text-[#94A3B8] text-sm font-normal">({itemCount} items)</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[#94A3B8] text-sm" data-testid="empty-cart-message">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-[#0A101D] border border-white/10 rounded-sm"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F8FAFC] text-sm font-medium truncate">{item.name}</p>
                      <p className="text-[#00E5FF] text-sm font-semibold">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors"
                          data-testid={`decrease-qty-${item.id}`}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-[#F8FAFC] text-xs w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors"
                          data-testid={`increase-qty-${item.id}`}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#94A3B8] hover:text-red-400 transition-colors self-start"
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#94A3B8] text-sm">Total</span>
                  <span className="text-[#F8FAFC] font-['Outfit'] text-xl font-bold" data-testid="cart-total">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 border border-[#00E5FF] text-[#00E5FF] font-medium text-sm hover:bg-[#00E5FF] hover:text-[#040914] transition-all duration-300"
                  data-testid="checkout-button"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
