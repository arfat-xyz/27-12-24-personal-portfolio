import HomeHeader from "@/components/Home/home-header";
import "@/styles/home.css";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="" id="site-wrapper">
        {" "}
        <HomeHeader />
        {children}
      </div>
    </>
  );
}
