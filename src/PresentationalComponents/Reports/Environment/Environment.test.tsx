import { shallow } from "enzyme";
import Environment from "./Environment";
import { EnvironmentModel } from "../../../models";

const baseData: EnvironmentModel = {
  sourceProductIndicator: 0,
  hypervisors: 1,
  year1Hypervisor: 12,
  year2Hypervisor: 123,
  year3Hypervisor: 1234,
  growthRatePercentage: 0.05
};

describe("Environment", () => {
  it("expect to render", () => {
    const data = {
      ...baseData
    };

    const wrapper = shallow(
      <Environment data={ data } />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render using null and undefined data", () => {
    const data = {
      ...baseData,
      hypervisors: null,
      year1Hypervisor: undefined,
      year2Hypervisor: null,
      year3Hypervisor: undefined,
      growthRatePercentage: null
    };

    const wrapper = shallow(
      <Environment data={ data } />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render using values equal to 0", () => {
    const data = {
      ...baseData,
      hypervisors: 0,
      year1Hypervisor: 0,
      year2Hypervisor: 0,
      year3Hypervisor: 0,
      growthRatePercentage: 0
    };

    const wrapper = shallow(
      <Environment data={ data } />
    );

    expect(wrapper).toMatchSnapshot();
  });

});
