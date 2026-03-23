import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Phone, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/#faq' },
  { label: 'COA', href: '/#coa' },
  { label: 'Need help?', href: '/#support' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, removeItem, updateQuantity, isCartOpen, setIsCartOpen } = useCart();

  const isHomePage = location.pathname === '/';

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (href.startsWith('/#')) {
      // Hash link - navigate to home page section
      const sectionId = href.replace('/#', '');
      if (isHomePage) {
        // Already on home page, scroll to section
        const element = document.querySelector(`#${sectionId}`);
        if (element) {
          const headerOffset = 108;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      } else {
        // Navigate to home page with hash
        navigate(`/?section=${sectionId}`);
      }
    } else {
      // Regular route
      navigate(href);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[rgba(11,13,18,0.08)]">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/images/logo.png" 
              alt="Peptide Producers" 
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm font-medium text-[#0B0D12] hover:text-[#2E6FF6] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-1 text-sm text-[#6B7280]">
              <span>English</span>
              <ChevronDown className="w-4 h-4" />
            </div>

            {/* Phone */}
            <a 
              href="tel:+19729190219" 
              className="hidden md:flex items-center gap-2 text-sm font-medium text-[#0B0D12] hover:text-[#2E6FF6] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>801-547-7933</span>
            </a>

            {/* Cart */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <button className="relative p-2 hover:bg-[#F6F7F9] rounded-lg transition-colors">
                  <ShoppingCart className="w-5 h-5 text-[#0B0D12]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2E6FF6] text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-white">
                <SheetHeader>
                  <SheetTitle className="text-xl font-semibold text-[#0B0D12]">Shopping Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
                  {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <ShoppingCart className="w-16 h-16 text-[#CBD5E1] mb-4" />
                      <p className="text-[#6B7280]">Your cart is empty</p>
                      <p className="text-sm text-[#9CA3AF] mt-1">Add some products to get started</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-auto space-y-4 pr-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-4 p-3 bg-[#F6F7F9] rounded-lg">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-20 h-20 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-[#0B0D12]">{item.name}</h4>
                              <p className="text-sm text-[#6B7280]">{item.category}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-6 h-6 flex items-center justify-center bg-white rounded border border-[rgba(11,13,18,0.12)] text-sm"
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-6 h-6 flex items-center justify-center bg-white rounded border border-[rgba(11,13,18,0.12)] text-sm"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="font-semibold text-[#0B0D12]">${item.price * item.quantity}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[rgba(11,13,18,0.12)] pt-4 mt-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[#6B7280]">Subtotal</span>
                          <span className="text-xl font-semibold text-[#0B0D12]">${totalPrice}</span>
                        </div>
                        <Button className="w-full bg-[#2E6FF6] hover:bg-[#1a5ad4] text-white rounded-full py-6">
                          Proceed to Checkout
                        </Button>
                        <p className="text-xs text-center text-[#9CA3AF] mt-3">
                          Shipping calculated at checkout
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-[#F6F7F9] rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#0B0D12]" />
              ) : (
                <Menu className="w-5 h-5 text-[#0B0D12]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[rgba(11,13,18,0.08)] py-4">
            <nav className="flex flex-col px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="py-3 text-base font-medium text-[#0B0D12] hover:text-[#2E6FF6] transition-colors border-b border-[rgba(11,13,18,0.06)]"
                >
                  {link.label}
                </Link>
              ))}
              <a 
                href="tel:+19729190219" 
                className="flex items-center gap-2 py-3 text-base font-medium text-[#2E6FF6]"
              >
                <Phone className="w-4 h-4" />
                <span>801-547-7933</span>
              </a>
            </nav>
          </div>
        )}
      </div>

      {/* Trust Ribbon */}
      <div className="fixed left-0 right-0 z-40 bg-[#F6F7F9] border-b border-[rgba(11,13,18,0.08)] top-14">
        <div className="marquee-container h-10 flex items-center">
          <div className="marquee-content flex items-center gap-8 px-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8">
                <span className="trust-badge">24/7 Support</span>
                <span className="trust-badge">Manufactured in the USA</span>
                <span className="trust-badge">Batch Produced, Batch Tested</span>
                <span className="trust-badge">Fast and Discreet Shipping</span>
                <span className="trust-badge">Affordable Pricing</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
