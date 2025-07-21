import { Button } from "./ui/button";

const Footer = () => (
  <footer className="bg-black pt-16 pb-6 mt-24 border-t border-white/10">
    <div className="container-custom">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12">
        {/* Contact Info */}
        <div className="space-y-4 min-w-[220px]">
          <h4 className="font-bold text-white text-lg mb-2">Contact Info</h4>
          <div className="text-white/80">Info@OptimaleMD</div>
          <div className="text-white/80">Phone: 1 (877) 572 2582</div>
          <div className="text-white/60 text-sm">The fastest and most effective way to reach us is via email</div>
          <div className="font-bold text-white mt-4">Office hours</div>
          <div className="text-white/80">Mon-Fri: 9:00 am – 5:00 pm EST</div>
        </div>
        {/* More Info */}
        <div className="space-y-4 min-w-[220px]">
          <h4 className="font-bold text-white text-lg mb-2">More Info</h4>
          <div className="text-white/80">Careers</div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Legal</span>
            <span className="text-white/60">&gt;</span>
          </div>
          <a href="" className="text-red-400 font-semibold">Cancellation &amp; Refund Policy</a>
          <img src="/placeholder.svg" alt="LegitScript Certified" className="mt-6 w-28" />
        </div>
        {/* Services */}
        <div className="space-y-4 min-w-[220px]">
          <h4 className="font-bold text-white text-lg mb-2">Services</h4>
          <div className="text-white/80">Guided Optimization</div>
          <div className="text-white/80">Diagnostic Labs</div>
          <div className="text-white/80">Partnership Program</div>
          <div className="font-bold text-white mt-4">Follow us</div>
          <div className="flex gap-4 mt-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram text-2xl" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-x-twitter text-2xl" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="YouTube">
                <i className="fab fa-youtube text-2xl" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook text-2xl" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin text-2xl" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center text-white/60 text-sm mt-12">
        Copyright 2025 | All Rights Reserved
      </div>
    </div>
  </footer>
);

export default Footer;
