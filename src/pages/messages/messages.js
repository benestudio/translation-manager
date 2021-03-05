import React, { useEffect, useState } from "react";
import { Container, Jumbotron, Button, ButtonGroup, Modal, Form, Table } from "react-bootstrap";
import api from "../../api";
import CsvUploadButton from "../../components/Navbar/CsvUploadButton";

const initialNewMessage = {
    key: "",
    defaultMessage: "",
    description: "",
    widget: "",
    screenshot: "",
    messages: {},
};

const mockWidgets = [
    {
        value: "christmas-widget",
        label: "Christmas widget",
    },
    {
        value: "easter-widget",
        label: "Easter widget",
    },
]

const Languages = () => {
    const [languages, setLanguages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(initialNewMessage);
    const [mode, setMode] = useState("create");
    const [isAddNewMessageOpen, setIsAddNewMessageOpen] = useState(false);

    const getLanguages = async () => {
        const result = await api.get("/languages")
        setLanguages(result.data);
    }
    const getMessages = async () => {
        const result = await api.get("/messages")
        setMessages(result.data);
    }
    useEffect(() => {
        getLanguages();
        getMessages();
    }, []);
    const handleOpenAddNewMessage = () => {
        setMode("create");
        setIsAddNewMessageOpen(true);
    }
    const handleCloseOpenAddNewMessage = () => {
        setIsAddNewMessageOpen(false);
        setNewMessage(initialNewMessage);
    }
    const handleNewMessageChange = ({ currentTarget: { name, value } }) => {
        setNewMessage(old => ({
            ...old,
            [name]: value,
        }))
    }
    const handleNewMessageMessagesChange = ({ currentTarget: { name, value } }) => {
        setNewMessage(old => ({
            ...old,
            messages: {
                ...old.messages,
                [name]: value,
            }
        }))
    }

    const handleSubmitNewMessage = async (e) => {
        e.preventDefault()
        let result;
        if (mode === "create") {
            result = await api.post("/message", newMessage);
        } else {
            result = await api.put(`/message/${newMessage._id}`, newMessage);
        }
        if (result.status === 200) {
            setIsAddNewMessageOpen(false);
            setNewMessage(initialNewMessage);
            getMessages();
        }
    }

    const handleDeleteMessage = async (_id) => {
        const result = await api.delete(`/message/${_id}`);
        if (result.status === 200) {
            getMessages();
        }
    }

    const handleOpenEditMessage = (_id) => {
        setMode("modify")
        const message = messages.find(message => message._id === _id);
        setNewMessage({
            ...initialNewMessage,
            ...message,
            ...(!message.messages && {
                messages: {}
            }),
        });
        setIsAddNewMessageOpen(true);
    };

    const handleRefreshMessages = async () => {
        const result = await api.put("/refresh-messages");
        if (result.status === 200) {
            alert("Successfully refreshed!");
        }
    }

    const handleCsvExport = async () => {
        window.open("http://localhost:8080/csv", "_blank")
    }

    return (
        <Jumbotron fluid>
            <Container>
                <h2>
                    Messages{" "}
                    <Button onClick={handleOpenAddNewMessage}>Add new message</Button>
                    {" "}
                    <Button variant="info" onClick={handleRefreshMessages}>Refresh messages</Button>
                    {" "}
                    <Button onClick={handleCsvExport}>CSV Export</Button>
                    {" "}
                    <CsvUploadButton onUpload={getMessages} />
                </h2>
                <div>
                    <Table striped bordered hover variant="light">
                        <thead>
                            <tr>
                                <th>Key *</th>
                                <th>Default message *</th>
                                <th>Description</th>
                                <th>Widget</th>
                                <th>Screenshot</th>
                                {languages.map(language => (
                                    <th key={language._id}>{language.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(({ _id, key, defaultMessage, messages: definedMessages, description, widget, screenshot }) => (
                                <tr variant="info" key={_id}>
                                    <td>{key}</td>
                                    <td>{defaultMessage}</td>
                                    <td>{description || "n/a"}</td>
                                    <td>{(mockWidgets.find(w => w.value === widget) || { label: "n/a" }).label}</td>
                                    <td>{screenshot ? <a target="_blank" href={screenshot} rel="noreferrer">Open</a> : "n/a"}</td>
                                    {languages.map(language => (
                                        <td key={language._id}>{(definedMessages || {})[language.code] || "n/a"}</td>
                                    ))}
                                    <td>
                                        <ButtonGroup>
                                            <Button variant="outline-info" onClick={() => handleOpenEditMessage(_id)}>
                                                Edit
                                            </Button>
                                            <Button variant="outline-danger" onClick={() => handleDeleteMessage(_id)}>
                                                Delete
                                            </Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <Modal show={isAddNewMessageOpen} onHide={handleCloseOpenAddNewMessage}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new message</Modal.Title>
                    </Modal.Header>

                    <Form>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>Key *</Form.Label>
                                <Form.Control
                                    value={newMessage.key}
                                    type="text"
                                    placeholder='For example "header.home"'
                                    name="key"
                                    onChange={handleNewMessageChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Default message *</Form.Label>
                                <Form.Control
                                    value={newMessage.defaultMessage}
                                    type="text"
                                    as={newMessage.defaultMessage.length < 32 ? "input" : "textarea"}
                                    placeholder='For example "Home"'
                                    name="defaultMessage"
                                    onChange={handleNewMessageChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    value={newMessage.description}
                                    type="text"
                                    as={"textarea"}
                                    placeholder='Some descriptive text'
                                    name="description"
                                    onChange={handleNewMessageChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Widget</Form.Label>
                                <Form.Control
                                    value={newMessage.widget}
                                    type="text"
                                    as={"select"}
                                    placeholder='For example "Christmas widget"'
                                    name="widget"
                                    onChange={handleNewMessageChange}
                                >
                                    {mockWidgets.map(({ value, label }) => (
                                        <option value={value}>{label}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Screenshot</Form.Label>
                                <Form.Control
                                    value={newMessage.screenshot}
                                    type="text"
                                    as={newMessage.screenshot.length < 32 ? "input" : "textarea"}
                                    placeholder='Insert a URL'
                                    name="screenshot"
                                    onChange={handleNewMessageChange}
                                />
                            </Form.Group>
                            {languages.map(language => (
                                <Form.Group key={language._id}>
                                    <Form.Label>{language.name}</Form.Label>
                                    <Form.Control
                                        value={newMessage.messages[language.code] || ""}
                                        type="text"
                                        placeholder='For example "Home"'
                                        name={language.code}
                                        as={(newMessage.messages[language.code] || "").length < 32 ? "input" : "textarea"}
                                        onChange={handleNewMessageMessagesChange}
                                    />
                                </Form.Group>
                            ))}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="primary"
                                type="submit"
                                onClick={handleSubmitNewMessage}
                                disabled={newMessage.key.length === 0 || newMessage.defaultMessage.length === 0}
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
