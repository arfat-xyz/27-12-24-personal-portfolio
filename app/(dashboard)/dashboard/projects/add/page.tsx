import BreadcrumbWithAdminPanel from "@/components/breadcrumb-with-admin-panel";
import Project from "@/components/project";
import { db } from "@/lib/db";
export default async function Addblog() {
  const category = await db.projectCategory.findMany({});
  return (
    <>
      <div className="addblogspage">
        <BreadcrumbWithAdminPanel
          h2Title="Add "
          spanTitleOne={`Blogs`}
          spanTitleTwo="Addblog"
        />
        <div className="blogsadd">
          <Project category={category} />
        </div>
      </div>
    </>
  );
}
