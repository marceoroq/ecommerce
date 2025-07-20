import { verifySession } from "@/lib/auth/verify-session";

import { ProfileForm } from "@/components/shared/user/profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SessionProvider } from "next-auth/react";

export default async function ProfilePage() {
  const { user, session } = await verifySession();

  return (
    <div className="flex flex-col gap-4 w-full">
      <Avatar className="size-20">
        <AvatarImage src={user.image!} />
        <AvatarFallback className="text-2xl">{user.name!.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <SessionProvider session={session}>
        <ProfileForm user={user} />
      </SessionProvider>
    </div>
  );
}
