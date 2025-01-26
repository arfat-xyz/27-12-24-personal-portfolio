import {
  mainPageheroSectionFooterExperties,
  socialLinks,
} from "@/lib/constants";
import { imageConfig } from "@/lib/image-config";
import Link from "next/link";
import { BiDownload } from "react-icons/bi";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="intro_text">
        <svg viewBox="0 0 1320 300">
          <text x="50%" y="50%" textAnchor="middle" className="animate-stroke">
            HI
          </text>
        </svg>
      </div>
      <div className="container">
        <div className="w-100 flex">
          {/* Hero left section  */}
          <div className="heroinfoleft">
            <div className="hero_sb_title">I am Arfatur Rahman</div>
            <h1 className="hero_title">
              Web Developer +<br />
              <span className="typed-text">Ux Designer</span>
            </h1>
            <div className="hero_img_box heroimgbox">
              <img src={imageConfig.mePNG} alt="My image" />
            </div>
            <div className="lead">
              I break down complex user experience problems to create integritiy
              focussed solutions that connect billions of people
            </div>
            <div className="hero_btn_box">
              <Link
                href={"/"}
                download={imageConfig.resumePDF}
                className="download_cv"
              >
                Download CV <BiDownload />
              </Link>
              <ul className="hero_social">
                {socialLinks.map(({ href, iconName: Icon }, i) => (
                  <li key={i}>
                    <Link href={href} className="">
                      <Icon />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* hero right section  */}
          <div className="heroimageright">
            <div className="hero_img_box">
              <img src={imageConfig.mePNG} alt="" />
            </div>
          </div>
        </div>
        <div className="funfect_area flex-sb flex">
          {mainPageheroSectionFooterExperties.map(
            ({ count, desc1, desc2 }, i) => (
              <div key={i} className="funfect_item">
                <h3>{count}</h3>
                <h4>
                  {desc1}
                  <br />
                  {desc2}
                </h4>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
