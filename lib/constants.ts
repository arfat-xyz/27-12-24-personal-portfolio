import { FaGithub, FaTwitter } from "react-icons/fa";
import { GrLinkedinOption } from "react-icons/gr";
import { LiaBasketballBallSolid } from "react-icons/lia";
import { IconType } from "react-icons/lib";

export const mainPageNavList = [
  {
    href: "/",
    name: "Home",
  },
  {
    href: "/services",
    name: "Services",
  },
  {
    href: "/projects",
    name: "Projects",
  },
  {
    href: "/gallery",
    name: "Gallery",
  },
  {
    href: "/blogs",
    name: "Blogs",
  },
  {
    href: "/shop",
    name: "Shop",
  },
  {
    href: "/contact",
    name: "Contact",
  },
];

export const socialLinks: { href: string; iconName: IconType }[] = [
  {
    href: "/",
    iconName: FaTwitter,
  },
  {
    href: "/",
    iconName: LiaBasketballBallSolid,
  },
  {
    href: "/",
    iconName: GrLinkedinOption,
  },
  {
    href: "/",
    iconName: FaGithub,
  },
];

export const mainPageheroSectionFooterExperties = [
  {
    count: `7+`,
    desc1: "Year of",
    desc2: "Experience",
  },
  {
    count: `20+`,
    desc1: "Projects",
    desc2: "Completed",
  },
  {
    count: "12",
    desc1: "OpenSource",
    desc2: "Library",
  },
  {
    count: "25+",
    desc1: "Happy",
    desc2: "Customers",
  },
];
export const mainPageServicesSection = [
  {
    title: "Web Development",
    description:
      "I am very good in web development offering services, I offer reliable web development services to generate the most remarkable results which your business need.",
  },
  {
    title: "Mobile Development",
    description:
      "Experienced mobile developer offering innovative solutions. Proficient in creating high-performance, user-centric mobile apps. Expertise in iOS, Android, and cross-platform development.",
  },
  {
    title: "Digital Marketing(SEO)",
    description:
      "My digital marketing services will take your business to the next level, we offer remarkable digital marketing strategies that drives traffic to your website, your business, and improves your brand awareness to potential customers.",
  },
  {
    title: "Content Creator",
    description:
      "Passionate photographer and videographer capturing moments with creativity. Transforming visions into visual stories. Expert in visual storytelling, skilled in both photography and videography to deliver captivating content.",
  },
];

export const mainPageProjectSectionButtons = [
  {
    name: "All",
  },
  {
    name: "Website",
  },
  {
    name: "Apps",
  },
  {
    name: "Digital",
  },
];
