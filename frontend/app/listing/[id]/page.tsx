"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
  if (id) {
    fetchListing();
  }
}, [id]);

  const fetchListing = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`);
    const data = await res.json();
    setListing(data);
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <main className="p-4 md:p-10 text-black max-w-3xl mx-auto">

        {/* IMAGE */}
        {listing.imageUrl && (
          <img
            src={listing.imageUrl}
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
        )}

        <h1 className="text-2xl font-bold">{listing.title}</h1>

        <p className="text-green-600 text-white text-xl font-semibold mt-2">
          {listing.price || "Free"}
        </p>

        <p className="mt-2">Qty: {listing.quantity}</p>
        <p>Location: {listing.suburb}</p>
        <p>Address: {listing.address}</p>

        <p className="mt-4 text-white-700">{listing.description}</p>

        {/* 📞 CONTACT BUTTON */}
        <a
          href={`tel:${listing.phone}`}
          className="block mt-6 bg-blue-600 text-white p-3 text-center rounded-lg"
        >
          Call Seller
        </a>

        {/* 💬 WHATSAPP */}
        <a
          href={`https://wa.me/${listing.phone}`}
          target="_blank"
          className="block mt-2 bg-green-600 text-white p-3 text-center rounded-lg"
        >
          WhatsApp Seller
        </a>

      </main>
    </>
  );
}