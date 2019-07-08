import React, { Component } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Bullseye
} from '@patternfly/react-core';
import {
    ChartDonut,
    ChartLegend
} from '@patternfly/react-charts';
import { formatValue } from '../../Utilities/formatValue';

interface Props {
    title: string;
    total: number;
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    suffix?: string;
}

interface State {
}

class FancyChartDonut extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { title, total, data, suffix, ...rest } = this.props;

        const chartData = data.map((val) => {
            return {
                x: val.label,
                y: val.value
            };
        });

        const legendData = data.map((val) => {
            return {
                name: val.label
            };
        });

        const colorScale = data.map((val) => val.color);

        return (
            <React.Fragment>
                <Card>
                    <CardHeader>{ title }</CardHeader>
                    <CardBody>
                        <Bullseye>
                            <div>
                                <div className="donut-chart-container">
                                    <ChartDonut
                                        title={ formatValue(total, 'usd') }
                                        subTitle=""
                                        data={ chartData }
                                        labels={ datum => `${datum.x}: ${datum.y}${ suffix }` }
                                        colorScale={ colorScale }
                                        height= { 200 }
                                        innerRadius= { 75 }
                                        { ...rest }
                                    />
                                </div>
                                <ChartLegend
                                    data={ legendData }
                                    height={ 35 }
                                    orientation={ 'horizontal' }
                                    colorScale={ colorScale }
                                    x={ 110 }
                                    { ...rest }
                                />
                            </div>
                        </Bullseye>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default FancyChartDonut;
