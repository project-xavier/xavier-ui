const uploadsMock = {
    data: [
        {
            file: new File([ '' ], 'myFile1.zip'),
            success: null,
            error: null,
            progress: null
        },
        {
            file: new File([ '' ], 'myFile2.zip'),
            success: null,
            error: null,
            progress: null
        },
        {
            file: new File([ '' ], 'myFile3.zip'),
            success: null,
            error: null,
            progress: null
        }
    ]
};

export const uploadMock = {
    data: [ uploadsMock.data[0] ]
};

export default uploadsMock;
