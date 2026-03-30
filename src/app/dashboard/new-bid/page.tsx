"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Home,
  Wrench as WrenchIcon,
  Hammer,
  Settings,
  Wind,
  Zap,
  Loader2,
} from "lucide-react";
import { generateMockBid } from "@/lib/mock-data";

type Step = 1 | 2 | 3;

const systemTypes = [
  { value: "Central AC", icon: Wind, label: "Central AC" },
  { value: "Heat Pump", icon: Zap, label: "Heat Pump" },
  { value: "Furnace", icon: Home, label: "Furnace" },
  { value: "Mini Split", icon: Settings, label: "Mini Split" },
  { value: "Boiler", icon: Building2, label: "Boiler" },
  { value: "Package Unit", icon: Building2, label: "Package Unit" },
];

const serviceOptions = [
  {
    value: "install",
    label: "New Installation",
    description: "Full system install with equipment",
    icon: Hammer,
  },
  {
    value: "repair",
    label: "Repair / Service",
    description: "Diagnose and fix existing system",
    icon: WrenchIcon,
  },
  {
    value: "maintenance",
    label: "Maintenance",
    description: "Tune-up, cleaning, inspection",
    icon: Settings,
  },
  {
    value: "ductwork",
    label: "Ductwork",
    description: "New or replacement duct system",
    icon: Wind,
  },
];

export default function NewBidPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [generating, setGenerating] = useState(false);

  // Form state
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [jobType, setJobType] = useState<"residential" | "commercial">(
    "residential"
  );
  const [systemType, setSystemType] = useState("Central AC");
  const [squareFootage, setSquareFootage] = useState("");
  const [location, setLocation] = useState("");
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const toggleService = (service: string) => {
    setServiceTypes((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const canProceed = () => {
    if (step === 1) return clientName && squareFootage && location;
    if (step === 2) return serviceTypes.length > 0;
    return true;
  };

  const handleGenerate = async () => {
    setGenerating(true);

    // Simulate AI generation delay
    await new Promise((r) => setTimeout(r, 2000));

    const bid = generateMockBid({
      clientName,
      clientAddress,
      clientPhone,
      clientEmail,
      jobType,
      serviceTypes,
      systemType,
      squareFootage: parseInt(squareFootage) || 1500,
      location,
      notes,
    });

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem("hvac-bids") || "[]");
    existing.unshift(bid);
    localStorage.setItem("hvac-bids", JSON.stringify(existing));

    router.push(`/dashboard/bid/${bid.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <button
        onClick={() => (step > 1 ? setStep((step - 1) as Step) : router.back())}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {step > 1 ? "Back" : "Dashboard"}
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create New Bid</h1>
        <p className="text-gray-400 text-sm">
          {step === 1 && "Enter the job and client details"}
          {step === 2 && "Select the services needed"}
          {step === 3 && "Review and generate your bid"}
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                s <= step
                  ? "bg-orange-500 text-white"
                  : "bg-gray-800 text-gray-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`h-0.5 flex-1 rounded transition-colors ${
                  s < step ? "bg-orange-500" : "bg-gray-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Job Details */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Job Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["residential", "commercial"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setJobType(type)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    jobType === type
                      ? "border-orange-500 bg-orange-500/10 text-orange-400"
                      : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  {type === "residential" ? (
                    <Home className="w-5 h-5" />
                  ) : (
                    <Building2 className="w-5 h-5" />
                  )}
                  <span className="font-medium capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Client / Property Name *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Johnson Residence"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Address
              </label>
              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="1234 Oak Street, Austin, TX 78701"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="(512) 555-0142"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@email.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* System Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              System Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {systemTypes.map((sys) => (
                <button
                  key={sys.value}
                  onClick={() => setSystemType(sys.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-all ${
                    systemType === sys.value
                      ? "border-orange-500 bg-orange-500/10 text-orange-400"
                      : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <sys.icon className="w-4 h-4" />
                  {sys.label}
                </button>
              ))}
            </div>
          </div>

          {/* Square Footage & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Square Footage *
              </label>
              <input
                type="number"
                value={squareFootage}
                onChange={(e) => setSquareFootage(e.target.value)}
                placeholder="2,200"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Location / City *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Austin, TX"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Services */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Services (choose one or more)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceOptions.map((service) => {
                const selected = serviceTypes.includes(service.value);
                return (
                  <button
                    key={service.value}
                    onClick={() => toggleService(service.value)}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                      selected
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-gray-700 bg-gray-900 hover:border-gray-600"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        selected
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      <service.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p
                        className={`font-medium text-sm ${
                          selected ? "text-orange-400" : "text-white"
                        }`}
                      >
                        {service.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {service.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Any special requirements, existing system details, customer preferences..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
            <div className="p-5">
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                Job Details
              </h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-500">Client</span>
                <span className="text-white">{clientName}</span>
                {clientAddress && (
                  <>
                    <span className="text-gray-500">Address</span>
                    <span className="text-white">{clientAddress}</span>
                  </>
                )}
                <span className="text-gray-500">Type</span>
                <span className="text-white capitalize">{jobType}</span>
                <span className="text-gray-500">System</span>
                <span className="text-white">{systemType}</span>
                <span className="text-gray-500">Sq. Footage</span>
                <span className="text-white">
                  {parseInt(squareFootage).toLocaleString()} sq ft
                </span>
                <span className="text-gray-500">Location</span>
                <span className="text-white">{location}</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                Services
              </h3>
              <div className="flex flex-wrap gap-2">
                {serviceTypes.map((s) => (
                  <span
                    key={s}
                    className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-sm capitalize"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {notes && (
              <div className="p-5">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Notes
                </h3>
                <p className="text-sm text-gray-300">{notes}</p>
              </div>
            )}
          </div>

          <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-300">
                  AI will generate your bid
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Equipment, materials, labor hours, and pricing will be
                  calculated based on your inputs. You can edit everything after
                  generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => step > 1 && setStep((step - 1) as Step)}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            step > 1
              ? "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
              : "invisible"
          }`}
        >
          Back
        </button>

        {step < 3 ? (
          <button
            onClick={() => canProceed() && setStep((step + 1) as Step)}
            disabled={!canProceed()}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-800 disabled:text-gray-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/25 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Bid...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate Bid
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
