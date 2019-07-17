import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    Title,
    EmptyStateBody,
    Bullseye,
    TitleLevel
} from '@patternfly/react-core';
import ReportsPage from '../../PresentationalComponents/ReportsPage';
import {
    AddCircleOIcon
} from '@patternfly/react-icons';
import { User } from '../../models';

interface StateToProps {
    user: User | null;
}

interface DispatchToProps {
}

export interface Props extends StateToProps, DispatchToProps {
};

interface State {
};

class NoReports extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { user } = this.props;

        if (user && user.firstTimeCreatingReports) {
            return <Redirect to="/getting-started" />;
        }

        return (
            <ReportsPage>
                <Bullseye>
                    <EmptyState variant={ EmptyStateVariant.large }>
                        <EmptyStateIcon icon={ AddCircleOIcon } />
                        <Title headingLevel={ TitleLevel.h5 } size="lg">No reports found</Title>
                        <EmptyStateBody>
                            Reports are created from inventory data files that are uploaded to Red Hat Migration Analytics.
                        </EmptyStateBody>
                        <Link to={ '/reports/upload' } className="pf-c-button pf-m-primary">Create report</Link>
                    </EmptyState>
                </Bullseye>
            </ReportsPage>
        );
    }
}

export default NoReports;
