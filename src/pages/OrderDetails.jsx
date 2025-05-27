import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function OrderDetails() {
  const location = useLocation();
  const [status, setStatus] = useState("fetching status")
  const orderData = location.state?.orderData || {
    orderId: "-",
    createdAt: "-",
    service: "-",
    quantity: 0,
    price: 0,
    link: "",
    customer: null
  };

  console.log("Order Data: ", orderData)

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-800",
    Unknown: "bg-gray-100 text-gray-800"
  };

  // Safely access customer data with fallbacks
  const customerName = orderData.customer?.name || "-";
  const customerEmail = orderData.customer?.email || "-";
  const customerPhone = orderData.customer?.phone || "-";

  const fetchStatus = async () => {
    const statusResponse = await fetch(
        `/api/proxy?action=status&order=${orderData.order_id}&key=80N1Xb27bTOlDym3xytiXndLkmH0TjpE`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!statusResponse.ok) {
        console.log(`Failed to get order status: ${statusResponse.status}`)
      }
  
      const statusData = await statusResponse.json()
      console.log("Order status:", statusData)
      if (statusData.error) {
        setStatus("Incorrect ID")
        return
      }
      setStatus(statusData.status)

}

  useEffect(() => {
   
    async function fetchOrderStatus() {
      fetchStatus()
    }

    if (orderData){
      fetchOrderStatus()
    }
  }, [orderData])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[orderData.status] || statusColors.Unknown}`}>
              {status}
            </span>
          </div>
          <p className="text-gray-500 mt-1">Order ID: {orderData.order_id || "-"}</p>
          <p className="text-gray-500">Created: {orderData.created_at || "-"}</p>
        </div>

        {/* Order Information */}
        <div className="p-6 space-y-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Service Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="text-gray-900 font-medium">{orderData.service_name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="text-gray-900 font-medium">{orderData.quantity?.toLocaleString() || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="text-gray-900 font-medium">{orderData.amount ? `₦${orderData.amount.toLocaleString()}` : "-"}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4 ">
              <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="text-gray-900 font-medium">{orderData.user_id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Link Information */}
          <div className="space-y-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 pt-3">Link Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg break-all">
              {orderData.link ? (
                <a href={orderData.link} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:text-blue-800">
                  {orderData.link}
                </a>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}