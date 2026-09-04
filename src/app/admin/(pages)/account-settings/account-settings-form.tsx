"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Admin } from "@prisma/client";
import { Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { updateCurrentAdminAccount } from "@/actions/manage-staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AccountSettingsForm = ({ admin }: { admin: Admin }) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [form, setForm] = React.useState({
    name: admin.name,
    email: admin.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await updateCurrentAdminAccount(form);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      setForm((current) => ({
        ...current,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Profile Information
          </h2>
          <p className="text-sm text-muted-foreground">
            Update admin account identity used inside dashboard.
          </p>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="admin-name">Name</Label>
            <Input
              id="admin-name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-md bg-green-50 p-2 text-green-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Change Password
            </h2>
            <p className="text-sm text-muted-foreground">
              Leave blank if password should stay same.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={form.currentPassword}
              onChange={(event) =>
                updateField("currentPassword", event.target.value)
              }
              disabled={isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={form.newPassword}
              onChange={(event) => updateField("newPassword", event.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              disabled={isPending}
            />
          </div>

          <Button type="submit" disabled={isPending} className="gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AccountSettingsForm;
