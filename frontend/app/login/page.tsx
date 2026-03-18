"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();

      // ✅ Save token + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful ✅");

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Login failed ❌");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">

          <h1 className="text-2xl text-black font-bold mb-6 text-center">
            Login
          </h1>

          <form onSubmit={handleLogin} className="flex text-black flex-col gap-4">

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="border p-3 text-black rounded-lg"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="border text-black p-3 rounded-lg"
            />

            <button className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
              Login
            </button>

          </form>
        </div>
      </main>
    </>
  );
}