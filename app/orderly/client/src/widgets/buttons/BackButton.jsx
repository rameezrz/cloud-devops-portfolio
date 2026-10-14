import React from "react";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="px-4 py-2 bg-gray-100 font-bold text-black rounded-md shadow hover:bg-gray-600 hover:text-white transition"
    >
      Go Back
    </button>
  );
};
