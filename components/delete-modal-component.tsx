import React, { Dispatch, ReactNode, SetStateAction } from "react";

const DeleteModalComponent = ({
  buttontext,
  isOpen,
  modalHeading = "Delete cannot be undone",
  setIsOpen,
  onClickFunc,
}: {
  buttontext: string | ReactNode;
  onClickFunc: () => void;
  modalHeading: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        {buttontext}
      </button>
      {isOpen ? (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm flex justify-center items-center">
          <div className="w-96 bg-white shadow-md rounded-lg  p-3 ">
            <h4 className="text-2xl font-medium">{modalHeading}</h4>
            <div className="w-full flex justify-end gap-2 mt-2">
              <button className="" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button onClick={onClickFunc}>Delete</button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default DeleteModalComponent;
