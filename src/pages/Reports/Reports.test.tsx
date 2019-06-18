import { shallow } from "enzyme";
import { Reports } from ".";

const props = {
  total: 2,
  loading: false,
  report: null,
  reports: [
    {
      id: 36,
      customerId: "123456",
      fileName: "file1.json",
      numberOfHosts: 254,
      totalDiskSpace: 5871365,
      totalPrice: 1200,
      creationDate: 123654565464
    },
    {
      id: 37,
      customerId: "654321",
      fileName: "file2.json",
      numberOfHosts: 574,
      totalDiskSpace: 5412584,
      totalPrice: 1800,
      creationDate: 123654565464
    }
  ],
  error: "",
  fetchReports: () => ({
    then: (fn: Function) => {
      fn();
    }
  }),

  history: null,
  location: null,
  match: null
};

describe("ReportList", () => {
  it("expect to render empty list", () => {
    const emptyProps = Object.assign({}, props, {
      total: 0,
      reports: []
    });
    const wrapper = shallow(<Reports {...emptyProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render loading list", () => {
    const loadingProps = Object.assign({}, props, {
      loading: true
    });
    const wrapper = shallow(<Reports {...loadingProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render list", () => {
    const listProps = Object.assign({}, props);
    const wrapper = shallow(<Reports {...listProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
