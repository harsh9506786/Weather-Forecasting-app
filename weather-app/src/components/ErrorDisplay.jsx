import React from "react";
import "./ErrorDisplay.css";
import confusedCloud from "../assets/confusedCloud3.png";

export default function ErrorDisplay({ message }) {
  return (
    <div className="error-container">
      <p className="error">{message}</p>
      <img src={confusedCloud} alt="Confused Cloud" className="error-image" />
    </div>
  );
}
