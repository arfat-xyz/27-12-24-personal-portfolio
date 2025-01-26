import { auth } from "@/auth";
import HomeClientComponent from "@/components/Home/home-client-componnet";
import { db } from "@/lib/db";
import "@/styles/home.css";

const HomePage = async () => {
  const session = await auth();
  const allProjectCategory = await db.projectCategory.findMany();
  return (
    <>
      <HomeClientComponent allProjectCategory={allProjectCategory} />
    </>
  );
};

export default HomePage;
