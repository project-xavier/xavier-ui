import React from "react";
import { shallow } from "enzyme";
import ErrorPage from "./ErrorPage403";

describe("ErrorPage403", () => {

  it("expect to render", () => {
    const wrapper = shallow(
      <ErrorPage />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
