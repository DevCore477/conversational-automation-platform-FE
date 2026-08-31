"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HexaRGBLogo, } from "@/assets";

const UnsubscribeClient = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnsubscribe = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/unsubscribe?token=${token}`,
        { method: "GET", }
      );

      if (!res.ok) {
        throw new Error("Failed to unsubscribe");
      }

      // redirect to home after success
      router.push("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-6 text-center space-y-4">
        
        <Link href="" className="flex items-center justify-center gap-2">
          <Image
            src={HexaRGBLogo}
            className="w-10 md:w-16 h-auto cursor-pointe"
            alt="Hexa Logo"
          />
          {/* <span className="font-medium text-lg md:text-xl text-dark-gray cursor-pointer">Hexa Ai</span> */}
        </Link>
        <h1 className="text-xl font-semibold text-dark-gray">
          Unsubscribe from Newsletter
        </h1>

        <p className="text-sm text-gray-500">
          Are you sure you want to unsubscribe from Hexa AI updates? You will no longer receive emails about new features and updates.
        </p>

        {error && (
          <p className="text-sm text-danger-soft">{error}</p>
        )}

        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={handleCancel}
            className="bg-gray-100 hover:bg-gray-200 text-slate-gray px-6 py-2 rounded-lg transition"
          >
            Cancel
          </button>

          <button
            onClick={handleUnsubscribe}
            disabled={loading}
            className="bg-danger-soft hover:bg-danger-soft text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Unsubscribing..." : "Unsubscribe"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnsubscribeClient