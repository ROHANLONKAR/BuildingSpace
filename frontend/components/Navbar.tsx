"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("User parse error:", err);
      localStorage.removeItem("user");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/"; // ✅ HARD RESET
  };
  return (
    <nav className="bg-white shadow p-4 flex justify-between text-black items-center">
      <Link href="/" className="font-bold text-xl">
        BuildingSpace
      </Link>

      <div className="flex gap-4 text-black items-center">
        {user ? (
          <>
            <span className="text-sm">Hello {user.firstName}</span>

            <Link href="/upload" className="text-blue-600">
              Upload
            </Link>

            <Link href="/my-listings" className="text-blue-600">
              My Listings
            </Link>

            <button onClick={handleLogout} className="text-red-500">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-blue-600">
              Login
            </Link>
            <Link href="/signup" className="text-blue-600">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
