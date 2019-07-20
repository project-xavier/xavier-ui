import React from "react";
import { shallow } from "enzyme";
import RenewalEstimation from "./RenewalEstimation";
import { SourceCostsModel } from "../../../models";

const baseSourceCostsModel: SourceCostsModel = {
  sourceRenewHighValue: 1000,
  sourceRenewLikelyValue: 2000,
  sourceRenewLowValue: 3000
};

describe("RenewalEstimation", () => {
  it("expect to render", () => {
    const data: SourceCostsModel = {
      ...baseSourceCostsModel
    };

    const wrapper = shallow(
      <RenewalEstimation
        data={ data }
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render using null and undefined data", () => {
    const sourceCostModel: SourceCostsModel = {
      ...baseSourceCostsModel
    };
    Object.keys(sourceCostModel).forEach(key => sourceCostModel[key] = null);

    const wrapper1 = shallow(
      <RenewalEstimation
        data={ sourceCostModel }
      />
    );

    expect(wrapper1).toMatchSnapshot();


    Object.keys(sourceCostModel).forEach(key => sourceCostModel[key] = undefined);

    const wrapper2 = shallow(
      <RenewalEstimation
        data={ sourceCostModel }
      />
    );

    expect(wrapper2).toMatchSnapshot();
  });

  it("expect to render using values equal to 0", () => {
    const data: SourceCostsModel = {
      ...baseSourceCostsModel,
      sourceRenewHighValue: 0,
      sourceRenewLikelyValue: 0,
      sourceRenewLowValue: 0
    };

    const wrapper = shallow(
      <RenewalEstimation
        data={ data }
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

});
