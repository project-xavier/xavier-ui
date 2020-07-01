import React, { Fragment, Component } from 'react';
import {
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components/components/PageHeader';
import {
    Main
} from '@redhat-cloud-services/frontend-components/components/Main';

interface Props {
    mainStyle?: any;
};

interface State {
}

class ReportsPage extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
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

export default ReportsPage;
