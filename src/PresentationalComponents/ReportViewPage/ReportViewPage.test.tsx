import React from "react";
import { shallow } from "enzyme";
import ReportViewPage, { Props } from "./ReportViewPage";

const baseProps: Props = {
  report: {
    id: 123,
    reportName: 'My report name 123',
    reportDescription: 'My report descruiption 123',
    payloadName: '123.zip',
    inserted: 123456871,
    lastUpdate: 123456879,
    status: 'IN_PROGRESS'
  },
  reportFetchStatus: {
    error: null,
    status: "complete"
  },

  match: null,
  history: null,
  location: {
    pathname: ''
  }
};

describe("ReportViewPage", () => {

  it("expect to redirect on fetchReport error", () => {
    const props: Props = {
      ...baseProps,
      reportFetchStatus: {
        ...baseProps.reportFetchStatus,
        error: 'A error message'
      }
    };

    const wrapper = shallow(
      <ReportViewPage mainStyle={ { color: 'red' } } { ...props } >
        children
      </ReportViewPage>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render skeleton", () => {
    const props: Props = {
      ...baseProps,
      reportFetchStatus: {
        ...baseProps.reportFetchStatus,
        error: null,
        status: "inProgress"
      }
    };

    const wrapper = shallow(
      <ReportViewPage mainStyle={ { color: 'red' } } { ...props } >
        children
      </ReportViewPage>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render tabs when fetch status is complete", () => {
    const props: Props = {
      ...baseProps,
      reportFetchStatus: {
        ...baseProps.reportFetchStatus,
        error: null,
        status: "complete"
      }
    };

    const wrapper = shallow(
      <ReportViewPage mainStyle={ { color: 'red' } } { ...props } >
        children
      </ReportViewPage>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render tabs when fetch status is complete and report is null", () => {
    const props: Props = {
      ...baseProps,
      report: null,
      reportFetchStatus: {
        ...baseProps.reportFetchStatus,
        error: null,
        status: "complete"
      }
    };

    const wrapper = shallow(
      <ReportViewPage mainStyle={ { color: 'red' } } { ...props } >
        children
      </ReportViewPage>
    );
    expect(wrapper).toMatchSnapshot();
  });

});
