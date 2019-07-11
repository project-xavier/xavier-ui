import { shallow } from "enzyme";
import ReportViewPage from "./ReportViewPage";

describe("ReportViewPage", () => {

  it("expect to render", () => {
    const wrapper = shallow(
      <ReportViewPage mainStyle={ { color: 'red' } } >
        children
      </ReportViewPage>
    );
    expect(wrapper).toMatchSnapshot();
  });

});
