"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // On mobile, sidebar should be closed by default
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear the cookie by setting it to expire
      document.cookie = "OurSiteJWT=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // Redirect to home/login page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div id="sidenavv" className="relative">
        {/* Sidebar */}
        <nav
          className={`fixed top-0 left-0 h-full bg-[#343a40] text-white z-50 transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-hide ${isMobile
            ? isOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full w-64"
            : isOpen
              ? "translate-x-0 w-[200px]"
              : "-translate-x-full w-[200px]"
            }`}
          style={{
            padding: isOpen ? "16px" : "0",
            msOverflowStyle: 'none',  /* IE and Edge */
            scrollbarWidth: 'none',   /* Firefox */
          }}
        >
          {/* Webkit scrollbar hide */}
          <style jsx>{`
            nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-center flex-1 text-lg font-semibold">Dashboard</h3>
              {isMobile && (
                <button
                  onClick={closeSidebar}
                  className="text-white hover:text-gray-300 p-2 -mr-2"
                  aria-label="Close sidebar"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <ul className="flex-1 list-none p-0 m-0 space-y-3">
              <li>
                <a
                  href="/dashboard/hero"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Hero
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/features"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/news"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  News
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/aboutus"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/featuredservices"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Featured Services
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/ourservices"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Our Services
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/steps"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Steps
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/getintouch"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Get In Touch
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/contact"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Contact Banner
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/video"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Video
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/brands"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Brands
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/ourclients"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Our Clients
                </a>
              </li>

              {/* ── New Content Sections ── */}
              <li className="mt-4 pt-3 border-t border-white border-opacity-10">
                <span className="block text-xs uppercase tracking-widest text-gray-400 px-3 mb-2">Content</span>
              </li>
              <li>
                <a
                  href="/dashboard/testmonials"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/skills"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/whoweserve"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Who We Serve
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/whychoosevan"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Why Choose Van
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/ourtrackrecord"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Our Track Record
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/portfolio"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/projects"
                  onClick={closeSidebar}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors"
                >
                  Projects
                </a>
              </li>

              <li className="mt-6 pt-4 border-t border-white border-opacity-10">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className="block text-white no-underline hover:text-gray-300 py-2 px-3 rounded transition-colors cursor-pointer"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Toggle Button - Hidden on mobile when sidebar is open */}
        {(!isMobile || !isOpen) && (
          <button
            onClick={toggleSidebar}
            className={`fixed top-5 z-50 bg-black text-white border-none cursor-pointer p-2 text-lg rounded transition-all duration-300 ${isMobile
              ? "left-2"
              : isOpen
                ? "left-[200px]"
                : "left-2"
              }`}
            aria-label="Toggle sidebar"
          >
            {isOpen ? <FaArrowLeft /> : <FaArrowRight />}
          </button>
        )}

        {/* Spacer to push content - only on desktop */}
        {!isMobile && (
          <div
            className="transition-all duration-300"
            style={{ marginLeft: isOpen ? "200px" : "0" }}
          />
        )}
      </div>
    </>
  );
}
