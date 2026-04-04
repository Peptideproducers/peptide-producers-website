import { MessageCircle } from 'lucide-react';

export default function SupportSection() {
  return (
    <section 
      id="support"
      className="relative bg-white z-[70] py-16 lg:py-24"
      style={{ paddingTop: '108px' }}
    >
      <div className="relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="max-w-lg">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#0B0D12] leading-[1.05] tracking-tight">
                Text us, our dedicated team is here to help
              </h2>
              <p className="mt-6 text-lg text-[#6B7280]">
                Reach out and get a response within minutes.
              </p>
              <a 
                href="sms:8015477933"
                className="btn-primary mt-8 inline-flex"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Text Us
              </a>
            </div>

            {/* Support Image */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/images/support-team.jpg" 
                alt="Customer Support Team"
                className="w-full max-w-[500px] lg:max-w-[600px] h-auto object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
