import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex-center flex-col min-h-screen shadow-md">
      <Card className="p-4 flex flex-col justify-center items-center">
        <Logo className="size-16" />
        <div className="flex p-4 flex-col justify-center">
          <h1 className="text-xl font-extrabold text-center">Not Found</h1>
          <p className="text-sm">Could not find requested page</p>
          <Button className="mt-3" asChild variant="default">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
