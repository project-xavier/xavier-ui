import React, { Fragment, Component } from 'react';
import { withRouter } from 'react-router-dom';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';
import {
    Breadcrumb,
    BreadcrumbItem
} from '@patternfly/react-core';
import { GlobalProps } from '../../models/GlobalProps';

interface Props extends GlobalProps {
    title: string;
    mainStyle?: any;
    showBreadcrumb?: boolean;
};

interface State {
}

export class UploadFilesPage extends Component<Props, State> {

    toIndex(event: any): void {
        event.preventDefault();
        this.props.history.push('/upload');
    }

    showRootLink() {
        return (
            this.props.history && this.props.history.location.pathname !== '/upload' ?
                <BreadcrumbItem to='#' onClick={ this.toIndex }>Reports</BreadcrumbItem>
                : ''
        );
    }

    showBreadcrumb() {
        return (
            this.props.showBreadcrumb && <Breadcrumb style={ { marginLeft: 'calc(var(--pf-c-content--ol--MarginLeft) * -1 * 2)' } }>
                { this.showRootLink() }
                <BreadcrumbItem isActive style={ { marginTop: 0 } }>{ this.props.title }</BreadcrumbItem>
            </Breadcrumb>
        );
    }

    render() {
        const { title, children } = this.props;

        return (
            <Fragment>
                <PageHeader>
                    { this.showBreadcrumb() }
                    <PageHeaderTitle title={ title } />
                </PageHeader>
                <Main style={ this.props.mainStyle }>
                    { children }
                </Main>
            </Fragment>
        );
    }
};

export default withRouter(UploadFilesPage);
