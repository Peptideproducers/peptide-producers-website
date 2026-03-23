import { FlaskConical, Microscope, Truck } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Precision Lyophilization',
    description: 'Made in a controlled, U.S based facility under strict manufacturing standards.',
    icon: FlaskConical,
  },
  {
    number: 2,
    title: 'Verified Purity',
    description: 'Every batch is third-party tested with HPLC and MS to confirm chemical integrity.',
    icon: Microscope,
  },
  {
    number: 3,
    title: 'Same-Day Fulfillment',
    description: 'Products are dispatched same-day from our U.S. facility.',
    icon: Truck,
  },
];

export default function HowItWorksSection() {
  return (
    <section 
      className="relative bg-[#F6F7F9] z-[60] py-16 lg:py-24"
      style={{ paddingTop: '108px' }}
    >
      <div className="relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0B0D12] text-center mb-12 lg:mb-16">
            How It Works
          </h2>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.number}
                  className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm"
                >
                  {/* Number Circle */}
                  <div className="w-12 h-12 rounded-full bg-[#2E6FF6] flex items-center justify-center mb-6">
                    <span className="text-white font-semibold text-lg">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <Icon className="w-8 h-8 text-[#2E6FF6]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-[#0B0D12] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
