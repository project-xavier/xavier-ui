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

  it("expect to render drop", () => {
    const fileContents = "file contents";
    const file = new Blob([fileContents], { type: "text/plain" });

    const wrapper = shallow(
      <NoReports { ...props } />
    );

    wrapper.find(Dropzone).simulate("drop", { dataTransfer: { files: [file] } });
    
    expect(props.selectUploadFile).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledTimes(1);
  });

});
