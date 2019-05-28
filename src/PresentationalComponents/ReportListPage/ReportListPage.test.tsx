import { shallow } from "enzyme";
import { ReportListPage } from "./ReportListPage";

describe("ReportListPage", () => {
  const routerProps = {
    history: null,
    location: null,
    match: null
  };

  it("expect to render without breadcrumb", () => {
    const wrapper = shallow(
      <ReportListPage title="My title" {...routerProps}>
        children
      </ReportListPage>
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
      <ReportListPage title="My title" showBreadcrumb={true} {...props}>
        children
      </ReportListPage>
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
      <ReportListPage title="My title" showBreadcrumb={true} {...props}>
        children
      </ReportListPage>
    );
    expect(wrapper).toMatchSnapshot();
  });

  // it("should redirect to '/reports'", () => {
  //   const mockPushFn = jest.fn();
  //   const props = Object.assign({}, routerProps, {
  //     history: {
  //       push: mockPushFn,
  //       location: {
  //         pathname: "/reports"
  //       }
  //     }
  //   });

  //   const component = shallow(
  //       <ReportListPage title="My title" {...props}>
  //         children
  //       </ReportListPage>
  //   ).dive();
  //   component.find('[className="save-button"]').simulate("click");
  //   expect(mockPushFn).toHaveBeenCalled();
  //   component.unmount();
  // });
});
