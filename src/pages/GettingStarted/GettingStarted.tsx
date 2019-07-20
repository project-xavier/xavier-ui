import React from 'react';
import { Link } from 'react-router-dom';
import {
    EmptyStateBody,
    EmptyState,
    Title,
    Bullseye,
    EmptyStateVariant
} from '@patternfly/react-core';
import ProcessImprovementSvg from '../../PresentationalComponents/Icons/process-improvement_svg';
import './GettingStarted.scss';
import ReportsPage from '../../PresentationalComponents/ReportsPage/ReportsPage';
import { User } from '../../models';
import { Redirect } from 'react-router';

interface StateToProps {
    user: User | null;
}

interface DispatchToProps {
}

export interface Props extends StateToProps, DispatchToProps {
};

interface State {
};

class GettingStarted extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { user } = this.props;

        if (user && !user.firstTimeCreatingReports) {
            return <Redirect to="/reports" />;
        }

        return (
            <ReportsPage>
                <Bullseye>
                    <EmptyState variant={ EmptyStateVariant.full }>
                        <div className="pf-c-empty-state__icon" style={ { opacity: 0.6 } }>
                            <ProcessImprovementSvg height="80px" />
                        </div>
                        <Title size="lg">Let Red Hat Migration Analytics suggest ways to optimize your environment</Title>
                        <EmptyStateBody>
                                    See how you can optimize your virtual environment by
                                    uploading a Red Hat CloudForms generated inventory file
                                    and then letting Red Hat Migration Analytics create
                                    reports showing how you can save money and optimize
                                    workloads - whether by migrating virtual machines or
                                    migrating application to RHEL.
                        </EmptyStateBody>
                        <Link to={ '/reports/upload' } className="pf-c-button pf-m-primary">Get Started</Link>
                    </EmptyState>
                </Bullseye>
            </ReportsPage>
        );
    }
}

export default GettingStarted;
