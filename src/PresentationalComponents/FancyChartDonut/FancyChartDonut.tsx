import React, { Component } from 'react';
import {
    ChartDonut,
    ChartDonutProps,
    ChartThemeColor,
    ChartThemeVariant
} from '@patternfly/react-charts';

export interface FancyChartDonutData {
    label: string;
    value: number;
    color?: string;
    extraData?: any;
}

interface Props {
    data: FancyChartDonutData[];
    chartProps?: ChartDonutProps;
    tickFormat?: (label: string, value: number, data: any) => string;
    tooltipFormat?: (datum: any) => string;
}

interface State {
}

class FancyChartDonut extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { data, chartProps, tickFormat, tooltipFormat } = this.props;

        const chartData = data.map((val) => {
            return {
                x: val.label,
                y: val.value,
                extraData: val.extraData
            };
        });

        const legendData = data.map((val) => {
            return {
                name: tickFormat ? tickFormat (val.label, val.value, val.extraData) : `${val.label}: ${val.value}`
            };
        });

        const chartLabels = (d: any): string => {
            if (tooltipFormat) {
                return tooltipFormat(d);
            } else if (tickFormat) {
                tickFormat(d.datum.x, d.datum.y, d.datum.extraData)
            }
            return `${d.datum.x}: ${d.datum.y}`;
        };

        return (
            <React.Fragment>
                <div className="pf-u-display-flex">
                    <div className="donut-chart-container">
                        <ChartDonut
                            data={ chartData }
                            labels={ chartLabels }
                            legendData={ legendData }
                            legendOrientation="vertical"
                            legendPosition="right"
                            themeColor={ChartThemeColor.multiOrdered}
                            themeVariant={ChartThemeVariant.light}
                            padding={{
                                bottom: 20,
                                left: 20,
                                right: 160, // Adjusted to accommodate legend
                                top: 20
                            }}
                            legendAllowWrap={true}
                            width={450}
                            height={190}
                            { ...chartProps }
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FancyChartDonut;
