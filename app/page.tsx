import { auth } from "@/auth";
import { Role } from "@prisma/client";
import Link from "next/link";

const HomePage = async () => {
  const session = await auth();
  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center">
        {session?.user?.role === Role.ADMIN ? (
          <Link href={"/dashboard"}>Dashboard</Link>
        ) : session?.user?.role === Role.USER ? (
          <></>
        ) : (
          <Link href={"/login"}>Login</Link>
        )}
      </div>
    </>
  );
};

export default HomePage;
