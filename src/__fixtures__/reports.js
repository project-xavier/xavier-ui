const reportsMock = {
    data: [
        {
            id: 36,
            customerId: '123456',
            fileName: 'file1.json',
            numberOfHosts: 254,
            totalDiskSpace: 5871365,
            totalPrice: 1200,
            creationDate: new Date()
        },
        {
            id: 37,
            customerId: '654321',
            fileName: 'file2.json',
            numberOfHosts: 574,
            totalDiskSpace: 5412584,
            totalPrice: 1800,
            creationDate: new Date()
        },
        {
            id: 38,
            customerId: '147852',
            fileName: 'file3.json',
            numberOfHosts: 100,
            totalDiskSpace: 2563145,
            totalPrice: 1700,
            creationDate: new Date()
        }
    ]
};

export const reportMock = {
    data: [ reportsMock.data[0] ]
};

export default reportsMock;
