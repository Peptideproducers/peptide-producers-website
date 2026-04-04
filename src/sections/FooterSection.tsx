import { Phone, Mail } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="relative bg-[#F6F7F9] z-[100] py-12 lg:py-16">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 pb-8 border-b border-[rgba(11,13,18,0.12)]">
          {/* Logo */}
          <div>
            <img 
              src="/images/logo.png" 
              alt="Peptide Producers" 
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Contact */}
          <div className="max-w-md">
            <p className="text-sm text-[#6B7280] mb-4">
              Need help? Text us, and a team member will reply in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="tel:8015477933"
                className="flex items-center gap-2 text-[#0B0D12] hover:text-[#2E6FF6] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">801-547-7933</span>
              </a>
              <a 
                href="mailto:info@peptideproducers.com"
                className="flex items-center gap-2 text-[#0B0D12] hover:text-[#2E6FF6] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="font-medium">info@peptideproducers.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Links Row */}
        <div className="flex flex-wrap gap-6 py-6 border-b border-[rgba(11,13,18,0.12)]">
          <a href="#" className="text-sm text-[#6B7280] hover:text-[#2E6FF6] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-[#6B7280] hover:text-[#2E6FF6] transition-colors">
            Terms of Service
          </a>
        </div>

        {/* Legal Disclaimer */}
        <div className="py-8 space-y-4">
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            All products on this site are for research and development use only. Products are not for human consumption of any kind. 
            The statements made on this website have not been evaluated by the US Food and Drug Administration. The statements and 
            the products of this company are not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Peptide Producers is a chemical supplier. Peptide Producers is not a compounding pharmacy or chemical compounding facility 
            as defined under 503A of the Federal Food, Drug, and Cosmetic Act. Peptide Producers is not an outsourcing facility as 
            defined under 503B of the Federal Food, Drug, and Cosmetic Act.
          </p>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption.
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[rgba(11,13,18,0.12)]">
          <p className="text-sm text-[#9CA3AF]">
            &copy; Peptide Producers {new Date().getFullYear()}. All rights reserved
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#0B0D12]">Made in the</span>
            <img 
              src="/images/usa-flag.jpg" 
              alt="USA" 
              style={{ height: '32px', width: 'auto', display: 'inline-block' }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
