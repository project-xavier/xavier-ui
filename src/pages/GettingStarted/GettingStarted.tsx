import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import {
    EmptyStateBody,
    EmptyState,
    Title,
    Bullseye,
    EmptyStateVariant
} from '@patternfly/react-core';
import { User } from '../../models';
import ProcessImprovementSvg from '../../PresentationalComponents/Icons/process-improvement_svg';
import ReportsPage from '../../PresentationalComponents/ReportsPage/ReportsPage';
import './GettingStarted.scss';

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

    public render() {
        const { user } = this.props;

        if (user && !user.firstTimeCreatingReports) {
            return <Redirect to="/reports" />;
        }

        return (
            <ReportsPage>
                <Bullseye>
                    <EmptyState variant={ EmptyStateVariant.full }>
                        <div>
                            <ProcessImprovementSvg height="80px" className="pf-c-empty-state__icon" style={ { opacity: 0.6 } } />
                        </div>
                        <Title size="lg">Let Red Hat Migration Analytics suggest ways to optimize your environment</Title>
                        <EmptyStateBody>
                            See how you can optimize your virtual environment <br />
                            by uploading a Red Hat CloudForms generated Inventory file <br />
                            and then letting Red Hat Migration Analytics create reports <br />
                            showing how you can save money and optimize workloads <br />
                            whether by migrating virtual machines or <br />
                            migrating applications to Red Hat Enterprise Linux.
                        </EmptyStateBody>
                        <Link to={ '/reports/upload' } className="pf-c-button pf-m-primary">Get Started</Link>
                    </EmptyState>
                </Bullseye>
            </ReportsPage>
        );
    }
}

export default GettingStarted;
