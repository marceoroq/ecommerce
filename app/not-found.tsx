import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex-center flex-col min-h-screen shadow-md">
      <Card className="p-6 flex flex-col justify-center items-center gap-6">
        <div className="flex flex-col justify-center items-center">
          <Logo className="size-16" />
          <h1 className="text-2xl font-bold">Page Not Found</h1>
          <p className="text-balance text-muted-foreground">
            Could not find requested page
          </p>
        </div>
        <Button asChild variant="default" className="w-full">
          <Link href="/">Back to Home</Link>
        </Button>
      </Card>
    </div>
  );
}
