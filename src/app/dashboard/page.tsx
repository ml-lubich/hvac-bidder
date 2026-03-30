"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  Search,
  MoreVertical,
  Eye,
} from "lucide-react";
import { sampleBids } from "@/lib/mock-data";
import type { Bid } from "@/lib/supabase";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Bid["status"] }) {
  const styles = {
    draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    accepted: "bg-green-500/10 text-green-400 border-green-500/20",
    declined: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function DashboardPage() {
  const [bids] = useState<Bid[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hvac-bids");
      if (stored) {
        const parsed = JSON.parse(stored) as Bid[];
        return [...parsed, ...sampleBids];
      }
    }
    return sampleBids;
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      bid.client_name.toLowerCase().includes(search.toLowerCase()) ||
      bid.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || bid.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = bids
    .filter((b) => b.status === "accepted")
    .reduce((sum, b) => sum + b.total_amount, 0);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Your bid pipeline at a glance
          </p>
        </div>
        <Link
          href="/dashboard/new-bid"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Bid
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Bids"
          value={bids.length.toString()}
          icon={FileText}
          color="bg-orange-500/10 text-orange-400"
        />
        <StatCard
          label="Accepted"
          value={bids.filter((b) => b.status === "accepted").length.toString()}
          icon={TrendingUp}
          color="bg-green-500/10 text-green-400"
        />
        <StatCard
          label="Revenue Won"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          label="Pending"
          value={bids
            .filter((b) => b.status === "sent" || b.status === "draft")
            .length.toString()}
          icon={Clock}
          color="bg-amber-500/10 text-amber-400"
        />
      </div>

      {/* Bids Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search bids..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {["all", "draft", "sent", "accepted", "declined"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                    : "bg-gray-800 text-gray-400 border border-gray-700 hover:text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Client
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Amount
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredBids.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No bids found. Create your first bid to get started.
                  </td>
                </tr>
              ) : (
                filteredBids.map((bid) => (
                  <tr
                    key={bid.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {bid.client_name}
                        </p>
                        <p className="text-xs text-gray-500">{bid.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-300 capitalize">
                        {bid.job_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-400">
                        {new Date(bid.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-white">
                        ${bid.total_amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={bid.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/bid/${bid.id}`}
                          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
