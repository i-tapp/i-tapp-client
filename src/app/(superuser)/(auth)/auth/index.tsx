"use client";

import { signinAdmin } from "@/actions";
import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminAuth() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const { execute, isExecuting } = useAction(signinAdmin, {
    onSuccess: (data) => {
      console.log("Admin signed in:", data);
      router.replace("/admin");
    },
    onError: (error) => {
      console.error("Error signing in admin:", error);
      // setError(error?.message || "An error occurred while trying to sign in.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = form;

    if (!form.username || !form.password) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");

    // Detect email or username
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);

    const payload = {
      password,
      ...(isEmail ? { email: username } : { username }),
    };

    // TODO: Call login API here

    execute({
      email: username,
      password,
    });
    console.log("Logging in", payload);
    router.replace("/admin");
  };
  // bg - gray - 50;
  return (
    <div className="min-h-screen flex flex-col justify-center items-center  px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-2">Admin Login</h3>
        <p className="text-gray-500 text-sm mb-6">
          Welcome back! Please enter your details.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="font-medium text-sm">
              Email Address / Username
            </label>
            <Input
              id="username"
              name="username"
              placeholder="Enter your email or username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="font-medium text-sm">
              Password
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                name="remember"
                checked={form.remember}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    remember: (e.target as HTMLInputElement).checked,
                  }))
                }
              />

              <label htmlFor="remember">Remember me</label>
            </div>
            <Link href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <Button type="submit" disabled={!form.username || !form.password}>
            {isExecuting ? "Logging in..." : "Login as Admin"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          For authorized personnel only. &copy; 2025 i-Tapp
        </p>
      </div>
    </div>
  );
}
