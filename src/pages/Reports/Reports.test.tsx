import React from "react";
import { shallow } from 'enzyme';
import Reports, { Props } from './Reports';

const props: Props = {
  reports: {
    total: 2,
    items: [
      {
        id: 36,
        reportName: "My report name 36",
        reportDescription: "My report description 36",
        payloadName: "file1.json",
        inserted: 123654565464,
        lastUpdate: 123654565464,
        status: 'IN_PROGRESS'
      },
      {
        id: 37,
        reportName: "My report name 37",
        reportDescription: "My report description 37",
        payloadName: "file2.json",
        inserted: 123654565464,
        lastUpdate: 123654565464,
        status: 'IN_PROGRESS'
      }
    ]
  },
  reportsFetchStatus: {
    error: null,
    status: 'complete'
  },
  fetchReportPayloadDownloadLink: () => ({
    then: (fn: () => any) => fn()
  }),
  addNotification: (notification: any) => ({
    then: (fn: () => any) => fn()
  }),

  fetchReports: () => ({
    then: (fn: () => any) => fn()
  }),
  deleteReport: jest.fn(),
  showDeleteDialog: jest.fn(),
  closeDeleteDialog: jest.fn(),

  history: {
    push: jest.fn()
  },
  location: null,
  match: null
};

describe("Reports should render list depending of TOTAL value", () => {
  it("expect to render empty list even though is not fetching and items.length > 0. Using Total = 0", () => {
    const emptyProps: Props = {
      ...props,
      reports: {
        ...props.reports,
        total: 0
      },
      reportsFetchStatus: {
        ...props.reportsFetchStatus,
        status: 'inProgress'
      }
    };

    const wrapper = shallow(<Reports {...emptyProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render list even though is fetching. Using Total > 0", () => {
    const listProps: Props = {
      ...props,
      reports: {
        ...props.reports,
        total: props.reports.items.length
      },
      reportsFetchStatus: {
        ...props.reportsFetchStatus,
        status: 'inProgress'
      }
    };
    const wrapper = shallow(<Reports {...listProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
