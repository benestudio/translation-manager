import React, { useEffect, useState } from "react";
import { Jumbotron } from "react-bootstrap";
import { IntlProvider, FormattedMessage } from "react-intl";
import { Form } from "react-bootstrap";
import definedMessages from "./messages";
import api from "../../api";
import axios from "axios";
import Cookies from "js-cookie";

const Demo = () => {
    const [languages, setLanguages] = useState([]);
    const [locale, setLocale] = useState(Cookies.get('language') || "en");
    const [messages, setMessages] = useState({});
    const getLanguages = async () => {
        const result = await api.get("/languages")
        setLanguages(result.data);
    }
    const getMessages = async (newLocale) => {
        const result = await axios.get(`/messages/${newLocale}.json`);
        setMessages(result.data);
        setLocale(newLocale);
        Cookies.set('language', newLocale);
    }

    const handleChangeLocale = ({ currentTarget: { value }}) => {
        getMessages(value)
    }

    useEffect(() => {
        getLanguages();
        getMessages(locale)
    }, []);

    return (
        <IntlProvider locale={locale} defaultLocale="en" messages={messages} key={locale}>
            <Jumbotron>
                <Form.Group>
                    <Form.Label>Language</Form.Label>
                    <Form.Control
                        value={locale}
                        type="text"
                        as={"select"}
                        name="locale"

                        onChange={handleChangeLocale}
                    >
                        {languages.map(({ code, name, _id }) => (
                            <option value={code} key={_id}>{name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <h1>
                    <FormattedMessage {...definedMessages.h1} />
                </h1>
                <p>
                    <FormattedMessage {...definedMessages.p} />
                </p>
            </Jumbotron>
        </IntlProvider>
    );
}

export default Demo;
