import { shallow } from "enzyme";
import GettingStarted from "./GettingStarted";
import Dropzone from "react-dropzone";

const props = {
  file: null,
  selectUploadFile: jest.fn(),
  user: {
    firstTimeCreatingReports: true
  },
  match: null,
  history: {
    push: jest.fn()
  },
  location: null
};

describe("GettingStarted", () => {

  it("expect to render", () => {
    const wrapper = shallow(
      <GettingStarted { ...props } />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
