import React from "react";
import { shallow } from "enzyme";
import NoReports, { Props } from "./NoReports";

const baseProps: Props = {
  user: {
    firstTimeCreatingReports: false
  }
};

describe("NoReports", () => {

  it("expect to render", () => {
    const props = {
      ...baseProps
    };

    const wrapper = shallow(
      <NoReports { ...props }/>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("expect to redirect", () => {
    const props = {
      ...baseProps,
      user: {
        ...baseProps.user,
        firstTimeCreatingReports: true
      }
    };

    const wrapper = shallow(
      <NoReports { ...props }/>
    );

    expect(wrapper).toMatchSnapshot();
  });

});
