"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginUser } from "@/actions/manage-staff";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AdminSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginUser(email, password)
      .then((response) => {
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Redirecting to dashboard...");
          router.push("/admin/dashboard");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Full Screen Background Image - Covers entire viewport */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/auth.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Login Form Card - Positioned Absolutely on Right Side */}
      <div className="absolute right-20 top-0 bottom-0 flex items-center justify-center z-10 p-4 sm:p-6 lg:p-8">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-lg! bg-white rounded-lg shadow-2xl p-6 sm:p-8 lg:p-10"
        >
          <div className="grid gap-3">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="mx-auto"
            />
            <div className="grid gap-2 text-center mt-3">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your information below to login to your account
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Email Address</Label>
                <Input
                  placeholder="Enter email address"
                  type="email"
                  required
                  value={email}
                  className="border border-zinc-200"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Password</Label>
                <Input
                  placeholder="Enter password"
                  type="password"
                  required
                  value={password}
                  className="border border-zinc-200"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="animate-spin mr-2" size="20" />}
                Login
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignIn;
