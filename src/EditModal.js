import React, { Component } from "react";
// import "./styling/Modal.css"


const EditModal = ({ handleEditClose, showEditM, children }) =>{
  const showHideClassName = showEditM ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName} >
      <section className="modal-main">
        <div>
        {children}
        </div>
        <button type="submit" onClick={handleEditClose} className="button">cancel</button>
      </section>
    </div>
  );
};


export default EditModal