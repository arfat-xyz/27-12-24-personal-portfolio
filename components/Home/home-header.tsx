"use client";
import { mainPageNavList } from "@/lib/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { IoMoonSharp } from "react-icons/io5";
import { LuSun } from "react-icons/lu";

const HomeHeader = () => {
  // navigation
  const router = useRouter();
  const pathname = usePathname();

  // dark mode off on
  const [darkMode, setDarkMode] = useState(false);
  const [animateToggleButton, setAnimateToggleButton] = useState(false);

  useEffect(() => {
    // checking local storage for dark mode preference on initial load
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    // apply dark mode styles when dark mode state changes
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    setAnimateToggleButton(true);
    setTimeout(() => setAnimateToggleButton(false), 300); // Animation duration
  };

  // nav list
  // const [clicked, setClicked] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  // const handleLinkClicked = (link: string) => {
  //   setActiveLink(link);
  //   setClicked(false);
  // };
  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  //mobile navbar
  const [mobile, setMobile] = useState(false);
  // open
  const handleMobileOpen = () => {
    setMobile(!mobile);
  };
  const handleMobileClose = () => {
    setMobile(false);
  };
  return (
    <header className="home-header">
      <nav className="flex-sb container flex">
        <div className="logo flex gap-2">
          <Link href={"/"}>
            <img
              src={darkMode ? "/img/white.png" : "/img/logo.png"}
              alt="logo"
            />
          </Link>
          <h2 className="">arfatrahman08@gmail.com</h2>
        </div>
        <div className="navlist flex gap-2">
          <ul className="flex gap-2">
            {mainPageNavList.map(({ href, name }, i) => (
              <li key={i} className="li">
                <Link
                  href={href}
                  className={activeLink === href ? "active" : ""}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          <div className={`darkmodetoggle`} onClick={handleToggleDarkMode}>
            {darkMode ? <IoMoonSharp /> : <LuSun />}
          </div>
          <button>
            <Link href={"/contact"}>hire Me!</Link>
          </button>
          <div className="mobiletogglesvg" onClick={handleMobileOpen}>
            <HiMiniBars3BottomRight />
          </div>
        </div>
        <div className={mobile ? "mobilenavlist active" : "mobilenavlist"}>
          <span
            className={mobile ? "active" : ""}
            onClick={handleMobileClose}
          ></span>
          <div className="mobilelogo">
            <img src="/img/white.png" alt="logo" />
            <h2>vbmcoder</h2>
          </div>
          <ul className="flex-left mt-3 flex flex-col gap-1">
            {mainPageNavList.map(({ href, name }, i) => (
              <li key={i} className="li">
                <Link
                  href={href}
                  className={activeLink === href ? "active" : ""}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="">Copyright &copy; 2025 | arfat.xyz</p>
        </div>
      </nav>
    </header>
  );
};

export default HomeHeader;
