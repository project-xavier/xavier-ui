import React, { Fragment, Component } from 'react';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

interface Props {
    mainStyle?: any;
    reportId: number;

    match: any;
    history: any;
};

interface State {
    activeTabKey: number
}

class ReportViewPage extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            activeTabKey: 0
        };
    }

    render() {
        const { children } = this.props;

        return (
            <Fragment>
                <PageHeader>
                    <PageHeaderTitle title={ 'Reports' } />
                </PageHeader>
                <Main style={ this.props.mainStyle }>
                    { children }
                </Main>
            </Fragment>
        );
    }
};

export default ReportViewPage;
