"use client";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { IoMdClose } from "react-icons/io";

const AnyModalComponent = ({
  buttontext,
  insideComponent,
  modalHeading,
  isOpen,
  setIsOpen,
}: {
  buttontext: string | ReactNode;
  insideComponent: ReactNode;
  modalHeading: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <button
        type="button"
        className="h-10 rounded-md px-4 text-sm font-medium text-black"
        onClick={() => setIsOpen(true)}
      >
        {buttontext}
      </button>
      {isOpen ? (
        <div className="absolute left-0 top-0 h-screen w-screen bg-white shadow-lg">
          <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-300">
            <div className="max-w-[460px] rounded-lg bg-white p-3">
              <div className="mb-2 flex items-center justify-between px-3">
                <h2 className="text-sm font-medium text-gray-900">
                  {modalHeading}
                </h2>
                <IoMdClose
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer"
                />
              </div>
              {insideComponent}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default AnyModalComponent;
