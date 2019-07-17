import { shallow } from "enzyme";
import GettingStarted, { Props } from "./GettingStarted";

const baseProps: Props = {
  user: {
    firstTimeCreatingReports: true
  }
};

describe("GettingStarted", () => {

  it("expect to render", () => {
    const props = {
      ...baseProps
    };

    const wrapper = shallow(
      <GettingStarted { ...props } />
    );
    
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to redirect", () => {
    const props = {
      ...baseProps,
      user: {
        ...baseProps.user,
        firstTimeCreatingReports: false
      }
    };

    const wrapper = shallow(
      <GettingStarted { ...props } />
    );

    expect(wrapper).toMatchSnapshot();
  });

});
