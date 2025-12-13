import React, { useEffect } from "react";
import MyOrdersPage from "./MyOrdersPage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearCart } from "../redux/slices/cartSlice";
import { logout } from "../redux/slices/authSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Redirect to login only if user is truly null
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ✅ Manual logout handler
  const handleLogout = () => {
    dispatch(logout());                // clear auth
    dispatch(clearCart());             // clear cart
    localStorage.removeItem("userToken"); // remove token
    navigate("/login");                // redirect
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          
          {/* Left Section */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {user?.name || "User"}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {user?.email || "No Email"}
            </p>

            {/* Optional: if user image exists */}
            {user?.image && (
              <img
                src={user.image || "/placeholder.jpg"}
                alt={user.name || "User"}
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
            )}

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex items-center justify-center gap-2"
            >
              Logout
            </button>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrdersPage />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;