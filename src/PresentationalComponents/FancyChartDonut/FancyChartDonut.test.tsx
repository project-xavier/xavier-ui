import React from "react";
import { shallow } from "enzyme";
import FancyChartDonut, { FancyChartDonutData } from "./FancyChartDonut";

const chartData: FancyChartDonutData[] = [
    { label: 'year1', value: 10, color: 'red', data: {} },
    { label: 'year2', value: 20, color: 'blue', data: {} },
    { label: 'year3', value: 30, color: 'yellow', data: {} },
    { label: 'year4', value: 40, color: 'green', data: {} }
];

describe("FancyChartDonut", () => {
  
  it("expect to render with minimun props", () => {
    const data = [
      ...chartData
    ];
    const wrapper = shallow(<FancyChartDonut data={ data } />);
    expect(wrapper).toMatchSnapshot();
  });

//   it("expect to render footer", () => {
//     const data = {
//         ...baseData
//     };
    
//     const footer = (
//         <p>this is a footer</p>
//     );

//     const wrapper = shallow(<FancyGroupedBarChart data={ data } footer={ footer } />);
//     expect(wrapper).toMatchSnapshot();
//   });
  
});
