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
    <div className="w-full lg:grid lg:grid-cols-2 h-screen">
      <div className="hidden bg-muted lg:block">
        <Image
          src="/images/bg.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover brightness-[0.6]"
        />
      </div>
      <form
        onSubmit={onSubmit}
        className="flex items-center justify-center py-12"
      >
        <div className="mx-auto grid gap-3">
          <Image src="/images/logo.png" alt="Logo" width={200} height={200} className="mx-auto" />
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
  );
};

export default AdminSignIn;
