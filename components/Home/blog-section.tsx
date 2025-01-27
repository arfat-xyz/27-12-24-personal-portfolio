import { imageConfig } from "@/lib/image-config";
import { BlogWithCategories } from "@/types/frontend-types";
import { formatDate } from "@/utils/helpers";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { FaCalendarDays } from "react-icons/fa6";
import Spinner from "../spinner";

const BlogSection = ({
  blogCategoryName,
  blogLists,
  isLoadingBlogs,
  setBlogCategoryName,
}: {
  isLoadingBlogs: boolean;
  blogLists: BlogWithCategories[];
  setBlogCategoryName: Dispatch<SetStateAction<string>>;
  blogCategoryName: string;
}) => {
  return (
    <section className="recentblogs">
      <div className="container">
        <div className="myskills_title">
          <h2>Recent Blogs</h2>
          <p>
            We put your ideas and thus your wishes in the form of a unique web
            project that inspires you and your customers.
          </p>
        </div>
        <div className="recent_blogs">
          {isLoadingBlogs ? (
            <Spinner />
          ) : blogLists?.length > 0 ? (
            blogLists.map((blog) => (
              <Link
                href={`/blogs/${blog.slug}`}
                className="re_blog"
                key={blog?.id}
              >
                <div className="re_blogimg">
                  <img
                    src={blog?.images[0] || imageConfig.noImgaePNG}
                    alt={blog?.title}
                    className=""
                  />
                  {blog?.categories.length ? (
                    <span>{blog.categories[0]?.name}</span>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="re_bloginfo">
                  <div className="re_topdate flex gap-1">
                    <div className="res_date flex gap-1">
                      <FaCalendarDays />
                      <span>{formatDate(new Date(blog.createdAt))}</span>
                    </div>
                  </div>
                  <h2>{blog.title}</h2>
                </div>
              </Link>
            ))
          ) : (
            <h1>No blogs found</h1>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
