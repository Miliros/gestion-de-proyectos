import React from "react";
import { Modal, Button } from "react-bootstrap"; // Usamos React-Bootstrap para mantener el diseño.

const DeleteModal = ({
  show,
  onHide,
  onConfirm,
  title = "Eliminar",
  description = "¿Estás seguro de que deseas eliminar este elemento?",
  styles, // Obtenemos los estilos personalizados.
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={true}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{description}</p>
        <div className="d-flex justify-content-center mt-4">
          <Button
            className={`${styles.customButtonDeleteConfirm2} btn btn-sm rounded-pill`}
            onClick={onHide}
          >
            Cancelar
          </Button>
          <Button
            className={`${styles.customButtonDeleteConfirm} btn btn-sm rounded-pill`}
            onClick={onConfirm}
          >
            Eliminar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
