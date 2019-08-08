import React from "react";
import { shallow } from "enzyme";
import ReportView from "./ReportView";

const props = {
  report: {
    id: 36,
    reportName: "My report name",
    reportDescription: "My report description",
    payloadName: "file1.json",
    inserted: 254112,
    lastUpdate: 254112,
    status: "CREATED"
  },

  match: {
    params: {
      reportId: 1
    },
    url: '/reports/1'
  },
  fetchReport: jest.fn(),
  reportFetchStatus: {
    error: null,
    status: "none"
  },
  history: null,
  location: null
};

describe("ReportView", () => {
  it("expect to redirect because no reportId", () => {
    const emptyProps = Object.assign({}, props, {
      match: {
        params: {
          reportId: null
        }
      }
    });
    const wrapper = shallow(<ReportView {...emptyProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to redirect because error", () => {
    const errorProps = Object.assign({}, props, {
      error: 'Error loading data'
    });
    const wrapper = shallow(<ReportView {...errorProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render loading object", () => {
    const loadingProps = Object.assign({}, props, {
      loading: true
    });
    const wrapper = shallow(<ReportView {...loadingProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render object", () => {
    const objProps = Object.assign({}, props);
    const wrapper = shallow(<ReportView {...objProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
