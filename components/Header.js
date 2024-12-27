import { RiBarChartHorizontalLine } from "react-icons/ri";
import { BiExitFullscreen } from "react-icons/bi";
import { useState } from "react";
import { GoScreenFull } from "react-icons/go";
import { imageConfig } from "@/lib/image-config";
export default function Header({ handleAsideOpen }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullScreen(false));
    }
  };
  return (
    <>
      <header className="header flex flex-sb">
        <div className="logo flex gap-2">
          <h1>ADMIN</h1>
          <div className="headerham flex flex-center" onClick={handleAsideOpen}>
            <RiBarChartHorizontalLine />
          </div>
        </div>
        <div className="rightnav flex gap-2">
          <div className="" onClick={toggleFullScreen}>
            {isFullScreen ? <BiExitFullscreen /> : <GoScreenFull />}
          </div>
          <div className="notification">
            <img
              src={imageConfig.notificationPng}
              alt="Admin notification image"
            />
          </div>
          <div className="profilenav">
            <img src={imageConfig.userPng} alt="Admin user image" />
          </div>
        </div>
      </header>
    </>
  );
}
