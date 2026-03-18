"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-listings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    setListings(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchListings();
  }, []);
  const [editing, setEditing] = useState<any>(null);

  const handleEdit = (item: any) => {
    setEditing(item);
  };
  const deleteListing = async (id: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.log("DELETE ERROR:", text);
      alert("Delete failed");
      return;
    }

    fetchListings();
  };
  const updateListing = async () => {
    const token = localStorage.getItem("token");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${editing.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editing),
    });

    setEditing(null);
    fetchListings(); // refresh
  };
  return (
    <>
      <Navbar />

      <main className="p-4 md:p-10 text-black">
        <h1 className="text-2xl font-bold mb-6">My Listings</h1>

        {listings.length === 0 ? (
          <p>No listings yet</p>
        ) : (
          <div className="grid grid-cols-1 text-black sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                {/* ✅ IMAGE */}
                <img
                  src={item.imageUrl || "/no-image.png"}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-xl font-semibold">{item.title}</h2>

                  <p className="text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-gray-600">Location: {item.suburb}</p>
                  <p className="text-gray-600">Address: {item.address}</p>
                  <p className="text-gray-600">Price: {item.price}</p>

                  <div className="flex gap-2 mt-4">
                    {/* ✏️ EDIT */}
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded"
                    >
                      Edit
                    </button>

                    {/* ❌ DELETE */}
                    <button
                      onClick={() => deleteListing(item.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {/* 🚀 EDIT POPUP */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md text-black">
            <h2 className="text-xl font-bold mb-4">Edit Listing</h2>

            <input
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Title"
            />

            <input
              value={editing.quantity}
              onChange={(e) =>
                setEditing({ ...editing, quantity: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Quantity"
            />

            <input
              value={editing.suburb}
              onChange={(e) =>
                setEditing({ ...editing, suburb: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Suburb"
            />

            <textarea
              value={editing.description || ""}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Description"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={updateListing}
                className="flex-1 bg-green-600 text-white p-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditing(null)}
                className="flex-1 bg-gray-400 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
