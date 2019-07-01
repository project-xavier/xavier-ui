import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { User } from '../../models';
import {
    Main,
    PageHeader,
    PageHeaderTitle,
    Skeleton
} from '@redhat-cloud-services/frontend-components';

interface StateToProps {
    loading: boolean;
    user: User | null;
    error: string;
}

interface DispatchToProps {
    fetchUser: () => any;
}

interface Props extends StateToProps, DispatchToProps {
    component: any;
}

interface State {}

class UserRoute extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchUser();
    }

    renderLoadingPage = () => {
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title={ <Skeleton size="sm"/> } />
                </PageHeader>
                <Main>{ '' }</Main>
            </React.Fragment>
        );
    }

    render() {
        const { component: Component, ...rest } = this.props;
        const { user } = this.props;

        if (this.props.loading) {
            return <Route { ...rest } render={ () => this.renderLoadingPage() } />;
        } else if (this.props.error) {
            return <Route { ...rest } render={ () => <Redirect to="/error" /> } />;
        } else if (user !== null && user !== undefined && user) {
            return <Route { ...rest } component={ Component } />;
        } else if (user !== null && user !== undefined && !user) {
            return <Route { ...rest } render={ () => <Redirect to="/error" /> } />;
        } else {
            return <Route { ...rest } render={ () => this.renderLoadingPage() } />;
        }
    }
}

export default UserRoute;
