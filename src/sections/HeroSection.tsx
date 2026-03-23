import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const scrollToProducts = () => {
    const element = document.querySelector('#products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero"
      className="relative bg-white z-10"
      style={{ paddingTop: '108px' }}
    >
      {/* Subtle vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.02) 100%)'
        }}
      />

      <div className="relative min-h-[calc(100vh-108px)] flex items-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#0B0D12] leading-[1.05] tracking-tight">
                Order research peptides, direct from the lab.
              </h1>
              <p className="mt-6 text-lg text-[#6B7280]">
                Batch produced, and tested in the USA.
              </p>
              <a 
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToProducts();
                }}
                className="btn-primary mt-8 inline-flex"
              >
                View Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>

            {/* Vial Image */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/images/reta30.png" 
                alt="Research Peptide Vial"
                className="w-full max-w-[400px] lg:max-w-[480px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RUO Disclaimer */}
      <div className="bg-[rgba(246,247,249,0.95)] border-t border-[rgba(11,13,18,0.12)]">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-5">
          <div className="max-w-4xl">
            <h3 className="text-sm font-semibold text-[#0B0D12] uppercase tracking-wide">
              Research Use Only
            </h3>
            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
              All products from Peptide Producers are intended solely for laboratory research purposes and are not for human or animal consumption. 
              These materials are for in vitro research only and must be handled by qualified professionals in controlled lab environments. 
              By purchasing, the buyer agrees to use these products in compliance with all applicable laws and regulations.
            </p>
            <p className="mt-2 text-xs text-[#9CA3AF] font-medium">
              All products currently listed on this site are for research purposes ONLY.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
