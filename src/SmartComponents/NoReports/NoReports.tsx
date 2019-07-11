import React from 'react';
import { Link } from 'react-router-dom';
import {
    Bullseye,
    EmptyStateBody,
    EmptyStateVariant,
    EmptyState,
    Title
} from '@patternfly/react-core';
import { RouterGlobalProps } from '../../models/router';
import ProcessImprovementSvg from '../../PresentationalComponents/Icons/process-improvement.svg';
import './Reports.scss';

interface StateToProps {
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
        return (
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
        );
    }
}

export default NoReports;
