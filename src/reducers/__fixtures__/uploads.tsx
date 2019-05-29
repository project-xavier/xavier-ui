import { Upload } from "../../models";

interface ListReponse {
    data: Upload[]
}

interface ObjectReponse {
    data: Upload
}

const uploadsMock: ListReponse = {
    data: [
        {
            file: new File([ '' ], 'myFile1.zip'),
            success: null,
            error: null,
            progress: 0,
            uploading: false
        },
        {
            file: new File([ '' ], 'myFile2.zip'),
            success: null,
            error: null,
            progress: 0,
            uploading: false
        },
        {
            file: new File([ '' ], 'myFile3.zip'),
            success: null,
            error: null,
            progress: 0,
            uploading: false
        }
    ]
};

export const uploadMock: ObjectReponse = {
    data: uploadsMock.data[0]
};

export default uploadsMock;
