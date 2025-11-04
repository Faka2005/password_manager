import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Table, Modal } from "react-bootstrap";
import { Pencil, Eye, EyeSlash } from "react-bootstrap-icons";

import { useUserStorage } from "../utils/Storagelocal";
import BasicAlerts from "../components/Alerts";
import { AddPassword, ListePassword, DeletePassword, ModifyPassword, type Password } from "../utils/Password";
import { logout } from "../utils/Auth";
import GeneratePassword from "../utils/Generatepassword"; // ⚠️ Doit être un export par défaut

interface PasswordItem extends Password {
    _id?: string;
}

const Dashboard: React.FC = () => {
    const user = useUserStorage();

    const [passwords, setPasswords] = useState<PasswordItem[]>([]);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [showModalajoutpassword, setShowModalajoutpassword] = useState(false);
    const [newPassword, setNewPassword] = useState<Password>({
        site: "",
        email: "",
        password: "",
        description: ""
    });
    const [showPasswordIds, setShowPasswordIds] = useState<Set<string>>(new Set());

    // 🔹 Charger la liste des mots de passe
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

    // 🔹 Redirection si pas connecté
    if (!user) {
        return (
            <Container fluid className="text-center d-flex flex-column justify-content-center align-items-center" style={{ height: "80vh" }}>
                <h2>Bienvenue sur Password Manager 🔐</h2>
                <p>Connectez-vous pour gérer vos mots de passe en toute sécurité.</p>
                <Button variant="primary" href="/login">Se connecter</Button>
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
            setShowModalajoutpassword(false);
            setNewPassword({ site: "", email: "", password: "", description: "" });
        } else {
            setAlert({ type: "error", message: "❌ " + res.message });
        }
    };

    // 🔹 Supprimer un mot de passe
    const handleDelete = async (id?: string) => {
        if (!id) return;
        const res = await DeletePassword(id);
        if (res.success) {
            setPasswords(passwords.filter(p => p._id !== id));
            setAlert({ type: "success", message: res.message });
        } else {
            setAlert({ type: "error", message: res.message });
        }
    };

    // 🔹 Modifier un champ
    const handleModify = async (item: PasswordItem, field: keyof PasswordItem) => {
        const newValue = prompt(`Modifier ${field}`, item[field] || "");
        if (!newValue || !item._id) return;

        const updateObj: Partial<PasswordItem> = {};
        updateObj[field] = newValue;

        const res = await ModifyPassword(item._id, newValue);
        if (res.success) {
            setPasswords(passwords.map(p => (p._id === item._id ? { ...p, ...updateObj } : p)));
            setAlert({ type: "success", message: "✅ Modifié !" });
        } else {
            setAlert({ type: "error", message: res.message });
        }
    };

    // 🔹 Copier un mot de passe
    const handleCopy = (password: string) => {
        navigator.clipboard.writeText(password);
        setAlert({ type: "success", message: "Mot de passe copié !" });
    };

    // 🔹 Afficher / masquer un mot de passe
    const toggleShowPassword = (id?: string) => {
        if (!id) return;
        const newSet = new Set(showPasswordIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setShowPasswordIds(newSet);
    };

    // 🔹 Générer un mot de passe aléatoire
    const generate = () => {
        const password = GeneratePassword();
        setNewPassword({ ...newPassword, password });
    };

    // ------------------------------------------------------------------

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
                            <Button variant="success" onClick={() => setShowModalajoutpassword(true)}>
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
                                    passwords.map(item => (
                                        <tr key={item._id || item.email}>
                                            <td>
                                                {item.site}{" "}
                                                <Button variant="link" size="sm" onClick={() => handleModify(item, "site")}>
                                                    <Pencil />
                                                </Button>
                                            </td>
                                            <td>
                                                {item.email}{" "}
                                                <Button variant="link" size="sm" onClick={() => handleModify(item, "email")}>
                                                    <Pencil />
                                                </Button>
                                            </td>
                                            <td>
                                                {showPasswordIds.has(item._id || "")
                                                    ? item.password
                                                    : "••••••••"}
                                                <Button variant="link" size="sm" onClick={() => toggleShowPassword(item._id)}>
                                                    {showPasswordIds.has(item._id || "") ? <EyeSlash /> : <Eye />}
                                                </Button>
                                                <Button variant="link" size="sm" onClick={() => handleModify(item, "password")}>
                                                    <Pencil />
                                                </Button>
                                            </td>
                                            <td>
                                                {item.description || "-"}{" "}
                                                <Button variant="link" size="sm" onClick={() => handleModify(item, "description")}>
                                                    <Pencil />
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-info"
                                                    className="me-2"
                                                    onClick={() => handleCopy(item.password)}
                                                >
                                                    Copier
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    Supprimer
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

            {/* 🔹 Modal d’ajout */}
            <Modal show={showModalajoutpassword} onHide={() => setShowModalajoutpassword(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un mot de passe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Site / Application</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="ex: gmail.com"
                                value={newPassword.site}
                                onChange={e => setNewPassword({ ...newPassword, site: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email / Nom d’utilisateur</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="ex: yassar@gmail.com"
                                value={newPassword.email}
                                onChange={e => setNewPassword({ ...newPassword, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="••••••••"
                                value={newPassword.password}
                                onChange={e => setNewPassword({ ...newPassword, password: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="ex: compte pro"
                                value={newPassword.description}
                                onChange={e => setNewPassword({ ...newPassword, description: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalajoutpassword(false)}>
                        Annuler
                    </Button>
                    <Button variant="info" onClick={generate}>
                        Générer un mot de passe
                    </Button>
                    <Button variant="success" onClick={handleAddPassword}>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Dashboard;
