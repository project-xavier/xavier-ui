import { shallow } from "enzyme";
import EmptyDashboard from "./EmptyDashboard";

describe("EmptyDashboard", () => {
  it("expect to render ", () => {
    const wrapper = shallow(<EmptyDashboard />);
    expect(wrapper).toMatchSnapshot();
  });
});
