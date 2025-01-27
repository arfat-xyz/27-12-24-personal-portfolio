import { mainPageFooterMenu } from "@/lib/constants";
import { imageConfig } from "@/lib/image-config";
import Link from "next/link";
import SocialLinksComponent from "./social-links-component";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footersec flex-center flex flex-col gap-2">
        <div className="logo">
          <img src={imageConfig.logoPNG} alt="Logo" className="" />
        </div>
        <ul className="ul flex gap-2">
          {mainPageFooterMenu.map(({ href, name }, i) => (
            <li key={i}>
              <Link href={href}>{name}</Link>
            </li>
          ))}
        </ul>
        <SocialLinksComponent />
        <div className="copyrights">
          &copy; 2025 all Rights Reserved By{" "}
          <Link href={`https://www.arfat.app/`}>Arfat.xyz</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
