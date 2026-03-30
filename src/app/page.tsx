import Link from "next/link";
import {
  Zap,
  Clock,
  FileText,
  DollarSign,
  Shield,
  Smartphone,
  Star,
  ArrowRight,
  CheckCircle2,
  Wrench,
} from "lucide-react";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              HVAC <span className="text-orange-500">BidPro</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Reviews
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/25"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">
              AI-Powered Bid Generation
            </span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in stagger-1">
          Generate HVAC Bids
          <br />
          <span className="gradient-text">in 60 Seconds</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in stagger-2">
          Stop wasting 3-5 hours on manual estimates. Enter job details, and
          BidPro generates accurate, professional bids your customers will
          trust.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in stagger-3">
          <Link
            href="/signup"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:shadow-xl hover:shadow-orange-500/25 animate-pulse-glow flex items-center justify-center gap-2"
          >
            Start Bidding Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#features"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg font-medium transition-all flex items-center justify-center"
          >
            See How It Works
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500 animate-fade-in stagger-4">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Free 14-day trial
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Cancel anytime
          </span>
        </div>

        {/* Mock dashboard preview */}
        <div className="mt-16 animate-fade-in stagger-5">
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-gray-500">
                  HVAC BidPro Dashboard
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Active Bids</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Won This Month</p>
                  <p className="text-2xl font-bold text-green-400">8</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-orange-400">$47.2K</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  {
                    name: "Johnson Residence — AC Install",
                    amount: "$7,850",
                    status: "Sent",
                    color: "text-blue-400",
                  },
                  {
                    name: "Riverside Office — Package Unit",
                    amount: "$18,400",
                    status: "Accepted",
                    color: "text-green-400",
                  },
                  {
                    name: "Garcia Family — Heat Pump Repair",
                    amount: "$1,250",
                    status: "Draft",
                    color: "text-gray-400",
                  },
                ].map((bid) => (
                  <div
                    key={bid.name}
                    className="flex items-center justify-between bg-gray-800/30 rounded-lg px-4 py-3"
                  >
                    <span className="text-sm text-gray-300">{bid.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-white">
                        {bid.amount}
                      </span>
                      <span className={`text-xs ${bid.color}`}>
                        {bid.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const stats = [
    { value: "2,000+", label: "Contractors" },
    { value: "$14M+", label: "Bids Generated" },
    { value: "67%", label: "Avg Win Rate" },
    { value: "4.9/5", label: "Rating" },
  ];

  return (
    <section className="py-12 px-4 border-y border-gray-800/50">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl sm:text-3xl font-bold gradient-text">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "60-Second Bids",
      description:
        "Enter job details and get a complete, itemized bid instantly. No more spreadsheet headaches.",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Professional Templates",
      description:
        "Clean, branded bid templates that make your company look like a million bucks. Your logo, your terms.",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Accurate Pricing",
      description:
        "Equipment, materials, and labor costs based on real market data. Stop leaving money on the table.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Save 3-5 Hours Per Bid",
      description:
        "Time you used to spend on estimates is now time closing more deals and running more calls.",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Works on Your Phone",
      description:
        "Generate bids right from the job site. No laptop needed — works on any device.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Track Every Bid",
      description:
        "Dashboard shows all your bids — draft, sent, accepted, declined. Know your pipeline at a glance.",
    },
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Built for contractors,{" "}
            <span className="gradient-text">not paper pushers</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to bid faster, win more jobs, and look
            professional doing it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-orange-500/30 transition-all hover:bg-gray-900/80 group"
            >
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400 mb-4 group-hover:bg-orange-500/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Enter Job Details",
      description:
        "Residential or commercial, square footage, system type, location — takes 30 seconds.",
    },
    {
      step: "02",
      title: "Select Services",
      description:
        "Install, repair, maintenance, ductwork — pick what the job needs.",
    },
    {
      step: "03",
      title: "Get Your Bid",
      description:
        "AI generates a full bid with line items, labor, equipment, and materials — all priced out.",
    },
    {
      step: "04",
      title: "Send & Win",
      description:
        "Preview, customize, and send. Professional bids that close deals.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-900/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Four steps. <span className="gradient-text">One minute.</span>
          </h2>
          <p className="text-gray-400 text-lg">
            From job site to professional bid, faster than you can fill out a
            change order.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="text-5xl font-black text-orange-500/20 mb-3">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple pricing.{" "}
            <span className="gradient-text">Serious ROI.</span>
          </h2>
          <p className="text-gray-400 text-lg">
            One won bid pays for a full year. That&apos;s the math.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all">
            <h3 className="text-lg font-semibold text-gray-300 mb-1">Pro</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold">$49</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              For solo contractors and small crews
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited bids",
                "Professional templates",
                "AI bid generation",
                "PDF export",
                "Bid tracking dashboard",
                "Email support",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              Start Free Trial
            </Link>
          </div>

          <div className="bg-gray-900 border-2 border-orange-500 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-1">
              Business
            </h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              For growing HVAC companies
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Everything in Pro",
                "Team access (up to 10 users)",
                "Custom branding & logo",
                "Priority AI generation",
                "Advanced analytics",
                "Phone & email support",
                "Custom terms templates",
                "Integration API access",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/25"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Mike Torres",
      role: "Owner, Torres HVAC Services",
      location: "Phoenix, AZ",
      quote:
        "I used to spend my entire Sunday doing bids for the week. Now I knock them out between calls. BidPro literally gave me my weekends back.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Operations Manager, CoolAir Pro",
      location: "Houston, TX",
      quote:
        "Our close rate went from 30% to 52% after switching to BidPro. The professional templates make us look like a much bigger company.",
      rating: 5,
    },
    {
      name: "Dave Kowalski",
      role: "Master Technician & Owner",
      location: "Chicago, IL",
      quote:
        "Finally, software that gets it. No fancy BS — just enter the job, get the bid, send it. My guys in the field actually use this one.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-4 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by{" "}
            <span className="gradient-text">2,000+ contractors</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Don&apos;t take our word for it. Here&apos;s what the guys in the
            field say.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.role}</p>
                <p className="text-gray-600 text-xs">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "How accurate are the AI-generated bids?",
      a: "Our pricing data is based on current market rates for equipment, materials, and regional labor costs. You can always adjust any line item before sending — the AI gives you a solid starting point that saves hours of manual calculation.",
    },
    {
      q: "Can I customize the bid templates with my company branding?",
      a: "Absolutely. Business plan users get full branding customization — your logo, colors, and custom terms. Pro users get professional templates with their company information.",
    },
    {
      q: "Do I need to be tech-savvy to use BidPro?",
      a: "Not at all. If you can fill out a work order, you can use BidPro. We built this for contractors, not IT departments. Most users are generating bids within 5 minutes of signing up.",
    },
    {
      q: "What if I need to adjust pricing for my area?",
      a: "Every line item is fully editable. Change quantities, prices, add custom items, or remove what doesn't apply. Your changes are saved for future reference.",
    },
    {
      q: "Can my whole crew use it?",
      a: "Business plan supports up to 10 users. Your techs can create bids from the field on their phones, and you can review and approve before sending.",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Common <span className="gradient-text">questions</span>
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-white hover:text-orange-400 transition-colors list-none">
                {faq.q}
                <span className="text-gray-500 group-open:rotate-45 transition-transform text-lg">
                  +
                </span>
              </summary>
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to bid smarter?
        </h2>
        <p className="text-gray-400 text-lg mb-8">
          Join 2,000+ HVAC contractors who stopped guessing and started winning.
          14-day free trial, no card required.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:shadow-xl hover:shadow-orange-500/25"
        >
          Get Started Free
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">
              HVAC <span className="text-orange-500">BidPro</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Contact
            </a>
          </div>
          <p className="text-sm text-gray-600">
            &copy; 2026 HVAC BidPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
