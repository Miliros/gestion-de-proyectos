import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser } from "../../redux/slices/userSlice";
import { Modal, Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { MdOutlineDelete } from "react-icons/md";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import styles from "./Users.module.css";
import Title from "../Title/Title";

const User = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  console.log(users, "a");
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleShowDeleteModal = (id) => {
    setUserToDelete(id); // Configura el usuario a eliminar
    setShowDeleteModal(true); // Abre el modal
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) {
      return; // Si no se ha asignado correctamente el ID, no hacer nada
    }

    dispatch(deleteUser(userToDelete))
      .then(() => {
        alert("Usuario eliminado correctamente");
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.error("Error eliminando usuario:", error);
        alert("Error al eliminar el usuario");
      });
  };

  return (
    <div className={styles.cntnUser}>
      <Title text="usuarios" />
      <div className={`${styles.cntnTable} table-responsive`}>
        <div className={styles.titleAndButton}>
          <p className={styles.title}>Usuarios registrados</p>

          <div className={styles.inputs}>
            <i className="fa fa-search"></i>
            <input type="text" placeholder="Buscar usuario..." />
          </div>
        </div>
        <Table bordered hover>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Nombre</th>
              <th className={styles.tableHeader}>Email</th>
              <th className={styles.tableHeader}>Rol</th>
              <th className={styles.tableHeader}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className={styles.td}>{user.nombre}</td>
                  <td className={styles.td}>{user.email}</td>
                  <td className={styles.td}>{user.rol}</td>
                  <td className={styles.td}>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-${user.id}`}>Eliminar</Tooltip>
                      }
                    >
                      <span>
                        <MdOutlineDelete
                          onClick={() => handleShowDeleteModal(user.id)}
                          size={16}
                          color="red"
                          style={{ cursor: "pointer" }}
                        />
                      </span>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No hay usuarios disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal
        show={showDeleteModal}
        onHide={handleCloseDelete}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas eliminar este usuario?
          <Button
            className={`${styles.customButtonDeleteConfirm} btn btn-sm rounded-pill`}
            onClick={handleDeleteUser}
          >
            Eliminar
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default User;
