"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Send,
  Printer,
  Wrench,
  CheckCircle2,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { getBid, updateBidStatus } from "@/lib/db";
import type { Bid } from "@/lib/supabase";

export default function BidDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth({ redirectTo: "/login" });
  const [bid, setBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"preview" | "details">("preview");
  const [sendingStatus, setSendingStatus] = useState(false);

  useEffect(() => {
    if (!user) return;
    getBid(id, user.id).then((data) => {
      setBid(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, user]);

  const handleMarkSent = async () => {
    if (!bid) return;
    setSendingStatus(true);
    await updateBidStatus(bid.id, "sent");
    setBid({ ...bid, status: "sent" });
    setSendingStatus(false);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!bid) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-gray-400">Bid not found.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 text-orange-400 hover:text-orange-300 text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const equipmentItems = bid.line_items.filter(
    (i) => i.category === "equipment"
  );
  const materialItems = bid.line_items.filter(
    (i) => i.category === "materials"
  );
  const laborItems = bid.line_items.filter((i) => i.category === "labor");

  const equipmentTotal = equipmentItems.reduce((s, i) => s + i.total, 0);
  const materialsTotal = materialItems.reduce((s, i) => s + i.total, 0);
  const laborTotal = laborItems.reduce((s, i) => s + i.total, 0);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">{bid.client_name}</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {bid.id} &middot; Created{" "}
            {new Date(bid.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          {bid.status === "draft" && (
            <button
              onClick={handleMarkSent}
              disabled={sendingStatus}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
            >
              {sendingStatus ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Mark as Sent
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "preview"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Bid Preview
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "details"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Job Details
        </button>
      </div>

      {activeTab === "preview" ? (
        /* Bid Preview — Professional Template */
        <div className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden print:shadow-none">
          {/* Header */}
          <div className="bg-gray-900 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Wrench className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {bid.company_name || "Your Company Name"}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {bid.company_license
                      ? `License #${bid.company_license}`
                      : "Licensed HVAC Contractor"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-2xl font-bold text-orange-400">
                  ESTIMATE
                </h3>
                <p className="text-gray-400 text-sm mt-1">{bid.id}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(bid.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Client & Job Info */}
          <div className="grid md:grid-cols-2 gap-6 p-8 border-b border-gray-200">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Prepared For
              </h4>
              <p className="font-semibold text-lg">{bid.client_name}</p>
              {bid.client_address && (
                <p className="text-gray-600 text-sm mt-1">
                  {bid.client_address}
                </p>
              )}
              {bid.client_phone && (
                <p className="text-gray-600 text-sm">{bid.client_phone}</p>
              )}
              {bid.client_email && (
                <p className="text-gray-600 text-sm">{bid.client_email}</p>
              )}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Job Summary
              </h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-500">Type:</span>{" "}
                  <span className="capitalize font-medium">{bid.job_type}</span>
                </p>
                <p>
                  <span className="text-gray-500">System:</span>{" "}
                  <span className="font-medium">{bid.system_type}</span>
                </p>
                <p>
                  <span className="text-gray-500">Area:</span>{" "}
                  <span className="font-medium">
                    {bid.square_footage.toLocaleString()} sq ft
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Services:</span>{" "}
                  <span className="font-medium capitalize">
                    {bid.service_type.join(", ")}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="p-8">
            {/* Equipment */}
            {equipmentItems.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  Equipment
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="text-left py-2 font-medium">
                        Description
                      </th>
                      <th className="text-center py-2 font-medium w-16">
                        Qty
                      </th>
                      <th className="text-right py-2 font-medium w-24">
                        Unit Price
                      </th>
                      <th className="text-right py-2 font-medium w-24">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100"
                      >
                        <td className="py-2.5">{item.description}</td>
                        <td className="py-2.5 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 text-right">
                          ${item.unit_price.toLocaleString()}
                        </td>
                        <td className="py-2.5 text-right font-medium">
                          ${item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="py-2 text-right font-medium text-gray-500">
                        Equipment Subtotal
                      </td>
                      <td className="py-2 text-right font-bold">
                        ${equipmentTotal.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Materials */}
            {materialItems.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Materials
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="text-left py-2 font-medium">
                        Description
                      </th>
                      <th className="text-center py-2 font-medium w-16">
                        Qty
                      </th>
                      <th className="text-right py-2 font-medium w-24">
                        Unit Price
                      </th>
                      <th className="text-right py-2 font-medium w-24">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100"
                      >
                        <td className="py-2.5">{item.description}</td>
                        <td className="py-2.5 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 text-right">
                          ${item.unit_price.toLocaleString()}
                        </td>
                        <td className="py-2.5 text-right font-medium">
                          ${item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="py-2 text-right font-medium text-gray-500">
                        Materials Subtotal
                      </td>
                      <td className="py-2 text-right font-bold">
                        ${materialsTotal.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Labor */}
            {laborItems.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Labor
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="text-left py-2 font-medium">
                        Description
                      </th>
                      <th className="text-center py-2 font-medium w-16">
                        Qty
                      </th>
                      <th className="text-right py-2 font-medium w-24">
                        Rate
                      </th>
                      <th className="text-right py-2 font-medium w-24">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {laborItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100"
                      >
                        <td className="py-2.5">{item.description}</td>
                        <td className="py-2.5 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 text-right">
                          ${item.unit_price.toLocaleString()}
                        </td>
                        <td className="py-2.5 text-right font-medium">
                          ${item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="py-2 text-right font-medium text-gray-500">
                        Labor Subtotal
                      </td>
                      <td className="py-2 text-right font-bold">
                        ${laborTotal.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Grand Total */}
            <div className="border-t-2 border-gray-900 pt-4 mt-8">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total Estimate</span>
                <span className="text-3xl font-black text-orange-600">
                  ${bid.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gray-50 p-8 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Valid Until
                </h4>
                <p className="text-sm text-gray-700">{bid.valid_until}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Terms & Conditions
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {bid.terms ||
                    "Payment due within 30 days of project completion. 1-year warranty on all labor. Equipment warranty per manufacturer terms. Price valid for 30 days from bid date."}
                </p>
              </div>
            </div>

            {/* Signature Lines */}
            <div className="grid md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-200">
              <div>
                <div className="border-b border-gray-300 mb-2 pb-8" />
                <p className="text-xs text-gray-500">
                  Contractor Signature & Date
                </p>
              </div>
              <div>
                <div className="border-b border-gray-300 mb-2 pb-8" />
                <p className="text-xs text-gray-500">
                  Customer Signature & Date
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Job Details Tab */
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Client Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span>{bid.client_name}</span>
                </div>
                {bid.client_address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{bid.client_address}</span>
                  </div>
                )}
                {bid.client_phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{bid.client_phone}</span>
                  </div>
                )}
                {bid.client_email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{bid.client_email}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Job Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-gray-500" />
                  <span className="capitalize">{bid.job_type}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Wrench className="w-4 h-4 text-gray-500" />
                  <span>{bid.system_type}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>
                    {new Date(bid.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{bid.labor_hours} estimated labor hours</span>
                </div>
              </div>
            </div>
          </div>
          {bid.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Notes
              </h3>
              <p className="text-sm text-gray-300">{bid.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
