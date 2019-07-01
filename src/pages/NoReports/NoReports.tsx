import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
    Button,
    ButtonVariant,
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
import { RouterGlobalProps } from '../../models/router';

interface StateToProps {
    user: User
}

interface DispatchToProps {
}

interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
};

interface State {
};

class NoReports extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { user } = this.props;

        if (user.firstTimeCreatingReports) {
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
                        <Button variant={ ButtonVariant.primary } component={ Link } to="/reports/upload">Create report</Button>
                    </EmptyState>
                </Bullseye>
            </ReportsPage>
        );
    }
}

export default NoReports;
