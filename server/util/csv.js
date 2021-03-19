import csvStringify from "csv-stringify";

import csvParse from "csv-parse";

export const parseCSV = (csv) => {
    const result = new Promise((resolve, reject) =>
        csvParse(
            csv,
            {
                columns: true,
                skipEmptyLines: true,
            },
            (err, records) => {
                if (err) {
                    return reject(err);
                }
                resolve(records);
            },
        ),
    );
    return result;
};

export const convertToCSV = async (data) => {
    const result = new Promise((resolve, reject) =>
        csvStringify(
            data,
            {
                header: true,
            },
            (err, records) => {
                if (err) {
                    return reject(err);
                }
                resolve(records);
            },
        ),
    );
    return result;
};
