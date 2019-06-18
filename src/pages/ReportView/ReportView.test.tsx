import { shallow } from "enzyme";
import { ReportView } from ".";

const props = {
  error: '',
  loading: false,
  report: {
    id: 36,
    customerId: "123456",
    fileName: "file1.json",
    numberOfHosts: 254,
    totalDiskSpace: 5871365,
    totalPrice: 1200,
    creationDate: 254112
  },

  match: {
    params: {
      reportId: 1
    }
  },
  fetchReport: jest.fn(),
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
