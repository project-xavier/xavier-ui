import { shallow } from "enzyme";
import { ReportsUpload } from ".";

const props = {
  file: null,
  success: null,
  error: null,
  progress: 100,
  uploading: true,

  uploadProgress: jest.fn(),
  uploadRequest: jest.fn(),
  selectUploadFile: jest.fn(),

  history: null,
  location: null,
  match: null
};

describe("ReportsUpload", () => {
  it("expect to render form", () => {
    const wrapper = shallow(<ReportsUpload { ...props }/>);
    expect(wrapper).toMatchSnapshot();
  });
});
