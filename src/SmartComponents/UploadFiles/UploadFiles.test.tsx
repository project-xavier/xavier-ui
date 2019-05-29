import { shallow } from "enzyme";
import { UploadFiles } from "./UploadFiles";

const props = {
  history: null,
  location: null,
  match: null,

  uploadProgress: jest.fn(),
  uploadRequest: jest.fn(),
  uploadClear: jest.fn(),
  uploads: [
    {
      file: new File([""], "myFile1.zip"),
      success: null,
      error: null,
      progress: 0,
      uploading: false
    },
    {
      file: new File([""], "myFile2.zip"),
      success: null,
      error: null,
      progress: 0,
      uploading: false
    }
  ]
};

describe("UploadFiles", () => {
  it("expect to render Dropzone", () => {
    const emptyProps = Object.assign({}, props, {
      uploads: []
    });
    const wrapper = shallow(<UploadFiles {...emptyProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render progress bar", () => {
    const emptyProps = Object.assign({}, props, {
      uploads: [
        ...props.uploads,
        {
          file: new File([""], "myFile3.zip"),
          success: null,
          error: null,
          progress: 30,
          uploading: true
        }
      ]
    });
    const wrapper = shallow(<UploadFiles {...emptyProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
