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

    public componentDidMount() {
        this.props.fetchUser();
    }

    public render() {
        const { user, userFetchStatus, component: Component, ...rest } = this.props;
        
        const redirectToError = () => {
            return (
                <Redirect to="/error" />
            );
        };
        const nullComponent = () => {
            return null;
        };

        switch (userFetchStatus.status) {
            case 'complete':
                if (user) {
                    return <Route { ...rest } component={ Component } />;
                } else {
                    return <Route { ...rest } render={ redirectToError } />;
                }

            default:
                return <Route { ...rest } render={ nullComponent } />;
        }
    }
}

export default UserRoute;
