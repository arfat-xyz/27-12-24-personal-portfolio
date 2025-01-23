import { logout } from "@/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsPostcard } from "react-icons/bs";
import { FaGear } from "react-icons/fa6";
import { GrGallery } from "react-icons/gr";
import { IoHome } from "react-icons/io5";
import { MdOutlineWorkOutline } from "react-icons/md";
import { RiShoppingCart2Line } from "react-icons/ri";
import { TiContacts } from "react-icons/ti";
export default function Aside({
  asideOpen,
  handleAsideOpen,
}: {
  asideOpen: boolean;
  handleAsideOpen: () => void;
}) {
  const pathname = usePathname();
  const [clicked, setClicked] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>("/dashboard");
  const handleClick = () => {
    setClicked(!clicked);
  };
  const handleLinkClick = (link: string) => {
    setActiveLink((prevActive) => (prevActive === link ? null : link));
    setClicked(false);
  };

  useEffect(() => {
    // update active link state when the page is reloaded
    setActiveLink(pathname);
  }, [pathname]);

  return (
    <>
      <aside className={asideOpen ? "asideleft active" : "asideleft"}>
        <ul>
          <Link href={`/dashboard`}>
            <li className="navactive">
              <IoHome />
              <span>Dashboard</span>
            </li>
          </Link>

          {/* Blogs menu */}
          <li
            className={
              activeLink === "/dashboard/blogs"
                ? "navActive flex-left flex-col"
                : "navactive flex-left flex-col"
            }
            onClick={() => handleLinkClick("/dashboard/blogs")}
          >
            <div className="flex gap-1">
              <BsPostcard />
              <span>Blogs</span>
            </div>
            {activeLink === "/dashboard/blogs" ? (
              <>
                <ul>
                  <Link href={`/dashboard/blogs`}>
                    <li>All Blogs</li>
                  </Link>
                  <Link href={`/dashboard/blogs/draft`}>
                    <li>Draft Blogs</li>
                  </Link>
                  <Link href={`/dashboard/blogs/addblog`}>
                    <li>Add Blog</li>
                  </Link>
                  <Link href={`/dashboard/blogs/category`}>
                    <li>All Category</li>
                  </Link>
                </ul>
              </>
            ) : (
              <></>
            )}
          </li>
          {/* Projects menu */}
          <li
            className={
              activeLink === "/dashboard/projects"
                ? "navActive flex-left flex-col"
                : "navactive flex-left flex-col"
            }
            onClick={() => handleLinkClick("/dashboard/projects")}
          >
            <div className="flex gap-1">
              <MdOutlineWorkOutline />
              <span>Projects</span>
            </div>
            {activeLink === "/dashboard/projects" ? (
              <>
                <ul>
                  <Link href={`/dashboard/projects`}>
                    <li>All Projects</li>
                  </Link>
                  <Link href={`/dashboard/projects/draft`}>
                    <li>Draft Projects</li>
                  </Link>
                  <Link href={`/dashboard/projects/add`}>
                    <li>Add Projects</li>
                  </Link>{" "}
                  <Link href={`/dashboard/projects/category`}>
                    <li>All Category</li>
                  </Link>
                </ul>
              </>
            ) : (
              <></>
            )}
          </li>
          {/* Shop menu */}
          <li
            className={
              activeLink === "/shop"
                ? "navActive flex-left flex-col"
                : "navactive flex-left flex-col"
            }
            onClick={() => handleLinkClick("/dashboard/shop")}
          >
            <div className="flex gap-1">
              <RiShoppingCart2Line />
              <span>Shop</span>
            </div>
            {activeLink === "/dashboard/shop" ? (
              <>
                <ul>
                  <Link href={`/dashboard/shops`}>
                    <li>All Products</li>
                  </Link>
                  <Link href={`/dashboard/shops/draftshop`}>
                    <li>Draft Products</li>
                  </Link>
                  <Link href={`/dashboard/shops/addproduct`}>
                    <li>Add Product</li>
                  </Link>
                </ul>
              </>
            ) : (
              <></>
            )}
          </li>
          {/* Gallery menu */}
          <li
            className={
              activeLink === "/dashboard/gallery"
                ? "navActive flex-left flex-col"
                : "navactive flex-left flex-col"
            }
            onClick={() => handleLinkClick("/dashboard/gallery")}
          >
            <div className="flex gap-1">
              <GrGallery />
              <span>Gallery</span>
            </div>
            {activeLink === "/dashboard/gallery" ? (
              <>
                <ul>
                  <Link href={`/dashboard/gallery`}>
                    <li>All Photos</li>
                  </Link>

                  <Link href={`/dashboard/gallery/add`}>
                    <li>Add Photo</li>
                  </Link>
                </ul>
              </>
            ) : (
              <></>
            )}
          </li>
          <Link href={`/dashboard/contacts`}>
            <li
              className={
                activeLink === `/dashboard/contacts` ? "navactive" : ""
              }
              onClick={() => handleLinkClick("/dashboard/contacts")}
            >
              <TiContacts />
              <span>Contacts</span>
            </li>
          </Link>
          <Link href={`/dashboard/settings`}>
            <li
              className={
                activeLink === `/dashboard/settings` ? "navactive" : ""
              }
              onClick={() => handleLinkClick("/dashboard/settings")}
            >
              <FaGear />
              <span>Settings</span>
            </li>
          </Link>
        </ul>
        <button className="logoutbtn" onClick={() => logout()}>
          Logout
        </button>
      </aside>
    </>
  );
}
