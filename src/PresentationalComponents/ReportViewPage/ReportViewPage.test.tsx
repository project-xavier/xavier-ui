import React from "react";
import { shallow } from "enzyme";
import ReportViewPage, { Props } from "./ReportViewPage";

const baseProps: Props = {
  report: {
    id: 123,
    creationDate: 123,
    customerId: '123',
    fileName: '123.zip',
    numberOfHosts: 123,
    totalDiskSpace: 123,
    totalPrice: 123,
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
