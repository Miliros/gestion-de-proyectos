// components/CustomModal.jsx
import React from "react";
import { Modal } from "react-bootstrap";

const CustomModal = ({
  show,
  onHide,
  title,
  children,
  classNameHeader,
  classNameBody,
  backdrop = "static",
  keyboard = true,
  centered = true,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop={backdrop}
      keyboard={keyboard}
      centered={centered}
    >
      <Modal.Header closeButton className={classNameHeader}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={classNameBody}>{children}</Modal.Body>
    </Modal>
  );
};

export default CustomModal;
