import React from 'react';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <>
      {/* Main Footer */}
      <footer className="footer sm:footer-horizontal bg-base-200 text-white p-10">
        <nav>
          <h6 className="footer-title text-white">Quick Links</h6>
          <Link to="/" className="text-white hover:text-blue-400 transition-colors duration-200">Home</Link>
          <Link to="/ViewAllProduct" className="text-white hover:text-blue-400 transition-colors duration-200">Products</Link>
          <Link to="/#contactForm" className="text-white hover:text-blue-400 transition-colors duration-200">Contact</Link>
        </nav>

        <nav>
          <h6 className="footer-title text-white">Why Choose Us?</h6>
          <p className="text-white text-sm">✅ Trusted Wholesale Supplier</p>
          <p className="text-white text-sm">✅ Authentic Crystal & Agate Products</p>
          <p className="text-white text-sm">✅ Pan India Bulk Delivery</p>
        </nav>

        <nav>
          <h6 className="footer-title text-white">Get in Touch</h6>
          <a href="tel:+919016507258" className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
            <FaPhoneAlt /> +91 90165 07258
          </a>
          <a href="mailto:crystalstonesmart@gmail.com" className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
            <FaEnvelope /> support@crystalstonesmart.in
          </a>
          <a
            href="https://wa.me/919016507258?text=Hi, I'm interested in buying your crystal products in bulk."
            target="_blank"
            rel="noopener noreferrer"
           
            
          >
            <p  className="flex items-center gap-2 transition-colors duration-200 text-[#25D366] hover:text-[#128C7E]">
            <FaWhatsapp /> WhatsApp Inquiry</p>
          </a>
        </nav>
      </footer>

      {/* Bottom Line */}
      <footer className="footer bg-base-200 text-white border-t border-base-300 px-10 py-4">
        <aside className="items-center grid-flow-col">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="fill-current">
            <path d="M22.672 15.226...z" />
          </svg>
          <p className="text-white">
            <strong>Crystal Stones Mart</strong> <br />
            Empowering India's wholesale crystal business with trust & authenticity. <br />
            Since 1992, Crystal Stones Mart, located at Khambhat, Gujarat, manufacturing, exporting and importing a premium quality assortment of Orgone Pendulum, Orgone Pyramid, Roller Massager, Orgone Ball and many more.
          </p>
        </aside>
      </footer>
    </>
  );
}

export default Footer;