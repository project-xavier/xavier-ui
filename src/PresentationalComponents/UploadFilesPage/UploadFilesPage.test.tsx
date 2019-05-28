import { shallow } from "enzyme";
import { UploadFilesPage } from "./UploadFilesPage";

describe("UploadFilesPage", () => {
  const routerProps = {
    history: null,
    location: null,
    match: null
  };

  it("expect to render without breadcrumb", () => {
    const wrapper = shallow(
      <UploadFilesPage title="My title" {...routerProps}>
        children
      </UploadFilesPage>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render with breadcrumb and without showing rootLink", () => {
    const props = Object.assign({}, routerProps, {
      history: {
        location: {
          pathname: "/upload"
        }
      }
    });

    const wrapper = shallow(
      <UploadFilesPage title="My title" showBreadcrumb={true} {...props}>
        children
      </UploadFilesPage>
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
      <UploadFilesPage title="My title" showBreadcrumb={true} {...props}>
        children
      </UploadFilesPage>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
