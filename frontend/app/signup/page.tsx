"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Signup failed");

      const data = await res.json();

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: form.email,
          firstName: form.firstName || "User",
        }),
      );

      alert("Signup successful ✅");

      router.replace("/");

      window.location.href = "/"; // go to homepage
    } catch (error) {
      console.error(error);
      alert("Signup failed ❌");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 flex text-black justify-center items-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex text-black flex-col gap-4"
          >
            <input
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              className="border p-3 text-black rounded-lg"
            />

            <input
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
              Signup
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
