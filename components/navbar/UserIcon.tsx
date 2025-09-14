import { LucideUser2 } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

const UserIcon = async () => {
  // const {userId} = auth()

  const user = await currentUser();

  const profileImage = user?.imageUrl;

  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt="avatar"
        className="w-6 h-6 rounded-full object-cover"
      />
    );
  }

  return <LucideUser2 className="w-6 h-6 bg-primary rounded-full text-white" />;
};

export default UserIcon;