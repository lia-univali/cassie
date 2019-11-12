import React from 'react';
import Button from '@material-ui/core/Button';
import { space } from '../theme';
import { withStyles } from '@material-ui/core/styles';
import { NEXT, PREVIOUS } from '../containers/AcquisitionPage';

const StepperButtons = ({ navigate, classes, children,
  nextText = "Continuar", nextDisabled = false, nextTarget = NEXT, onNext = () => { },
  backText = "Voltar", backDisabled = false, backTarget = PREVIOUS, onBack = () => { },
}) => {
  const navigateBackwards = () => {
    onBack();
    navigate(backTarget);
  }

  const navigateForwards = () => {
    onNext();
    navigate(nextTarget);
  }

  return (
    <div className={classes.wrapper}>
      <Button onClick={navigateBackwards} disabled={backDisabled} variant="outlined">
        {backText}
      </Button>
      {children}
      <Button onClick={navigateForwards} disabled={nextDisabled} variant="raised" color="primary">
        {nextText}
      </Button>
    </div>
  );
};

const style = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: space(2),
    '& > :not(:last-child)': {
      marginRight: space(2),
    }
  },
});

export default withStyles(style)(StepperButtons);
