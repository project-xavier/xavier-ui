import React from "react";
import { shallow } from "enzyme";
import ReportCard from "./ReportCard";

describe("ReportCard", () => {
  it("expect to render with bullseye", () => {
    const wrapper = shallow(
      <ReportCard title="This is the title">
        children
      </ReportCard>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render without bullseye", () => {
    const wrapper = shallow(
      <ReportCard title="This is the title" skipBullseye={ true} >
        children
      </ReportCard>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render with custom classes", () => {
    const wrapper = shallow(
      <ReportCard
        title="This is the title"
        cardClass="customCardClass"
        headerClass="customHeaderClass"
        bodyClass="customBodyClass">
        loaded
      </ReportCard>
    );
    expect(wrapper).toMatchSnapshot();
  });

});
