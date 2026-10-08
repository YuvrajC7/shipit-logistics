"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, ArrowRight, Package, Box, Map, Check, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Lenis from "lenis";

function RollingNumber({ end, suffix }: { end: number, suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <div ref={ref} className="text-4xl font-display font-semibold tracking-tight mb-1">{count}{suffix}</div>;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("Road Freight");
  const [billing, setBilling] = useState("Monthly");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hiddenNav, setHiddenNav] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > 100 && latest > previous) {
      setHiddenNav(true);
    } else {
      setHiddenNav(false);
    }
  });

  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setTimeout(() => {
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 400); // Wait for the menu closing animation
  };

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { name: "Road Freight", heading: "Reliable Road Transport", desc: "Fast and secure overland delivery across the continent with our modern fleet of trucks.", img: "/services_truck.jpg" },
    { name: "Warehousing", heading: "Secure Storage", desc: "State-of-the-art facilities to store and manage your inventory with real-time tracking.", img: "/blog_warehouse.jpg" },
    { name: "Door-to-Door Delivery", heading: "Direct to Destination", desc: "Seamless pickup and delivery straight to your customer's doorstep.", img: "/services_door.jpg" },
    { name: "Ocean Freight", heading: "Global Ocean Freight", desc: "Cost-effective international shipping for large cargo volumes across all major routes.", img: "/blog_port.jpg" }
  ];

  const faqs = [
    { q: "How long does shipping take?", a: "Shipping times vary by service and destination. Standard road freight usually takes 3-5 business days, while express delivery can be as fast as next-day." },
    { q: "Do you ship internationally?", a: "Yes, our ocean and air freight services cover over 150 countries worldwide." },
    { q: "What if my package is damaged or lost?", a: "All shipments are fully insured. In the rare event of damage or loss, our dedicated claims team will process your refund or replacement immediately." },
    { q: "Can I change my delivery address after shipping?", a: "Address changes can be requested before the shipment reaches the final delivery hub. Additional routing fees may apply." }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans leading-[1.6]">
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex justify-end"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-sm h-full bg-white shadow-2xl flex flex-col"
            >
              <div className="p-8 flex justify-end">
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <motion.div 
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                  visible: { transition: { delayChildren: 0.2, staggerChildren: 0.1 } }
                }}
                className="flex flex-col gap-6 p-12 text-2xl font-display font-semibold"
              >
                {[
                  { name: 'Home', id: 'top' },
                  { name: 'About Us', id: 'about' },
                  { name: 'Services', id: 'services' },
                  { name: 'Pricing', id: 'pricing' },
                  { name: 'Contact', id: 'contact' },
                ].map((item) => (
                  <motion.a
                    key={item.name}
                    href={`#${item.id === 'top' ? '' : item.id}`}
                    onClick={(e) => handleScrollTo(e, item.id)}
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                    }}
                    className="hover:text-[#C70E20] transition inline-block w-fit cursor-pointer"
                  >
                    {item.name}
                  </motion.a>
                ))}
                <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="h-px bg-black/10 my-4" />
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block text-lg bg-[#C70E20] text-white py-4 px-6 rounded-xl text-center hover:bg-[#A00B1A] transition">Dashboard Login</Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 1. Cinematic Truck Hero */}
      <section className="relative w-full h-[100svh] max-h-[800px] bg-black overflow-hidden flex flex-col justify-between">
        {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-110 opacity-90"
        >
          <source src="https://framerusercontent.com/assets/zPyRPmCPfITndw01a0anW8m5Se0.mp4" type="video/mp4" />
        </video>

        {/* Navigation Bar */}
        <motion.nav 
          variants={{
            visible: { y: 0 },
            hidden: { y: "-100%" }
          }}
          animate={hiddenNav ? "hidden" : "visible"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 w-full px-6 md:px-16 pt-6 pointer-events-none"
        >
          <div className="max-w-[1100px] mx-auto pointer-events-auto">
            <div className="bg-[#EDF1F4] h-20 w-full flex items-center justify-between px-8 shadow-lg shadow-black/10">
              <Link href="/" className="flex items-center gap-3">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="#C70E20" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M0 0 L20 0 A12 12 0 0 1 32 12 L32 14 L12 14 A12 12 0 0 1 0 2 Z" />
                  <path d="M32 32 L12 32 A12 12 0 0 1 0 20 L0 18 L20 18 A12 12 0 0 1 32 30 Z" />
                </svg>
                <span className="font-display font-semibold text-[24px] tracking-wide mt-0.5 text-black">SHIPIT</span>
              </Link>
              <button onClick={() => setIsMenuOpen(true)} className="p-2 text-black hover:text-[#C70E20] transition cursor-pointer flex items-center justify-center">
                <Menu className="w-8 h-8" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 pb-12 md:pb-16 flex flex-col h-full justify-end">
          <h1 className="text-[67px] md:text-[85px] lg:text-[94px] font-display font-semibold text-white leading-[1.1] tracking-[-0.03em] max-w-4xl mb-auto mt-40">
            <span className="text-black">On-time</span> <span className="text-[#C70E20]">delivery,</span> every time
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 w-full">
            <p className="text-white text-lg md:text-xl font-medium max-w-md">
              We handle the logistics, you grow your business
            </p>
            <Link href="/login" className="bg-[#C70E20] hover:bg-[#A00B1A] text-white px-10 py-5 font-semibold text-lg transition-colors whitespace-nowrap text-center">
              Ship With Us
            </Link>
          </div>
        </div>
      </section>

      {/* 2. About Section */}
      <section id="about" className="w-full max-w-[1400px] mx-auto px-6 md:px-16 py-24 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left Column */}
          <div className="md:pr-24 md:border-r border-gray-200 flex flex-col pb-12 md:pb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-[2px] bg-[#C70E20]"></div>
                <div className="w-2 h-2 rounded-full bg-[#C70E20]"></div>
              </div>
              <span className="text-sm font-semibold tracking-widest uppercase">About Us</span>
            </div>
            <h2 className="text-[45px] md:text-[52px] lg:text-[60px] font-display font-semibold leading-[1.1] tracking-tight mb-6">
              Logistics Without the Headaches
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              We streamline your supply chain with advanced tracking, dedicated support, and a global network of trusted carriers.
            </p>
            <div className="w-full h-[1px] bg-gray-200 mb-8"></div>
            <div className="flex items-start gap-4 mb-10">
              <Package className="w-8 h-8 text-[#C70E20] shrink-0" strokeWidth={1.5} />
              <p className="text-gray-600 font-medium leading-relaxed">
                Comprehensive freight solutions tailored to scale alongside your operations.
              </p>
            </div>
            <Link href="/about" className="bg-black hover:bg-gray-800 text-white px-8 py-4 font-semibold inline-flex items-center justify-center self-start transition-colors">
              Learn more
            </Link>
          </div>

          {/* Right Column (Stats) */}
          <div className="md:pl-24 flex flex-col justify-center space-y-12">
            {[
              { num: 576, suffix: "+", label: "Project Completed", icon: Box },
              { num: 687, suffix: "+", label: "Happy Customers", icon: Map },
              { num: 890, suffix: "+", label: "Delivered in Time", icon: Package }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-8">
                <div className="w-16 h-16 bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                  <stat.icon className="w-8 h-8 text-black" strokeWidth={1} />
                </div>
                <div>
                  <RollingNumber end={stat.num} suffix={stat.suffix} />
                  <div className="text-gray-500 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services" className="w-full max-w-[1400px] mx-auto px-6 md:px-16 py-24">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
          <h2 className="text-[45px] md:text-[52px] lg:text-[60px] font-display font-semibold leading-[1.1] tracking-tight max-w-xl">
            Every Shipping Solution You Need
          </h2>
          <div className="flex flex-col gap-6 max-w-sm">
            <p className="text-gray-600 font-medium">From local couriers to international ocean freight, we provide end-to-end transport services.</p>
            <Link href="/services" className="border border-gray-300 hover:border-black px-8 py-4 font-semibold text-center transition-colors">
              View all services
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 mb-12">
          {tabs.map(tab => (
            <button 
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative px-8 py-4 font-semibold text-lg whitespace-nowrap transition-colors ${
                activeTab === tab.name 
                  ? "text-black" 
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {tab.name}
              {activeTab === tab.name && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C70E20]" 
                  initial={false}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tabs.filter(t => t.name === activeTab).map(tab => (
          <div key={tab.name} className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-gray-50 border border-gray-200 p-8 md:p-12">
            <div className="h-[300px] md:h-[500px] bg-gray-200 overflow-hidden">
              <img src={tab.img} className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700" alt={tab.name} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="w-16 h-16 border border-[#C70E20] flex items-center justify-center mb-8">
                <TruckFastIcon className="w-8 h-8 text-[#C70E20]" />
              </div>
              <h3 className="text-[35px] font-display font-semibold leading-[1.1] tracking-tight mb-6">{tab.heading}</h3>
              <p className="text-gray-600 text-lg mb-8">{tab.desc}</p>
              <div className="w-full h-[1px] bg-gray-200 mb-8"></div>
              <Link href="/contact" className="bg-black hover:bg-gray-800 text-white px-8 py-4 font-semibold inline-block self-start transition-colors">
                Let’s work together
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* 4. Benefits (Airplane) Section */}
      <section className="w-full bg-[#EDF1F4] pt-32 pb-20 overflow-hidden relative border-y border-gray-200">
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col items-center">
          
          <div className="text-center max-w-2xl mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-sm font-semibold tracking-widest uppercase text-gray-500">Benefits</span>
            </div>
            <h2 className="text-[45px] md:text-[52px] lg:text-[60px] font-display font-semibold leading-[1.1] tracking-tight mb-6">
              Perks of Shipping With Us
            </h2>
            <p className="text-gray-600 text-lg">
              When you ship with Shipit, things just work. No drama, no stress, just reliable service you can count on every time.
            </p>
          </div>

          <div className="relative w-full aspect-[16/8] md:aspect-[21/9] flex items-center justify-center mt-8">
            {/* Orbital Backgrounds */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
               <div className="w-[110%] md:w-[90%] aspect-square rounded-full border border-gray-400 absolute animate-[spin_35s_linear_infinite]" />
               <div className="w-[90%] md:w-[70%] aspect-square rounded-full border border-gray-400 absolute animate-[spin_30s_linear_infinite_reverse]" />
               <div className="w-[70%] md:w-[50%] aspect-square rounded-full border border-gray-400 absolute animate-[spin_25s_linear_infinite]" />
               <div className="w-[50%] md:w-[30%] aspect-square rounded-full border border-gray-400 absolute animate-[spin_20s_linear_infinite_reverse]" />
            </div>

            {/* Airplane Image */}
            <img 
              src="https://framerusercontent.com/images/aOSsZE1chA3ecWPgyrxVNZmgOY.png" 
              alt="Airplane" 
              className="relative z-20 w-[110%] md:w-[90%] object-contain scale-110 pointer-events-none"
            />

            {/* Benefit Panels */}
            {/* 1 */}
            <div className="absolute top-[15%] md:top-[25%] left-0 md:-left-[2%] z-30 bg-white flex items-stretch min-w-[280px] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="w-16 bg-[#C70E20] text-white flex items-center justify-center font-display font-bold text-2xl shrink-0">1</div>
              <div className="p-5 flex flex-col justify-center">
                <h4 className="font-display font-bold text-[18px] mb-1 leading-tight tracking-tight">24/7 Customer Support</h4>
                <p className="text-gray-500 text-[14px] font-medium leading-tight">Get help anytime, day or night</p>
              </div>
            </div>

            {/* 2 */}
            <div className="absolute top-[15%] md:top-[25%] right-0 md:-right-[2%] z-30 bg-white flex items-stretch min-w-[280px] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="w-16 bg-[#C70E20] text-white flex items-center justify-center font-display font-bold text-2xl shrink-0">2</div>
              <div className="p-5 flex flex-col justify-center">
                <h4 className="font-display font-bold text-[18px] mb-1 leading-tight tracking-tight">Competitive Pricing</h4>
                <p className="text-gray-500 text-[14px] font-medium leading-tight">Affordable rates with no hidden fees</p>
              </div>
            </div>

            {/* 3 */}
            <div className="absolute top-[65%] md:top-[60%] left-[5%] md:left-[8%] z-30 bg-white flex items-stretch min-w-[280px] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="w-16 bg-[#C70E20] text-white flex items-center justify-center font-display font-bold text-2xl shrink-0">3</div>
              <div className="p-5 flex flex-col justify-center">
                <h4 className="font-display font-bold text-[18px] mb-1 leading-tight tracking-tight">On-Time Delivery</h4>
                <p className="text-gray-500 text-[14px] font-medium leading-tight">Your packages arrive on time.</p>
              </div>
            </div>

            {/* 4 */}
            <div className="absolute top-[65%] md:top-[60%] right-[5%] md:right-[8%] z-30 bg-white flex items-stretch min-w-[280px] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="w-16 bg-[#C70E20] text-white flex items-center justify-center font-display font-bold text-2xl shrink-0">4</div>
              <div className="p-5 flex flex-col justify-center">
                <h4 className="font-display font-bold text-[18px] mb-1 leading-tight tracking-tight">Global Network</h4>
                <p className="text-gray-500 text-[14px] font-medium leading-tight">Ship to over 200 countries worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonial Banner */}
      <section className="w-full relative h-[544px] bg-black">
        <img 
          src="https://framerusercontent.com/images/EFZUob9ClYUcrZB9xIcQcXy36U.png" 
          alt="Truck on road" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 h-full flex flex-col justify-center max-w-3xl">
          <h2 className="text-[35px] md:text-[45px] font-display font-semibold text-white leading-[1.2] tracking-tight mb-12">
            “Switching to this company was the best decision for my business. My packages always arrive on time and my customers are happy!”
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-500 overflow-hidden">
               {/* Placeholder Avatar */}
            </div>
            <div>
              <div className="text-white font-bold text-lg">John Carter</div>
              <div className="text-gray-400 font-medium">Satisfied Client</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Process Section */}
      <section className="w-full max-w-[1400px] mx-auto px-6 md:px-16 py-32 border-b border-gray-200">
        <h2 className="text-[45px] md:text-[52px] lg:text-[60px] font-display font-semibold leading-[1.1] tracking-tight text-center mb-24">
          3 Easy Steps To Deliver
        </h2>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes flowArrow {
            from { stroke-dashoffset: 12; }
            to { stroke-dashoffset: 0; }
          }
          .animate-flow {
            animation: flowArrow 0.8s linear infinite;
          }
        `}} />

        <div className="flex flex-col md:flex-row items-start justify-center gap-4 md:gap-2 max-w-5xl mx-auto">
          {[
            { num: "01", title: "Book Your Shipment", sub: "Enter your package details and destination", active: activeStep === 0, icon: PhoneCheckIcon },
            { num: "02", title: "We Pick Up & Ship", sub: "We collect and transport your package", active: activeStep === 1, icon: HandTruckIcon },
            { num: "03", title: "Receive Your Package", sub: "Your package arrives safely at destination", active: activeStep === 2, icon: TruckFastIcon }
          ].map((step, i) => (
            <div key={i} className="flex flex-1 items-center">
              {/* Step Item */}
              <div className="flex flex-col items-center flex-1 w-full text-center px-4">
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-colors duration-500 ${
                  step.active ? "bg-[#C70E20] text-white shadow-xl scale-110" : "bg-[#EDF1F4] text-[#C70E20] scale-100"
                }`}>
                  <div className="absolute -top-2 bg-[#C70E20] text-white rounded-full w-7 h-7 flex items-center justify-center text-[11px] font-display font-bold ring-[4px] ring-white">
                    {step.num}
                  </div>
                  <step.icon className="w-10 h-10 transition-transform duration-500" strokeWidth={1.5} />
                </div>
                <h3 className={`text-[20px] font-display font-bold tracking-tight transition-colors duration-500 mb-2 ${
                  step.active ? "text-[#C70E20]" : "text-black"
                }`}>
                  {step.title}
                </h3>
                <p className="text-gray-500 text-[13px] font-medium leading-snug max-w-[200px]">{step.sub}</p>
              </div>

              {/* Animated Arrow Connector (hidden on mobile, visible on md+) */}
              {i < 2 && (
                <div className="hidden md:flex flex-col justify-start pt-12 items-center h-full w-24 shrink-0">
                  <div className="w-full relative flex items-center">
                    <svg className="w-full overflow-visible" height="12" viewBox="0 0 100 12" fill="none">
                       {/* Arrow line */}
                       <line x1="0" y1="6" x2="90" y2="6" stroke="#C70E20" strokeWidth="1.5" strokeDasharray="5 5" className={`transition-opacity duration-500 ${activeStep === i ? 'animate-flow opacity-100' : 'opacity-30'}`} />
                       {/* Arrow head */}
                       <path d="M85 2 L93 6 L85 10" stroke="#C70E20" strokeWidth="1.5" fill="none" className={`transition-opacity duration-500 ${activeStep === i ? 'opacity-100' : 'opacity-30'}`} />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section id="pricing" className="w-full max-w-[1400px] mx-auto px-6 md:px-16 py-32">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
          <h2 className="text-[45px] md:text-[52px] lg:text-[60px] font-display font-semibold leading-[1.1] tracking-tight max-w-md">
            Pick a Plan, Start Shipping
          </h2>
          <p className="text-gray-600 font-medium max-w-sm text-lg">
            Flexible pricing tailored to businesses of all sizes. No hidden fees.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-gray-100 p-1 border border-gray-200">
            <button 
              onClick={() => setBilling("Monthly")}
              className={`px-8 py-3 font-semibold transition-colors ${billing === "Monthly" ? "bg-white border border-gray-200 shadow-sm" : "text-gray-500"}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBilling("Yearly")}
              className={`px-8 py-3 font-semibold transition-colors ${billing === "Yearly" ? "bg-white border border-gray-200 shadow-sm" : "text-gray-500"}`}
            >
              Yearly <span className="ml-2 text-xs font-bold text-[#C70E20] uppercase bg-[#C70E20]/10 px-2 py-1">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-200">
          {/* Left Column (Plans) */}
          <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50">
            {[
              { name: "Basic Plan", price: billing === "Monthly" ? "$49" : "$470", period: billing === "Monthly" ? "/month" : "/year", active: false },
              { name: "Professional Plan", price: billing === "Monthly" ? "$149" : "$1430", period: billing === "Monthly" ? "/month" : "/year", active: true },
              { name: "Enterprise Plan", price: "Custom", period: "", active: false }
            ].map(plan => (
              <div key={plan.name} className={`p-10 border-b border-gray-200 last:border-0 flex justify-between items-center cursor-pointer transition-colors ${
                plan.active ? "bg-[#C70E20] text-white" : "hover:bg-white"
              }`}>
                <div>
                  <h3 className="font-display font-semibold text-[25px] mb-1">{plan.name}</h3>
                  <p className={plan.active ? "text-white/80" : "text-gray-500"}>Ideal for small businesses.</p>
                </div>
                <div className="text-right">
                  <div className="font-display font-semibold text-[35px] tracking-tight">{plan.price}</div>
                  {plan.period && <div className={plan.active ? "text-white/80" : "text-gray-500"}>{plan.period}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (Features) */}
          <div className="p-10 lg:p-16 flex flex-col justify-between bg-white">
            <h3 className="font-display font-semibold text-[25px] mb-8">Professional Features</h3>
            <ul className="space-y-6 mb-12 flex-1">
              {[
                "Priority Support 24/7",
                "Advanced Real-time Tracking",
                "Up to 50 shipments per month",
                "Custom Packaging Solutions",
                "Dedicated Account Manager"
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-4 border-b border-gray-100 pb-6 last:border-0">
                  <Check className="w-6 h-6 text-[#C70E20] shrink-0" strokeWidth={3} />
                  <span className="font-medium text-lg">{feat}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="bg-black hover:bg-gray-800 text-white w-full py-5 font-semibold text-center text-lg transition-colors">
              Choose plan
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Trust and Cargo Section */}
      <section className="w-full bg-black text-white pt-32 pb-24 overflow-hidden relative border-y border-black">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col lg:flex-row justify-between items-center gap-16 mb-24">
          <h2 className="text-[45px] md:text-[52px] lg:text-[60px] font-display font-semibold leading-[1.1] tracking-tight max-w-2xl z-10 relative">
            Thousands of companies trust us to deliver their products safely and on time.
          </h2>
          
          <div className="relative w-full lg:w-1/2 h-[400px] z-10">
            <img 
              src="https://framerusercontent.com/images/ehg9LztZYpBonc0toRP7QXPCgc.png" 
              alt="Shipping Container on Crane" 
              className="absolute inset-0 w-full h-full object-contain object-center scale-125"
            />
          </div>
        </div>

        {/* Logos */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="flex flex-wrap border border-white/10">
            {/* Acme */}
            <div className="flex-1 min-w-[200px] h-32 border-r border-b border-white/10 flex items-center justify-center text-white/40 grayscale hover:grayscale-0 hover:text-white transition-all cursor-default">
              <svg width="110" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 26H9L12.5 20H19.5L23 26H30L16 2ZM16 8L13.5 13H18.5L16 8Z" fill="currentColor"/>
                <text x="36" y="22" fontFamily="sans-serif" fontSize="19" fontWeight="900" letterSpacing="-0.5" fill="currentColor">ACME</text>
              </svg>
            </div>
            {/* GlobalTech */}
            <div className="flex-1 min-w-[200px] h-32 border-r border-b border-white/10 flex items-center justify-center text-white/40 grayscale hover:grayscale-0 hover:text-white transition-all cursor-default">
              <svg width="145" height="32" viewBox="0 0 160 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="4"/>
                <circle cx="16" cy="16" r="5" fill="currentColor"/>
                <text x="38" y="22" fontFamily="sans-serif" fontSize="19" fontWeight="800" letterSpacing="-0.5" fill="currentColor">GlobalTech</text>
              </svg>
            </div>
            {/* Quantum */}
            <div className="flex-1 min-w-[200px] h-32 border-r border-b border-white/10 flex items-center justify-center text-white/40 grayscale hover:grayscale-0 hover:text-white transition-all cursor-default">
              <svg width="130" height="32" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="16" cy="16" rx="14" ry="4.5" transform="rotate(45 16 16)" stroke="currentColor" strokeWidth="3"/>
                <ellipse cx="16" cy="16" rx="14" ry="4.5" transform="rotate(-45 16 16)" stroke="currentColor" strokeWidth="3"/>
                <circle cx="16" cy="16" r="3.5" fill="currentColor"/>
                <text x="38" y="22" fontFamily="sans-serif" fontSize="19" fontWeight="800" letterSpacing="-0.5" fill="currentColor">Quantum</text>
              </svg>
            </div>
            {/* Nexus */}
            <div className="flex-1 min-w-[200px] h-32 border-r border-b border-white/10 flex items-center justify-center text-white/40 grayscale hover:grayscale-0 hover:text-white transition-all cursor-default">
              <svg width="115" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16L12 4H20L12 16L20 28H12L4 16Z" fill="currentColor"/>
                <path d="M14 16L22 4H30L22 16L30 28H22L14 16Z" fill="currentColor" opacity="0.4"/>
                <text x="38" y="22" fontFamily="sans-serif" fontSize="19" fontWeight="800" letterSpacing="-0.5" fill="currentColor">Nexus</text>
              </svg>
            </div>
            {/* Vertex */}
            <div className="flex-1 min-w-[200px] h-32 border-r border-b border-white/10 flex items-center justify-center text-white/40 grayscale hover:grayscale-0 hover:text-white transition-all cursor-default">
              <svg width="115" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 28L2 8H10L16 17L22 8H30L16 28Z" fill="currentColor"/>
                <text x="38" y="22" fontFamily="sans-serif" fontSize="19" fontWeight="800" letterSpacing="-0.5" fill="currentColor">Vertex</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Blog Preview */}
      <section className="w-full max-w-[1400px] mx-auto px-6 md:px-16 py-32 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3 flex flex-col">
            <h2 className="text-[45px] md:text-[52px] font-display font-semibold leading-[1.1] tracking-tight mb-6">
              Learn More About Logistics
            </h2>
            <p className="text-gray-600 text-lg mb-12">
              Stay updated with the latest industry news, shipping tips, and operational strategies.
            </p>
            <Link href="/blog" className="bg-black hover:bg-gray-800 text-white px-8 py-4 font-semibold inline-block self-start transition-colors">
              View all articles
            </Link>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { id: 1, title: "The Future of Autonomous Freight Operations", img: "/blog_warehouse.jpg", date: "Oct 12, 2026" },
              { id: 2, title: "Global Supply Chain Resilience Strategies", img: "/blog_port.jpg", date: "Oct 05, 2026" }
            ].map((item) => (
              <Link href={`/blog/${item.id}`} key={item.id} className="group border border-gray-200 hover:border-black transition-colors block bg-white">
                <div className="h-[250px] bg-gray-200 border-b border-gray-200 overflow-hidden">
                  <img src={item.img} className="w-full h-full object-cover filter grayscale group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500" alt={item.title} />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-[#C70E20]/10 text-[#C70E20] px-3 py-1 text-xs font-bold uppercase tracking-widest">Industry</span>
                    <span className="text-gray-400 text-sm font-medium">{item.date}</span>
                  </div>
                  <h3 className="font-display font-semibold text-[25px] leading-[1.3] group-hover:text-[#C70E20] transition-colors">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ Section */}
      <section className="w-full bg-[#f4f5f6] py-32 border-b border-gray-200">
        <div className="w-full max-w-[900px] mx-auto px-6 md:px-16">
          <h2 className="text-[45px] md:text-[52px] lg:text-[60px] font-display font-semibold leading-[1.1] tracking-tight text-center mb-20">
            Frequently Asked Questions!
          </h2>

          <div className="border border-gray-200 bg-white">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 last:border-0">
                <button 
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-display font-semibold text-[25px] pr-8">{faq.q}</span>
                  <div className={`w-10 h-10 border border-gray-300 flex items-center justify-center shrink-0 transition-colors ${faqOpen === i ? 'bg-black border-black text-white' : 'bg-white text-black'}`}>
                    {faqOpen === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 px-8 ${faqOpen === i ? 'max-h-40 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 text-lg">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Newsletter & Footer */}
      <section className="w-full relative py-32 bg-black border-b border-white/20">
         <img 
          src="https://framerusercontent.com/images/EFZUob9ClYUcrZB9xIcQcXy36U.png" 
          alt="Truck on road" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="relative z-10 w-full max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-[45px] md:text-[52px] font-display font-semibold leading-[1.1] tracking-tight text-white mb-10">
            Get tips, offers, and shipping news
          </h2>
          <form className="flex flex-col sm:flex-row gap-4 max-w-[600px] mx-auto" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              className="flex-1 bg-white/10 border border-white/20 px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-[#C70E20]"
            />
            <button type="submit" className="bg-[#C70E20] hover:bg-[#A00B1A] text-white px-10 py-4 font-semibold transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <footer id="contact" className="w-full bg-black text-white py-20">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="lg:col-span-2">
            <Link href="/" className="font-display font-semibold text-4xl tracking-tight block mb-6">SHIPIT.</Link>
            <p className="text-gray-400 text-lg max-w-md mb-8">
              Delivering excellence globally. We handle your cargo with unmatched speed and security.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-[#C70E20] flex items-center justify-center hover:bg-[#A00B1A] transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-12 h-12 bg-[#C70E20] flex items-center justify-center hover:bg-[#A00B1A] transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="w-12 h-12 bg-[#C70E20] flex items-center justify-center hover:bg-[#A00B1A] transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-2xl mb-6">Pages</h4>
            <ul className="space-y-4">
              <li><a href="#" onClick={(e) => handleScrollTo(e, 'top')} className="text-gray-400 hover:text-white transition-colors text-lg cursor-pointer">Home</a></li>
              <li><a href="#about" onClick={(e) => handleScrollTo(e, 'about')} className="text-gray-400 hover:text-white transition-colors text-lg cursor-pointer">About Us</a></li>
              <li><a href="#services" onClick={(e) => handleScrollTo(e, 'services')} className="text-gray-400 hover:text-white transition-colors text-lg cursor-pointer">Services</a></li>
              <li><a href="#pricing" onClick={(e) => handleScrollTo(e, 'pricing')} className="text-gray-400 hover:text-white transition-colors text-lg cursor-pointer">Pricing</a></li>
              <li><a href="#contact" onClick={(e) => handleScrollTo(e, 'contact')} className="text-gray-400 hover:text-white transition-colors text-lg cursor-pointer">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-2xl mb-6">Links</h4>
            <ul className="space-y-4">
              <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors text-lg">Dashboard Login</Link></li>
              <li><Link href="/tracking" className="text-gray-400 hover:text-white transition-colors text-lg">Track Package</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-lg">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-lg">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16 mt-20 pt-8 border-t border-white/10 text-center text-gray-500">
          <p>© 2026 SHIPIT Logistics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function PhoneCheckIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

function HandTruckIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v14a2 2 0 0 0 2 2h14" />
      <circle cx="8" cy="20" r="2" />
      <path d="M12 18V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10" />
      <path d="M12 12h8" />
    </svg>
  );
}

function TruckFastIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 17h4V5H2v12h3" />
      <path d="M20 17h2v-9h-4V5H14v12h3" />
      <path d="M14 8h6" />
      <path d="M14 11h6" />
      <circle cx="7" cy="17" r="3" />
      <circle cx="17" cy="17" r="3" />
    </svg>
  );
}
// force HMR reload
