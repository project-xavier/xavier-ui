import { Report } from "../../models";

interface ListReponse {
    data: Report[]
}

interface ObjectReponse {
    data: Report
}

const reportsMock: ListReponse = {
    data: [
        {
            id: 36,
            reportName: 'My report name 36',
            reportDescription: 'My report description 36',
            payloadName: 'file1.json',
            inserted: 45654654455,
            lastUpdate: 45654654456,
            status: 'CREATED'
        },
        {
            id: 37,
            reportName: 'My report name 37',
            reportDescription: 'My report description 37',
            payloadName: 'file2.json',
            inserted: 1768876116,
            lastUpdate: 1768876117,
            status: 'CREATED'
        },
        {
            id: 38,
            reportName: 'My report name 38',
            reportDescription: 'My report description 38',
            payloadName: 'file3.json',
            inserted: 17353543153,
            lastUpdate: 17353543154,
            status: 'CREATED'
        }
    ]
};

export const reportMock: ObjectReponse = {
    data: reportsMock.data[0]
};

export default reportsMock;
