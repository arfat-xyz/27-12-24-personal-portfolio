"use client";
import { SiBloglovin } from "react-icons/si";

const BreadcrumbWithAdminPanel = ({
  h2Title,
  spanTitleOne,
  spanTitleTwo,
}: {
  h2Title: string;
  spanTitleOne: string;
  spanTitleTwo: string;
}) => {
  return (
    <div className="titledashboard flex-sb flex">
      <div className="">
        <h2>
          {h2Title} <span>{spanTitleOne}</span>
        </h2>
        <h3>ADMIN PANEL</h3>
      </div>
      <div className="breadcrumb">
        <SiBloglovin />
        <span>/</span>
        <span>{spanTitleTwo}</span>
      </div>
    </div>
  );
};

export default BreadcrumbWithAdminPanel;
