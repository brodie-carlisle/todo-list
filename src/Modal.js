import React, { Component } from "react";
import "./styling/Modal.css"

const Modal1 = ({ handleClose, show, children }) => {
  
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName} >
      <section className="modal-main">
        <div>
        {children}
        </div>
        <button type="submit" onClick={handleClose} className="button">cancel</button>
      </section>
    </div>
  );
};

export default Modal1;
