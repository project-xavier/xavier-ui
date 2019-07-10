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

  it("expect to render drop", () => {
    const fileContents = "file contents";
    const file = new Blob([fileContents], { type: "text/plain" });

    const wrapper = shallow(
      <GettingStarted { ...props } />
    );

    wrapper.find(Dropzone).simulate("drop", { dataTransfer: { files: [file] } });
    
    expect(props.selectUploadFile).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledTimes(1);
  });

});
