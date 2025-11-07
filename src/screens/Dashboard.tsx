import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Table, Modal } from "react-bootstrap";
import { Pencil, Eye, EyeSlash } from "react-bootstrap-icons";

import { useUserStorage } from "../utils/Storagelocal";
import BasicAlerts from "../components/Alerts";
import { AddPassword, ListePassword, DeletePassword, ModifyPassword, type Password } from "../utils/Password";
import { logout } from "../utils/Auth";
import GeneratePassword from "../utils/Generatepassword";

interface PasswordItem extends Password {
  _id?: string;
}

const Dashboard: React.FC = () => {
  const user = useUserStorage();

  const [passwords, setPasswords] = useState<PasswordItem[]>([]);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalModify, setShowModalModify] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<PasswordItem | null>(null);
  const [newPassword, setNewPassword] = useState<Password>({
    site: "",
    email: "",
    password: "",
    description: "",
  });
  const [showPasswordIds, setShowPasswordIds] = useState<Set<string>>(new Set());

  // 🔹 Charger les mots de passe
  useEffect(() => {
    const fetchPasswords = async () => {
      if (!user?._id) return;
      const res = await ListePassword(user._id);
      if (res.success) {
        setPasswords(res.data || []);
      } else {
        setAlert({ type: "error", message: "Erreur lors du chargement des mots de passe" });
      }
    };
    fetchPasswords();
  }, [user]);

  // 🔹 Déconnexion si pas d'utilisateur
  if (!user) {
    return (
      <Container
        fluid
        className="text-center d-flex flex-column justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <h2>Bienvenue sur Password Manager 🔐</h2>
        <p>Connectez-vous pour gérer vos mots de passe en toute sécurité.</p>
        <Button variant="primary" href="/login">
          Se connecter
        </Button>
      </Container>
    );
  }

  // 🔹 Ajouter un mot de passe
  const handleAddPassword = async () => {
    if (!newPassword.site || !newPassword.email || !newPassword.password) {
      setAlert({ type: "error", message: "Veuillez remplir tous les champs obligatoires" });
      return;
    }

    const res = await AddPassword(newPassword);
    if (res.success) {
      setPasswords([...passwords, res.data]);
      setAlert({ type: "success", message: "✅ Mot de passe ajouté !" });
      setShowModalAdd(false);
      setNewPassword({ site: "", email: "", password: "", description: "" });
    } else {
      setAlert({ type: "error", message: "❌ " + res.message });
    }
  };

  // 🔹 Supprimer un mot de passe
  const handleDeletePassword = async () => {
    if (!selectedPassword?._id) return;
    const res = await DeletePassword(selectedPassword._id);
    if (res.success) {
      setPasswords(passwords.filter((p) => p._id !== selectedPassword._id));
      setAlert({ type: "success", message: res.message });
      setShowModalDelete(false);
    } else {
      setAlert({ type: "error", message: res.message });
    }
  };

  // 🔹 Modifier un mot de passe
  const handleSaveModification = async () => {
    if (!selectedPassword?._id) return;

    const res = await ModifyPassword(selectedPassword._id, selectedPassword);
    if (res.success) {
      setPasswords(passwords.map((p) => (p._id === selectedPassword._id ? selectedPassword : p)));
      setAlert({ type: "success", message: "✅ Mot de passe modifié !" });
      setShowModalModify(false);
    } else {
      setAlert({ type: "error", message: res.message });
    }
  };

  // 🔹 Copier
  const handleCopy = (password: string) => {
    navigator.clipboard.writeText(password);
    setAlert({ type: "success", message: "Mot de passe copié !" });
  };

  // 🔹 Afficher / masquer
  const toggleShowPassword = (id?: string) => {
    if (!id) return;
    const newSet = new Set(showPasswordIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setShowPasswordIds(newSet);
  };

  // 🔹 Générer
  const generate = () => {
    const password = GeneratePassword();
    setNewPassword({ ...newPassword, password });
  };

  // ===============================================================

  return (
    <Container fluid className="py-4 text-light bg-dark min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bonjour, {user.firstName} 👋</h2>
        <Button size="sm" variant="outline-info" onClick={logout}>
          Se déconnecter
        </Button>
      </div>

      {alert && <BasicAlerts type={alert.type} message={alert.message} />}

      <Row>
        <Col>
          <Card className="shadow-sm bg-secondary text-light p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Mes mots de passe</h4>
              <Button variant="success" onClick={() => setShowModalAdd(true)}>
                ➕ Ajouter
              </Button>
            </div>

            <Table striped bordered hover variant="dark" responsive>
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Email</th>
                  <th>Mot de passe</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {passwords.length > 0 ? (
                  passwords.map((item) => (
                    <tr key={item._id || item.email}>
                      <td>{item.site}</td>
                      <td>{item.email}</td>
                      <td>
                        {showPasswordIds.has(item._id || "") ? item.password : "••••••••"}
                        <Button variant="link" size="sm" onClick={() => toggleShowPassword(item._id)}>
                          {showPasswordIds.has(item._id || "") ? <EyeSlash /> : <Eye />}
                        </Button>
                      </td>
                      <td>{item.description || "-"}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-warning"
                          className="me-2"
                          onClick={() => {
                            setSelectedPassword(item);
                            setShowModalModify(true);
                          }}
                        >
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => {
                            setSelectedPassword(item);
                            setShowModalDelete(true);
                          }}
                        >
                          Supprimer
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-info"
                          onClick={() => handleCopy(item.password)}
                        >
                          Copier
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      Aucun mot de passe enregistré.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      {/* Modal Ajout */}
      <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Site</Form.Label>
              <Form.Control
                value={newPassword.site}
                onChange={(e) => setNewPassword({ ...newPassword, site: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={newPassword.email}
                onChange={(e) => setNewPassword({ ...newPassword, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                value={newPassword.password}
                onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={newPassword.description}
                onChange={(e) => setNewPassword({ ...newPassword, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalAdd(false)}>
            Annuler
          </Button>
          <Button variant="info" onClick={generate}>
            Générer
          </Button>
          <Button variant="success" onClick={handleAddPassword}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Modification */}
      <Modal show={showModalModify} onHide={() => setShowModalModify(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Site</Form.Label>
              <Form.Control
                value={selectedPassword?.site || ""}
                onChange={(e) =>
                  setSelectedPassword({ ...selectedPassword!, site: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={selectedPassword?.email || ""}
                onChange={(e) =>
                  setSelectedPassword({ ...selectedPassword!, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                value={selectedPassword?.password || ""}
                onChange={(e) =>
                  setSelectedPassword({ ...selectedPassword!, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={selectedPassword?.description || ""}
                onChange={(e) =>
                  setSelectedPassword({ ...selectedPassword!, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalModify(false)}>
            Annuler
          </Button>
          <Button variant="success" onClick={handleSaveModification}>
            Enregistrer les modifications
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Suppression */}
      <Modal show={showModalDelete} onHide={() => setShowModalDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer le mot de passe pour{" "}
          <strong>{selectedPassword?.site}</strong> ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalDelete(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeletePassword}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
