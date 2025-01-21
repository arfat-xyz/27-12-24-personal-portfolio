import BreadcrumbWithAdminPanel from "@/components/breadcrumb-with-admin-panel";
import Gallery from "@/components/gallery";
export default async function Addblog() {
  return (
    <>
      <div className="addblogspage">
        <BreadcrumbWithAdminPanel
          h2Title="Add "
          spanTitleOne={`Blogs`}
          spanTitleTwo="Addblog"
        />
        <div className="blogsadd">
          <Gallery />
        </div>
      </div>
    </>
  );
}
