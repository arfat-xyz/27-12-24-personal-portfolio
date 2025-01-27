import { socialLinks } from "@/lib/constants";
import Link from "next/link";

const SocialLinksComponent = () => {
  return (
    <ul className="hero_social">
      {socialLinks.map(({ href, iconName: Icon }, i) => (
        <li key={i}>
          <Link href={href} target="_blank" className="">
            <Icon />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SocialLinksComponent;
