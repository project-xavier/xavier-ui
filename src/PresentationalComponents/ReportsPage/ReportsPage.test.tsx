import { shallow } from "enzyme";
import { ReportsPage } from ".";

describe("ReportListPage", () => {
  const routerProps = {
    history: null,
    location: null,
    match: null
  };

  it("expect to render without breadcrumb", () => {
    const wrapper = shallow(
      <ReportsPage title="My title" {...routerProps}>
        children
      </ReportsPage>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render with breadcrumb and without showing rootLink", () => {
    const props = Object.assign({}, routerProps, {
      history: {
        location: {
          pathname: "/reports"
        }
      }
    });

    const wrapper = shallow(
      <ReportsPage title="My title" showBreadcrumb={true} {...props}>
        children
      </ReportsPage>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render with breadcrumb and showing rootLink", () => {
    const props = Object.assign({}, routerProps, {
      history: {
        location: {
          pathname: "/mypath"
        }
      }
    });

    const wrapper = shallow(
      <ReportsPage title="My title" showBreadcrumb={true} {...props}>
        children
      </ReportsPage>
    );
    expect(wrapper).toMatchSnapshot();
  });

});
