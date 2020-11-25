import React from 'react';
import { shallow } from 'enzyme';
import ProjectCostBreakdownTable from './ProjectCostBreakdownTable';
import { RHVRampUpCostsModel, SourceRampDownCostsModel } from '../../../models';

const baseRhvRampUpCostsModel: RHVRampUpCostsModel = {
  year1RhvTotalValue: 1000,
  year2RhvTotalValue: 2000,
  year3RhvTotalValue: 3000,
  year1RhvTotalGrowthValue: 4000,
  year2RhvTotalGrowthValue: 5000,
  year3RhvTotalGrowthValue: 6000,
  rhvSwitchLearningSubsValue: 7000,
  rhvSwitchConsultValue: 8000,
  rhvSwitchTAndEValue: 9000,

  year1RhvGrandTotalGrowthValue: 0,
  year2RhvGrandTotalGrowthValue: 0,
  year3RhvGrandTotalGrowthValue: 0,
};

const baseSourceRampDownCostsModel: SourceRampDownCostsModel = {
  year1SourceMaintenanceTotalValue: 1000,
  year2SourceMaintenanceTotalValue: 2000,
  year3SourceMaintenanceTotalValue: 3000,
};

describe('ProjectCostBreakdownTable', () => {
  it('expect to render', () => {
    const rhvRampUpCostsModel: RHVRampUpCostsModel = {
      ...baseRhvRampUpCostsModel,
    };

    const sourceRampDownCostsModel: SourceRampDownCostsModel = {
      ...baseSourceRampDownCostsModel,
    };

    const wrapper = shallow(
      <ProjectCostBreakdownTable
        rhvRampUpCostsModel={rhvRampUpCostsModel}
        sourceRampDownCostsModel={sourceRampDownCostsModel}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render using null and undefined data', () => {
    const rhvRampUpCostsModel: RHVRampUpCostsModel = {
      ...baseRhvRampUpCostsModel,
    };

    const sourceRampDownCostsModel: SourceRampDownCostsModel = {
      ...baseSourceRampDownCostsModel,
    };

    // Force null values
    Object.keys(rhvRampUpCostsModel).forEach((key) => (rhvRampUpCostsModel[key] = null));
    Object.keys(sourceRampDownCostsModel).forEach((key) => (sourceRampDownCostsModel[key] = null));

    const wrapper = shallow(
      <ProjectCostBreakdownTable
        rhvRampUpCostsModel={rhvRampUpCostsModel}
        sourceRampDownCostsModel={sourceRampDownCostsModel}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render using values equal to 0', () => {
    const rhvRampUpCostsModel: RHVRampUpCostsModel = {
      ...baseRhvRampUpCostsModel,
      year1RhvTotalValue: 0,
      year2RhvTotalValue: 0,
      year3RhvTotalValue: 0,
      year1RhvTotalGrowthValue: 0,
      year2RhvTotalGrowthValue: 0,
      year3RhvTotalGrowthValue: 0,
      rhvSwitchLearningSubsValue: 0,
      rhvSwitchConsultValue: 0,
      rhvSwitchTAndEValue: 0,
    };

    const sourceRampDownCostsModel: SourceRampDownCostsModel = {
      ...baseSourceRampDownCostsModel,
      year1SourceMaintenanceTotalValue: 0,
      year2SourceMaintenanceTotalValue: 0,
      year3SourceMaintenanceTotalValue: 0,
    };

    const wrapper = shallow(
      <ProjectCostBreakdownTable
        rhvRampUpCostsModel={rhvRampUpCostsModel}
        sourceRampDownCostsModel={sourceRampDownCostsModel}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
