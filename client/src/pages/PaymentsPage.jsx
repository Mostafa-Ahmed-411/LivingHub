import React, { useState, useEffect } from "react";
import { CreditCard, DollarSign, Upload, Download } from "lucide-react";
import Sel from "../components/common/Sel";
import Inp from "../components/common/Inp";
import Btn from "../components/common/Btn";
import Badge from "../components/common/Badge";
import api from "../api/client";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // حقول الإدخال الخاصة بعملية دفع جديدة
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentFor, setPaymentFor] = useState("");

  useEffect(() => {
    // جلب سجل المدفوعات الحقيقي من الباك إيند
    api.get("/user/dashboard/payments")
      .then((res) => {
        // السيرفر يرجع قائمة المدفوعات
        setPayments(res.data.payments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching payment history:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    // كود إرسال الدفع الجديد للباك إيند سيوضع هنا لاحقاً
    console.log({ transactionId, amount, paymentMethod, paymentFor });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500 animate-pulse font-medium">Loading payments...</p>
      </div>
    );
  }

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
        {/* Submit Payment Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-5">Submit Payment</h3>
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <Sel
              label="Payment For"
              options={["No active rentals to pay for"]}
              value={paymentFor}
              onChange={(e) => setPaymentFor(e.target.value)}
            />
            <Inp 
              label="Transaction ID" 
              placeholder="e.g. TXN12345678" 
              icon={CreditCard} 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
            <Inp 
              label="Amount Paid (EGP)" 
              placeholder="0" 
              type="number" 
              icon={DollarSign} 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Sel
              label="Payment Method"
              options={["Bank Transfer", "Instapay", "Vodafone Cash", "Fawry"]}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Payment Proof</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">Upload screenshot or receipt</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 5MB</p>
              </div>
            </div>

            <Btn variant="primary" size="lg" className="w-full" type="submit">
              <Upload className="w-4 h-4" /> Submit Payment
            </Btn>
          </form>
        </div>

        {/* Transaction History Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Transaction History</h3>
            <Btn variant="outline" size="sm" disabled={payments.length === 0}>
              <Download className="w-4 h-4" /> Export
            </Btn>
          </div>

          <div className="overflow-x-auto">
            {payments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">No transaction history found.</p>
              </div>
            ) : (
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
                  {payments.map((tx) => (
                    <tr
                      key={tx._id || tx.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{tx.transactionId || tx.id}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 max-w-32 truncate">
                        {tx.propertyTitle || tx.property}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-gray-900">
                        EGP {(tx.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : tx.date}
                      </td>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}