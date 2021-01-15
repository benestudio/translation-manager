import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Bar = () => (
    <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand>Translation manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link as={NavLink} to="/languages">Languages</Nav.Link>
                <Nav.Link as={NavLink} to="/messages">Messages</Nav.Link>
                <Nav.Link as={NavLink} to="/demo">Demo</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export default Bar;
