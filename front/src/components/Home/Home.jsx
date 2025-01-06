import React from "react";
import { useSelector } from "react-redux";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Title from "../Title/Title";
import styles from "./Home.module.css";
import { GoProjectRoadmap } from "react-icons/go";
import { GoTasklist } from "react-icons/go";
import { FiUsers } from "react-icons/fi";

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  const cards = [
    {
      title: "Proyectos",
      text: "Administra, gestiona y visualiza todos tus proyectos.",
      path: user?.rol === "admin" ? "/projects" : "/userTareas",
      icon: <GoProjectRoadmap size={26} />, // Ícono para Proyectos
    },
    {
      title: "Tareas",
      text: "Organiza, asigna y realiza un seguimiento de tus tareas.",
      path: "/tasks",
      icon: <GoTasklist size={26} />, // Ícono para Proyectos
    },
    {
      title: "Usuarios",
      text: "Gestiona los usuarios y permisos de tu plataforma.",
      path: "/users",
      icon: <FiUsers size={26} />, // Ícono para Proyectos
    },
  ];

  return (
    <div className={styles.cntnHome}>
      <div className={styles.cntnCards}>
        <Title
          userName={user?.nombre}
          subText="Organiza y gestiona tu trabajo de manera eficiente."
        />
        <Row className={styles.cardsRow}>
          {cards.map((card, index) => (
            <Col key={index} md={5} className="mb-5 me-4">
              <Link to={card.path} className={styles.cardLink}>
                <Card className={styles.customCard}>
                  <Card.Body className={styles.cardBody}>
                    <div className={styles.icon}>{card.icon}</div>

                    <Card.Title className={styles.cardTitle}>
                      {card.title}
                    </Card.Title>
                    <Card.Text className={styles.cardText}>
                      {card.text}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Home;
