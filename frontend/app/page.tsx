"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [suburb, setSuburb] = useState("");
  const [listings, setListings] = useState([]);

  // ✅ DEFINE HERE (OUTSIDE)
  const fetchListings = async () => {
    const query = new URLSearchParams({
      search,
      suburb,
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings?${query}`);
    const data = await res.json();
    setListings(data);
  };

  // ✅ CALL ON LOAD
  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      <Navbar />

      <main className="p-4 md:p-10">
        {/* 🔍 SEARCH */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            placeholder="Search material"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg w-full"
          />

          <input
            placeholder="Suburb"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            className="border p-3 rounded-lg w-full"
          />

          <button
            onClick={fetchListings} // ✅ NOW WORKS
            className="bg-blue-600 text-white px-6 rounded-lg"
          >
            Search
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Listings</h1>

        {/* ❗ USE listings NOT materials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item: any) => (
            <div
              key={item.id}
              onClick={() => router.push(`/listing/${item.id}`)}
              className="bg-white rounded-xl shadow overflow-hidden cursor-pointer"
            >
              <img
                src={
                  item.imageUrl && item.imageUrl.trim() !== ""
                    ? item.imageUrl
                    : "/no-img.png"
                }
                className="w-full h-48 object-cover"
              />

              <div className="p-4 text-black">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p>{item.quantity}</p>
                <p>{item.suburb}</p>

                {/* 💰 SHOW PRICE */}
                <p className="text-green-600 font-bold mt-2">
                  {item.price || "Free"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
