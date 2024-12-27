"use client";
import React from "react";

const FourCardComponent = ({
  heading,
  count,
}: {
  heading: string;
  count: number;
}) => {
  return (
    <div className="four_card">
      <h2>{heading}</h2>
      <span>{count}</span>
    </div>
  );
};

export default FourCardComponent;
