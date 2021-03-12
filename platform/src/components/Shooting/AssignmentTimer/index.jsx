import React from 'react';
import cn from 'classnames';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles, Grid } from '@material-ui/core';

import { styles } from './styles';
import { AUTO_ASSIGNMENT_STATUSES } from '../../../config/consts';
import { getFormattedTimer } from '../../../utils/timeHelpers';

class AssignmentTimer extends React.Component {
  intervalId = null;

  constructor(props) {
    super(props);
    this.state = {
      timer: props.timer,
    };
  }

  componentDidMount = () => {
    const { status, shootingState } = this.props;
    this.initTimer(status, shootingState);
  };

  componentWillReceiveProps = (nextProps) => {
    const { status, shootingState } = nextProps;
    this.setState({ timer: nextProps.timer }, () => {
      if (this.intervalId) {
        window.clearInterval(this.intervalId);
      }
      this.initTimer(status, shootingState);
    });
  };

  componentWillUnmount() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  initTimer = (status, shootingState) => {
    const { REFUSED, FREEZED, DEFAULT, INSERTED } = AUTO_ASSIGNMENT_STATUSES;
    const { onTimerEnd } = this.props;

    if (![REFUSED, FREEZED, DEFAULT, INSERTED].includes(status)) {
      this.intervalId = window.setInterval(() => {
        this.setState(
          (state) => ({
            timer: state.timer > 1000 ? state.timer - 1000 : 0,
          }),
          () => {
            if (this.state.timer <= 0) {
              window.clearInterval(this.intervalId);
              if (onTimerEnd) {
                onTimerEnd();
              }
            }
          }
        );
      }, 1000);
    }
  };

  render() {
    const { classes, maxValue, status, shootingState, timerSize, photographer } = this.props;
    const { timer } = this.state;
    const { REFUSED, FREEZED, ELAPSED, INSERTED } = AUTO_ASSIGNMENT_STATUSES;

    let additionalTimerStyles = {};
    let additionalBarStyles = {};
    let barStyle = {};

    if (photographer) {
      barStyle = classes.photographerBar;
    } else {
      additionalTimerStyles = {
        [classes.freezedTimer]: status === FREEZED,
        [classes.elapsedRefusedTimer]: status === ELAPSED || status === REFUSED,
      };
      barStyle = classes[`linearBarColorPrimary_${shootingState}`];
      additionalBarStyles = {
        [classes[`freezedBar_${shootingState}`]]: status === FREEZED,
        [classes.elapsedRefusedBar]: status === ELAPSED || status === REFUSED,
      };
    }

    const barValue = status === INSERTED ? 0 : (timer * 100) / maxValue;

    return (
      <Grid container direction="column">
        <Grid
          item
          className={cn(classes.timer, additionalTimerStyles)}
          style={timerSize === 'big' ? { fontWeight: 300, fontSize: 31, alignSelf: 'center' } : {}}
        >
          {getFormattedTimer(timer).formattedValue}
        </Grid>
        <Grid item>
          <LinearProgress
            color="primary"
            className={classes.bar}
            classes={{
              colorPrimary: classes.linearColorPrimary,
              barColorPrimary: cn(barStyle, additionalBarStyles),
            }}
            variant="determinate"
            value={barValue}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(AssignmentTimer);
