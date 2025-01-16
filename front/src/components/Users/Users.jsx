import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser } from "../../redux/slices/userSlice";
import { Pagination } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { MdOutlineDelete } from "react-icons/md";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import styles from "./Users.module.css";
import { FiUsers } from "react-icons/fi";

import Title from "../Title/Title";
import DeleteModal from "../Delete/DeleteModal";

const User = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const currentPage = useSelector((state) => state.users.currentPage);
  const totalPages = useSelector((state) => state.users.totalPages);

  const loading = useSelector((state) => state.users.loading);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, search }));
  }, [dispatch, currentPage]);

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
  // Pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(fetchUsers({ page }));
      // Asegúrate de actualizar el estado local de la página
    }
  };

  return (
    <div className={styles.cntnUser}>
      <Title text=" usuarios" subText="Usuarios registrados" />
      <div className={`${styles.cntnTable} table-responsive`}>
        <div className={styles.titleAndButton}>
          <FiUsers size={24} color="green" />
          <div className={styles.inputs}>
            <i className="fa fa-search"></i>
            <input
              type="text"
              placeholder="Buscar proyecto..."
              value={search}
              onChange={(e) => {
                e.preventDefault();
                const searchTerm = e.target.value.trim();
                setSearch(searchTerm);

                if (searchTerm === "") {
                  dispatch(fetchUsers({ page: 1 })); // Cargar todos si no hay búsqueda
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const searchTerm = search.trim();
                  if (searchTerm) {
                    dispatch(fetchUsers({ page: 1, search: searchTerm }));
                  } else {
                    dispatch(fetchUsers({ page: 1 }));
                  }
                }
              }}
            />
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
            {users?.length > 0 ? (
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
        <div className={styles.paginado}>
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.buttonPagination}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={styles.buttonPagination}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.buttonPagination}
            />
          </Pagination>
        </div>
      </div>

      <DeleteModal
        show={showDeleteModal}
        onHide={handleCloseDelete}
        onConfirm={handleDeleteUser}
        title="Eliminar Usuario"
        description="¿Estás seguro de que deseas eliminar este Usuario?"
        styles={styles}
      />
    </div>
  );
};

export default User;
