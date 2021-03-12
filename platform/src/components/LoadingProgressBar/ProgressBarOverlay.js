import React from 'react';
import { connect } from 'react-redux';
import ProgressBar from './ProgressBar';

const ProgressBarOverlay = ({
  utils: {
    loader: { title, isVisible, progress },
  },
}) => (
  <span>
    {isVisible && (
      <div className="spinner-overlay">
        <ProgressBar className="inner-spinner-overlay" title={title} progress={Math.round(progress)} />
      </div>
    )}
  </span>
);

const mapStateToProps = (state) => ({
  utils: state.utils,
});

export default connect(mapStateToProps)(ProgressBarOverlay);
