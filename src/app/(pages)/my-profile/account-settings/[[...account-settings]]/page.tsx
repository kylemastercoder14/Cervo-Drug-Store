import { UserProfile } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CustomerAccountSettingsPage = () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/my-account");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <Navbar />
      <main className="px-4 py-8 xl:px-60">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[16px]" href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[16px]" href="/my-profile">
                Account
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[16px]">
                Account Settings
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage profile, security, email, and password settings.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border bg-white p-2 shadow-sm">
          <UserProfile
            path="/my-profile/account-settings"
            routing="path"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none",
              },
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerAccountSettingsPage;
