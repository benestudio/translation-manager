import React, { useEffect, useState } from "react";
import { Container, Jumbotron, Button, Modal, Form, ListGroup, ButtonGroup } from "react-bootstrap";
import api from "../../api";

const initialNewLanguage = {
    code: "",
    name: "",
};

const Languages = () => {
    const [languages, setLanguages] = useState([]);
    const [newLanguage, setNewLanguage] = useState(initialNewLanguage);
    const [editingLanguage, setEditingLanguage] = useState(initialNewLanguage);
    const [isAddNewLanguageOpen, setIsAddNewLanguageOpen] = useState(false);
    const [isEditLanguageOpen, setIsEditLanguageOpen] = useState(false);
    const getLanguages = async () => {
        const result = await api.get("/languages")
        setLanguages(result.data);
    }
    useEffect(() => {
        getLanguages();
    }, []);
    const handleOpenAddNewLanguage = () => {
        setIsAddNewLanguageOpen(true);
    }
    const handleCloseOpenAddNewLanguage = () => {
        setIsAddNewLanguageOpen(false);
        setNewLanguage(initialNewLanguage);
    }
    const handleNewLanguageChange = ({ currentTarget: { name, value } }) => {
        setNewLanguage(old => ({
            ...old,
            [name]: value,
        }))
    }
    const handleEditLanguageChange = ({ currentTarget: { name, value } }) => {
        setEditingLanguage(old => ({
            ...old,
            [name]: value,
        }))
    }
    const handleSubmitNewLanguage = async (e) => {
        e.preventDefault()
        const result = await api.post("/language", newLanguage);
        if (result.status === 200) {
            setIsAddNewLanguageOpen(false);
            setNewLanguage(initialNewLanguage);
            getLanguages();
        }
    }
    const handleSubmitEditLanguage = async (e) => {
        e.preventDefault()
        const result = await api.put(`/language/${editingLanguage.code}`, editingLanguage);
        if (result.status === 200) {
            setIsEditLanguageOpen(false);
            setEditingLanguage(initialNewLanguage);
            getLanguages();
        }
    }
    const handleDeleteLanguage = async (code) => {
        const result = await api.delete(`/language/${code}`);
        if (result.status === 200) {
            getLanguages();
        }
    }

    const handleOpenEditLanguage = async (code) => {
        setEditingLanguage(languages.find(language => language.code === code));
        setIsEditLanguageOpen(true);
    }
    const handleCloseEditLanguage = async () => {
        setIsEditLanguageOpen(false);
    }
    return (
        <Jumbotron fluid>
            <Container>
                <h2>Languages <Button onClick={handleOpenAddNewLanguage}>Add new language</Button></h2>
                <div>
                    <ListGroup>
                        {languages.map(({ name, code }) => (
                            <ListGroup.Item key={code}>
                                {name} ({code}){" "}
                                <ButtonGroup>
                                    <Button variant="outline-info" onClick={() => handleOpenEditLanguage(code)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" onClick={() => handleDeleteLanguage(code)}>
                                        Delete
                                    </Button>
                                </ButtonGroup>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
                <Modal show={isAddNewLanguageOpen} onHide={handleCloseOpenAddNewLanguage}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new language</Modal.Title>
                    </Modal.Header>

                    <Form>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>Code</Form.Label>
                                <Form.Control
                                    value={newLanguage.code}
                                    type="text"
                                    placeholder='For example "hu" or "en"'
                                    name="code"
                                    onChange={handleNewLanguageChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    value={newLanguage.name}
                                    type="text"
                                    placeholder='For example "Magyar" or "English"'
                                    name="name"
                                    onChange={handleNewLanguageChange}
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="primary"
                                type="submit"
                                onClick={handleSubmitNewLanguage}
                                disabled={newLanguage.code.length === 0 || newLanguage.name.length === 0}
                            >
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <Modal show={isEditLanguageOpen} onHide={handleCloseEditLanguage}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit language</Modal.Title>
                    </Modal.Header>

                    <Form>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>Code</Form.Label>
                                <Form.Control
                                    value={editingLanguage.code}
                                    type="text"
                                    placeholder='For example "hu" or "en-us"'
                                    name="code"
                                    onChange={handleEditLanguageChange}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    value={editingLanguage.name}
                                    type="text"
                                    placeholder='For example "Magyar" or "English (American)'
                                    name="name"
                                    onChange={handleEditLanguageChange}
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="primary"
                                type="submit"
                                onClick={handleSubmitEditLanguage}
                                disabled={editingLanguage.code.length === 0 || editingLanguage.name.length === 0}
                            >
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </Jumbotron>
    );
};

export default Languages;
