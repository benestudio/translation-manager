import React, { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import api from "../../api";

const CsvUploadButton = ({ onUpload }) => {
    const fileInputRef = useRef(null);

    const [inputKey, setInputKey] = useState(1);

    const onButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onChange = async (event) => {
        if (event.target.files?.length) {
            const reader = new FileReader()
            reader.onload = function (event) {
                api.post('/csv', { data: event.target.result })
                    .then(() => onUpload())
                    .catch((err) => alert(err))
            };
            reader.readAsText(event.target.files[0])
        }
        setInputKey(inputKey + 1);
    };

    return (
        <span key={inputKey}>
            <Button type="blue" onClick={onButtonClick}>
                CSV Import
      </Button>
            <input hidden={true} ref={fileInputRef} type="file" name="csv-file" accept=".csv" onChange={onChange} />
        </span>
    );
};
export default CsvUploadButton;
