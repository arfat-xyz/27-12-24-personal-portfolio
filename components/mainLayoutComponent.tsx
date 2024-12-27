"use client";
import React, { ReactNode, useState } from "react";
import ParentComponent from "./ParentComponent";

const MainLayoutComponent = ({ children }: { children: ReactNode }) => {
  const [asideOpen, setAsideOpen] = useState(true);
  const asideClickOpen = () => {
    setAsideOpen((prev) => !prev);
  };
  return (
    <>
      {" "}
      <ParentComponent appOpen={asideOpen} appAsideOpen={asideClickOpen} />
      <main>
        <div
          className={
            asideOpen
              ? `container max-w-[calc(100%-200px)]`
              : `container active`
          }
        >
          {/* <Component {...pageProps} /> */}
          {children}
        </div>
      </main>
    </>
  );
};

export default MainLayoutComponent;
