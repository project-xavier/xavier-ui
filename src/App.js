import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';
import '@patternfly/patternfly/patternfly-addons.css';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import { NotificationPortal } from '@redhat-cloud-services/frontend-components-notifications';
import asyncComponent from './Utilities/asyncComponent';

const DeleteMessageDialog = asyncComponent(() =>
  import(/* webpackChunkName: "DeleteDialog" */ './SmartComponents/DeleteDialog')
);

class App extends Component {
  componentDidMount() {
    insights.chrome.init();
    insights.chrome.identifyApp('migration-analytics');

    this.appNav = insights.chrome.on('APP_NAVIGATION', (event) =>
      this.props.history.push(`/${event.navId}`)
    );
  }

  componentWillUnmount() {
    this.appNav();
  }

  render() {
    return (
      <React.Fragment>
        <Routes childProps={this.props} />
        <NotificationPortal />
        <DeleteMessageDialog />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  history: PropTypes.object,
};

/**
 * withRouter: https://reacttraining.com/react-router/web/api/withRouter
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default withRouter(connect()(App));
