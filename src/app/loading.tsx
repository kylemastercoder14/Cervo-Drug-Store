import React from "react";
import { BarLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <BarLoader loading color="#437634" />
    </div>
  );
};

export default Loading;
