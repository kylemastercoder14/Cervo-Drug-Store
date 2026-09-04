import { redirect } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { getUserFromCookies } from "@/hooks/use-user";
import AccountSettingsForm from "./account-settings-form";

const AdminAccountSettingsPage = async () => {
  const { user } = await getUserFromCookies();

  if (!user) {
    redirect("/admin/auth/sign-in");
  }

  return (
    <div className="grid items-start gap-6 py-5">
      <Heading
        title="Account Settings"
        description="Manage your admin profile and change your password."
      />
      <AccountSettingsForm admin={user} />
    </div>
  );
};

export default AdminAccountSettingsPage;
