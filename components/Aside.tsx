import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsPostcard } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { MdOutlineWorkOutline } from "react-icons/md";
import { RiShoppingCart2Line } from "react-icons/ri";
import { GrGallery } from "react-icons/gr";
import { TiContacts } from "react-icons/ti";
import { useState, useEffect } from "react";
export default function Aside({
  asideOpen,
  handleAsideOpen,
}: {
  asideOpen: boolean;
  handleAsideOpen: () => void;
}) {
  const pathname = usePathname();
  const [clicked, setClicked] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>("/");
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
          <Link href={`/`}>
            <li className="navactive">
              <IoHome />
              <span>Dashboard</span>
            </li>
          </Link>

          {/* Blogs menu */}
          <li
            className={
              activeLink === "/blogs"
                ? "navActive flex-col flex-left"
                : "navactive flex-col flex-left"
            }
            onClick={() => handleLinkClick("/blogs")}
          >
            <div className="flex gap-1">
              <BsPostcard />
              <span>Blogs</span>
            </div>
            {activeLink === "/blogs" ? (
              <>
                <ul>
                  <Link href={`/blogs`}>
                    <li>All Blogs</li>
                  </Link>
                  <Link href={`/blogs/draft`}>
                    <li>Draft Blogs</li>
                  </Link>
                  <Link href={`/blogs/addblog`}>
                    <li>Add Blog</li>
                  </Link>
                  <Link href={`/blogs/category`}>
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
              activeLink === "/projects"
                ? "navActive flex-col flex-left"
                : "navactive flex-col flex-left"
            }
            onClick={() => handleLinkClick("/projects")}
          >
            <div className="flex gap-1">
              <MdOutlineWorkOutline />
              <span>Projects</span>
            </div>
            {activeLink === "/projects" ? (
              <>
                <ul>
                  <Link href={`/projects`}>
                    <li>All Projects</li>
                  </Link>
                  <Link href={`/projects/draftprojects`}>
                    <li>Draft Projects</li>
                  </Link>
                  <Link href={`/addproject`}>
                    <li>Add Projects</li>
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
                ? "navActive flex-col flex-left"
                : "navactive flex-col flex-left"
            }
            onClick={() => handleLinkClick("/shop")}
          >
            <div className="flex gap-1">
              <RiShoppingCart2Line />
              <span>Shop</span>
            </div>
            {activeLink === "/shop" ? (
              <>
                <ul>
                  <Link href={`/shops`}>
                    <li>All Products</li>
                  </Link>
                  <Link href={`/shops/draftshop`}>
                    <li>Draft Products</li>
                  </Link>
                  <Link href={`/shops/addproduct`}>
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
              activeLink === "/gallery"
                ? "navActive flex-col flex-left"
                : "navactive flex-col flex-left"
            }
            onClick={() => handleLinkClick("/gallery")}
          >
            <div className="flex gap-1">
              <GrGallery />
              <span>Gallery</span>
            </div>
            {activeLink === "/gallery" ? (
              <>
                <ul>
                  <Link href={`/gallery`}>
                    <li>All Photos</li>
                  </Link>

                  <Link href={`/gallery/addphoto`}>
                    <li>Add Photo</li>
                  </Link>
                </ul>
              </>
            ) : (
              <></>
            )}
          </li>
          <Link href={`/contacts`}>
            <li
              className={activeLink === `/contacts` ? "navactive" : ""}
              onClick={() => handleLinkClick("/contacts")}
            >
              <TiContacts />
              <span>Contacts</span>
            </li>
          </Link>
        </ul>
        <button className="logoutbtn">Logout</button>
      </aside>
    </>
  );
}
