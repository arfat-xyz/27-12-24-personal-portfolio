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
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center backdrop-blur-sm">
          <div className="w-96 rounded-lg bg-white p-3 shadow-md">
            <h4 className="text-2xl font-medium">{modalHeading}</h4>
            <div className="mt-2 flex w-full justify-end gap-2">
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
