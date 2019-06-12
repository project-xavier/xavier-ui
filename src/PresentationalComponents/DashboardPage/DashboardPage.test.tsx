import { shallow } from "enzyme";
import DashboardPage from "./DashboardPage";

describe("DashboardPage", () => {
  it("expect to render ", () => {
    const wrapper = shallow(<DashboardPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
