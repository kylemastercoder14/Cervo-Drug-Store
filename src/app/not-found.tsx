import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="bg-red-600 w-20 h-20 flex items-center justify-center rounded-full">
        <TriangleAlert className="text-white" size={50} />
      </div>
      <p className="text-3xl mt-3 font-semibold text-muted-foreground">
        We&apos;ll be back soon
      </p>
      <p className="text-lg mt-3 text-center">
        Sorry for the inconvenience. We&apos;re currently performing some
        scheduled maintenance and will be back online shortly. Thank you for
        your patience!
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        If you have any urgent issues, please reach out to our support team at
        <a href="mailto:kylemastercoder14@gmail.com" className="underline">
          {" "}
          kylemastercoder14@gmail.com
        </a>
        .
      </p>
      <Button asChild variant="default" className="mt-5">
        <Link href="/">Go to homepage &rarr;</Link>
      </Button>
    </div>
  );
};

export default NotFound;
