import React from "react";
import { shallow } from "enzyme";
import ErrorPage from "./ErrorPage";

describe("ErrorPage", () => {

  it("expect to render", () => {
    const wrapper = shallow(
      <ErrorPage />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
