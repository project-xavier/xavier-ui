import { shallow } from "enzyme";
import NoReports from "./NoReports";
import Dropzone from "react-dropzone";

const props = {
  file: null,
  selectUploadFile: jest.fn(),
  match: null,
  history: {
    push: jest.fn()
  },
  location: null,
};

describe("NoReports", () => {

  it("expect to render", () => {
    const wrapper = shallow(
      <NoReports { ...props } />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
