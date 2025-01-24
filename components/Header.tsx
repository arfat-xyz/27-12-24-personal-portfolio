import { imageConfig } from "@/lib/image-config";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BiExitFullscreen } from "react-icons/bi";
import { GoScreenFull } from "react-icons/go";
import { RiBarChartHorizontalLine } from "react-icons/ri";
export default function Header({
  handleAsideOpen,
}: {
  handleAsideOpen: () => void;
}) {
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
  const { data } = useSession();
  console.log(data);
  return (
    <>
      <header className="header flex-sb flex">
        <div className="logo flex gap-2">
          <h1>ADMIN</h1>
          <div className="headerham flex-center flex" onClick={handleAsideOpen}>
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
