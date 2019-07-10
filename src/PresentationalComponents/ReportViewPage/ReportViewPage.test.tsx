import { shallow } from "enzyme";
import ReportViewPage from "./ReportViewPage";

describe("ReportViewPage", () => {

  const props = {
    location: {
      pathname: ''
    }
  };

  it("expect to render", () => {
    const wrapper = shallow(
      <ReportViewPage mainStyle={ { color: 'red' } } { ...props } >
        children
      </ReportViewPage>
    );
    expect(wrapper).toMatchSnapshot();
  });

});
