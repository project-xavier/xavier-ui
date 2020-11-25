import { GlobalState } from '../../models/state';
import GettingStarted from './GettingStarted';
import { connect } from 'react-redux';

const mapStateToProps = (state: GlobalState) => {
  const {
    userState: { user },
  } = state;
  return {
    user,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GettingStarted);
