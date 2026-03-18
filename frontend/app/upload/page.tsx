"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  // ✅ FORM STATE
  const [form, setForm] = useState({
    title: "",
    quantity: "",
    address: "",
    suburb: "",
    phone: "",
    description: "",
  });

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ IMAGE PREVIEW
  const handleImage = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let imageUrl = "";
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "building_space_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/di9vszjvc/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const cloudData = await res.json();
      imageUrl = cloudData.secure_url; // ✅ THIS IS YOUR IMAGE LINK
    }

    const token = localStorage.getItem("token");

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          imageUrl, // 🔥 VERY IMPORTANT
        }),
      });

      alert("Uploaded ✅");

      router.push("/my-listings"); // 🔥 redirect after upload
    } catch (error) {
      console.error(error);
      alert("Upload failed ❌");
    }
  };

  return (
    <>
      <Navbar /> {/* ✅ FIXED */}
      <main className="min-h-screen bg-gray-100 p-4 md:p-10 flex justify-center">
        <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">
            Upload Material
          </h1>

          <form
            className="flex flex-col text-black gap-4"
            onSubmit={handleSubmit}
          >
            <input
              name="title"
              placeholder="Material name"
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="quantity"
              placeholder="Quantity"
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="price"
              placeholder="Price (e.g. $100)"
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="suburb"
              placeholder="Suburb"
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="phone"
              placeholder="Phone number"
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            {/* Image Upload */}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file); // ✅ store actual file
                  setPreview(URL.createObjectURL(file)); // preview
                }
              }}
            />

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <button className="bg-green-600 text-white p-3 rounded-lg">
              Upload Material
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
