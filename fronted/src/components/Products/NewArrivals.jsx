import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);

  // ✅ Fetch products safely
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.products || [];

        setNewArrivals(data);
      } catch (error) {
        console.log("Axios Error:", error);
        setNewArrivals([]);
      }
    };

    fetchNewArrivals();
  }, []);

  // ✅ Mouse drag logic
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    scrollRef.current.classList.add("select-none");

    const x = e.pageX - scrollRef.current.offsetLeft;
    setStartX(x);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => {
    setIsDragging(false);
    scrollRef.current?.classList.remove("select-none");
  };

  // ✅ Touch swipe support (Mobile Fix)
  const handleTouchStart = (e) => {
    if (!scrollRef.current) return;
    const touch = e.touches[0];
    const x = touch.pageX - scrollRef.current.offsetLeft;

    setIsDragging(true);
    setStartX(x);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    const touch = e.touches[0];
    const x = touch.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;

    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // ✅ Scroll button fix
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  // ✅ Button enable/disable correctness
  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;

    const left = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    setCanScrollLeft(left > 0);
    setCanScrollRight(left < maxScroll - 5);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons();

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
    };
  }, [newArrivals]);

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the latest styles straight off the runway.
        </p>

        {/* ✅ Scroll buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded border ${
              canScrollLeft
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded border ${
              canScrollRight
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* ✅ Slider */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDragging}
      >
        {newArrivals.map((product, index) => {
          const imageUrl =
            product?.images?.[0]?.url ||
            "https://via.placeholder.com/400x500";

          const altText =
            product?.images?.[0]?.altText || product?.name || "Product";

          return (
            <div
              key={product?._id || index}
              className="min-w-full sm:min-w-[50%] lg:min-w-[30%] relative"
            >
              <img
                src={imageUrl}
                alt={altText}
                className="w-full h-[500px] object-cover rounded-lg pointer-events-none"
                draggable="false"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md text-white p-4 rounded-b-lg">
                <Link to={`/product/${product?._id}`} className="block">
                  <h4 className="font-medium">{product?.name}</h4>
                  <p className="mt-1">${product?.price}</p>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NewArrivals;