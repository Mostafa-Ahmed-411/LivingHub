import React from "react";
import { CreditCard, DollarSign, Upload, Download } from "lucide-react";
import Sel from "../components/common/Sel";
import Inp from "../components/common/Inp";
import Btn from "../components/common/Btn";
import Badge from "../components/common/Badge";
import { paymentHistory } from "../data/mockData";

export default function PaymentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Payments
        </h2>
        <p className="text-sm text-gray-500">Submit and track your rent payments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Payment */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-5">Submit Payment</h3>
          <div className="space-y-4">
            <Sel
              label="Payment For"
              options={["Studio in Zamalek — July 2025", "Studio in Zamalek — August 2025"]}
            />
            <Inp label="Transaction ID" placeholder="e.g. TXN12345678" icon={CreditCard} />
            <Inp label="Amount Paid (EGP)" placeholder="2800" type="number" icon={DollarSign} />
            <Sel
              label="Payment Method"
              options={["Bank Transfer", "Instapay", "Vodafone Cash", "Fawry"]}
            />

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Payment Proof</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">Upload screenshot or receipt</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 5MB</p>
              </div>
            </div>

            <Btn variant="primary" size="lg" className="w-full">
              <Upload className="w-4 h-4" /> Submit Payment
            </Btn>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Transaction History</h3>
            <Btn variant="outline" size="sm">
              <Download className="w-4 h-4" /> Export
            </Btn>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Transaction ID", "Property", "Amount", "Date", "Method", "Status"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{tx.id}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 max-w-32 truncate">
                      {tx.property}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">
                      EGP {tx.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{tx.date}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{tx.method}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={tx.status === "confirmed" ? "success" : "warning"}>
                        {tx.status === "confirmed" ? "Confirmed" : "Pending"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
