import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCheckoutById } from "../redux/slices/checkoutSlice";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { checkout, loading } = useSelector((state) => state.checkout);

  useEffect(() => {
    dispatch(getCheckoutById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (checkout?._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }
  }, [checkout, dispatch]);

  if (loading || !checkout) {
    return (
      <div className="p-10 text-center text-xl">
        Loading your order...
      </div>
    );
  }

  if (!checkout?._id) {
    navigate("/my-orders");
    return null;
  }

  const estimateDelivery = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 10);
    return d.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>

      <div className="border p-6 rounded-lg shadow">
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="font-semibold">
              Order ID: {checkout._id}
            </h2>
            <p className="text-gray-500">
            Order Date:{new Date(checkout.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p className="text-emerald-600">
            Estimated Delivery: {estimateDelivery(checkout.createdAt)}
          </p>
        </div>

        {checkout.checkoutItems.map((item) => (
          <div key={item.productId} className="flex mb-4 border-b pb-2">
            <img src={item.image} className="w-16 h-16 mr-4" />
            <div>
              <h4>{item.name}</h4>
              <p className="text-sm text-gray-500">
                {item.color} | {item.size}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p>${item.price}</p>
              <p>Qty: {item.quantity}</p>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-2 mt-6">
          <div>
            <h4 className="font-semibold">Payment</h4>
            <p>PayPal</p>
          </div>
          <div>
            <h4 className="font-semibold">Delivery</h4>
            <p>
              {checkout.shippingAddress.address},{" "}
              {checkout.shippingAddress.city}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
