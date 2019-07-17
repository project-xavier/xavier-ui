import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { User } from '../../models';
import { ObjectFetchStatus } from '../../models/state';

interface StateToProps {
    user: User | null;
    userFetchStatus: ObjectFetchStatus;
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

    render() {
        const { user, userFetchStatus, component: Component, ...rest } = this.props;

        switch (userFetchStatus.status) {
            case 'complete':
                if (user) {
                    return <Route { ...rest } component={ Component } />;
                } else {
                    return <Route { ...rest } render={ () => <Redirect to="/error" /> } />;
                }

            default:
                return <Route { ...rest } render={ () => null } />;
        }
    }
}

export default UserRoute;
