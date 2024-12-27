import Blog from "@/components/Blog";
import BreadcrumbWithAdminPanel from "@/components/breadcrumb-with-admin-panel";
import { SiBloglovin } from "react-icons/si";
export default function Addblog() {
  return (
    <>
      <div className="addblogspage">
        {/* <div className="titledashboard flex flex-sb">
          <div className="">
            <h2>
              Add
              <span>Blog</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <SiBloglovin />
            <span>/</span>
            <span>Addblog</span>
          </div>
        </div> */}
        <BreadcrumbWithAdminPanel
          h2Title="Add "
          spanTitleOne={`Blogs`}
          spanTitleTwo="Addblog"
        />
        <div className="blogsadd">
          <Blog />
        </div>
      </div>
    </>
  );
}
