import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LabQualitySection() {
  return (
    <section 
      className="relative bg-[#F6F7F9] z-40 py-16 lg:py-24"
      style={{ paddingTop: '108px' }}
    >
      <div className="relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="max-w-xl">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#0B0D12] leading-[1.05] tracking-tight">
                No more guessing games.
              </h2>
              <h2 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#0B0D12] leading-[1.05] tracking-tight">
                US-made, third-party batch tested.
              </h2>
              <Link 
                to="/products"
                className="btn-primary mt-8 inline-flex"
              >
                View Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Vial Image */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/images/lab-vial.jpg" 
                alt="Lab Tested Peptide Vial"
                className="w-full max-w-[400px] lg:max-w-[520px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
