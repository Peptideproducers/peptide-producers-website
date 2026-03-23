export default function COASection() {
  return (
    <section 
      id="coa"
      className="relative bg-white z-50 py-16 lg:py-24"
      style={{ paddingTop: '108px' }}
    >
      <div className="relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="max-w-lg">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#0B0D12] leading-[1.05] tracking-tight">
                Order with confidence.
              </h2>
              <p className="mt-4 text-xl font-medium text-[#2E6FF6]">
                COA Documentation
              </p>
              <p className="mt-6 text-base text-[#6B7280] leading-relaxed">
                Manufactured in U.S. laboratories through advanced solid-phase synthesis, 
                each batch is verified by HPLC, mass spectrometry, and backed by Certificates 
                of Analysis confirming ≥99% purity for research use.
              </p>
            </div>

            {/* Lab Image */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/images/coa-lab.jpg" 
                alt="Laboratory Testing"
                className="w-full max-w-[500px] lg:max-w-[600px] h-auto object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
