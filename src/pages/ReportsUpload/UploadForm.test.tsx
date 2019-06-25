import { shallow } from "enzyme";
import { UploadForm } from "./UploadForm";

const props = {
  errors: {},
  values: {},
  touched: {},
  file: new File([ '' ], 'myFile.zip')
};

describe("UploadForm", () => {
  it("expect to render", () => {
    const wrapper = shallow(<UploadForm { ...props }/>);
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render errors", () => {
    const props1 = {
      ...props,
      errors: {
        file: 'Field value invalid',
        reportName: 'Field value invalid',
        reportDescription: 'Field value invalid',
        yearOverYearGrowthRatePercentage: 'Field value invalid',
        percentageOfHypervisorsMigratedOnYear1: 'Field value invalid',
        percentageOfHypervisorsMigratedOnYear2: 'Field value invalid',
        percentageOfHypervisorsMigratedOnYear3: 'Field value invalid',
        percentageOfHypervisorsMigratedSum: 'Field value invalid'
      },
      touched: {
        file: true,
        reportName: true,
        reportDescription: true,
        yearOverYearGrowthRatePercentage: true,
        percentageOfHypervisorsMigratedOnYear1: true,
        percentageOfHypervisorsMigratedOnYear2: true,
        percentageOfHypervisorsMigratedSum: true
      }
    };
    const wrapper = shallow(<UploadForm { ...props1 }/>);
    expect(wrapper).toMatchSnapshot();
  });
});
