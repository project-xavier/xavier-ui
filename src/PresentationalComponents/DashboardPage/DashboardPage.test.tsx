import { shallow } from "enzyme";
import DashboardPage from "./DashboardPage";

jest.mock("react-router-dom"); // <- Use this line

describe("DashboardPage", () => {
  it("expect to render ", () => {
    const wrapper = shallow(<DashboardPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
