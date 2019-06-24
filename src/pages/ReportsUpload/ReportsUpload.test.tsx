import { shallow } from "enzyme";
import { ReportsUpload } from ".";

describe("ReportList", () => {
  it("expect to render empty list", () => {
    const wrapper = shallow(<ReportsUpload />);
    expect(wrapper).toMatchSnapshot();
  });
});
