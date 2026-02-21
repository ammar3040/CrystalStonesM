import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Send, MessageCircle, Sparkles, Globe, Clock, ArrowRight } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, message } = formData;
    const whatsappMsg = `Hi Crystal Stones Mart!%0A%0AName: ${name}%0AEmail: ${email}%0APhone: ${phone}%0AMessage: ${message}`;
    window.open(`https://wa.me/919016507258?text=${whatsappMsg}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const contactDetails = [
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Visit Us",
      value: "T0072 A, Pirajpur, Khambhat, Anand-388620, Gujarat, India",
      href: "https://www.google.co.in/maps/dir//22.31963000,72.61826000",
      color: "from-rose-500 to-orange-500",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email Us",
      value: "support@crystalstonesmart.in",
      href: "mailto:support@crystalstonesmart.in",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Call Us",
      value: "+91 90165 07258",
      href: "tel:+919016507258",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const stats = [
    { number: "30+", label: "Years Experience" },
    { number: "50+", label: "Countries Served" },
    { number: "10K+", label: "Happy Clients" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <section className="relative py-24 overflow-hidden" id="contactForm">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fbbf24 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/8 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-600/5 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-400">Get In Touch</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Let's Build Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
              Beautiful
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Whether you're a wholesaler, retailer, or crystal enthusiast — we're here to help you discover extraordinary stones.
          </p>
        </motion.div>

        {/* Main Content: 2 Columns */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 mb-20">

          {/* Left Column: Contact Info + Map */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Cards */}
            {contactDetails.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 flex-shrink-0 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-1">{item.label}</p>
                  <p className="text-sm text-zinc-300 group-hover:text-white transition-colors leading-relaxed">{item.value}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
              </motion.a>
            ))}

            {/* Google Map Embed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <iframe
                title="Crystal Stones Mart Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.0!2d72.61826!3d22.31963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDE5JzEwLjciTiA3MsKwMzcnMDUuNyJF!5e0!3m2!1sen!2sin!4v1!"
                width="100%"
                height="200"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Business Hours</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-300">
                  <span>Monday – Saturday</span>
                  <span className="font-bold text-white">9:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Sunday</span>
                  <span className="font-bold text-amber-400">By Appointment</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <div className="relative p-8 sm:p-10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-lg shadow-2xl">

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-[80px]" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-amber-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
                    Send a Message
                  </h3>
                </div>
                <p className="text-zinc-400 text-sm mb-8">
                  Fill out the form below and we'll redirect you to WhatsApp for instant communication.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 90165 07258"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Your Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell us about your requirements, quantities, or any questions..."
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="group w-full relative py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl text-sm font-black text-white uppercase tracking-widest overflow-hidden shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                    <span className="relative flex items-center justify-center gap-3">
                      {sent ? (
                        <>✓ Redirecting to WhatsApp</>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4" />
                          Send via WhatsApp
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group p-6 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 hover:border-amber-500/20 transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 mb-1">
                {stat.number}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* WhatsApp CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm sm:text-base">Need immediate assistance?</p>
              <p className="text-emerald-300/70 text-xs sm:text-sm">Chat with us on WhatsApp for instant responses</p>
            </div>
          </div>
          <a
            href="https://wa.me/919016507258"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95"
          >
            Chat Now →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;