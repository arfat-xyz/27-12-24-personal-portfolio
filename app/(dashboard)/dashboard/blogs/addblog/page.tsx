import Blog from "@/components/Blog";
import BreadcrumbWithAdminPanel from "@/components/breadcrumb-with-admin-panel";
import { db } from "@/lib/db";
import { SiBloglovin } from "react-icons/si";
export default async function Addblog() {
  const category = await db.blogCategory.findMany({});
  return (
    <>
      <div className="addblogspage">
        <BreadcrumbWithAdminPanel
          h2Title="Add "
          spanTitleOne={`Blogs`}
          spanTitleTwo="Addblog"
        />
        <div className="blogsadd">
          <Blog category={category} />
        </div>
      </div>
    </>
  );
}
