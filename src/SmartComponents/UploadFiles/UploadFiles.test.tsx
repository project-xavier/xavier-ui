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
      progress: null,
      uploading: false
    },
    {
      file: new File([""], "myFile2.zip"),
      success: null,
      error: null,
      progress: null,
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

  // it("expect to redirect because error", () => {
  //   const errorProps = Object.assign({}, props, {
  //     error: 'Error loading data'
  //   });
  //   const wrapper = shallow(<UploadFiles {...errorProps} />);
  //   expect(wrapper).toMatchSnapshot();
  // });

  // it("expect to render loading object", () => {
  //   const loadingProps = Object.assign({}, props, {
  //     loading: true
  //   });
  //   const wrapper = shallow(<UploadFiles {...loadingProps} />);
  //   expect(wrapper).toMatchSnapshot();
  // });

  // it("expect to render object", () => {
  //   const objProps = Object.assign({}, props);
  //   const wrapper = shallow(<UploadFiles {...objProps} />);
  //   expect(wrapper).toMatchSnapshot();
  // });
});
