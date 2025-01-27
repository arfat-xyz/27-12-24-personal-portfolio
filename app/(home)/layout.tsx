import Footer from "@/components/home-footer";
import HomeHeader from "@/components/Home/home-header";
import "@/styles/home.css";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {" "}
      <HomeHeader />
      <div className="" id="site-wrapper">
        {children}
      </div>
      <Footer />
    </>
  );
}
