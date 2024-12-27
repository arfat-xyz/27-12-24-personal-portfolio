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
        className="h-10 px-4 font-medium text-sm rounded-md text-black"
        onClick={() => setIsOpen(true)}
      >
        {buttontext}
      </button>
      {isOpen ? (
        <div className="absolute top-0 left-0 w-screen h-screen bg-white shadow-lg">
          <div className="fixed top-0 left-0 w-full h-full bg-gray-300 flex justify-center items-center">
            <div className="max-w-[460px] bg-white  p-3 rounded-lg">
              <div className="flex justify-between items-center px-3 mb-2">
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
