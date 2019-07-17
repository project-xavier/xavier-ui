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
            customerId: '123456',
            fileName: 'file1.json',
            numberOfHosts: 254,
            totalDiskSpace: 5871365,
            totalPrice: 1200,
            creationDate: 45654654456,
            status: 'CREATED'
        },
        {
            id: 37,
            customerId: '654321',
            fileName: 'file2.json',
            numberOfHosts: 574,
            totalDiskSpace: 5412584,
            totalPrice: 1800,
            creationDate: 1768876117,
            status: 'CREATED'
        },
        {
            id: 38,
            customerId: '147852',
            fileName: 'file3.json',
            numberOfHosts: 100,
            totalDiskSpace: 2563145,
            totalPrice: 1700,
            creationDate: 17353543154,
            status: 'CREATED'
        }
    ]
};

export const reportMock: ObjectReponse = {
    data: reportsMock.data[0]
};

export default reportsMock;
