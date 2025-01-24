import { auth } from "@/auth";
import "@/styles/home.css";

const HomePage = async () => {
  const session = await auth();
  return (
    <>
      {/* hero section */}
      <section className="hero"></section>

      {/* Services */}
      <section className="services"></section>

      {/* Projects */}
      <section className="projects"></section>

      {/* Experience study */}
      <section className="exstudy"></section>

      {/* My Skills */}
      <section className="myskills"></section>

      {/* Recent Blogs */}
      <section className="recentblogs"></section>
    </>
  );
};

export default HomePage;
