import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Redirect, Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel'
import SatelliteChooser from './SatelliteChooser';
import AOIChooser from './AOIChooser';
import PeriodChooser from './PeriodChooser';
import ImageListRefiner from './ImageListRefiner';
import Footer from '../components/Footer';
import { withAcquisition, withUser } from '../actions';
import { space } from '../theme';
import { getAcquisitionParameters } from '../selectors';

export const PREVIOUS = -1;
export const FIRST = 0;
export const NEXT = 1;
export const FINALIZE = 2;

class AcquisitionPage extends React.Component {
  constructor(props) {
    super(props);

    this.steps = [{
      label: "Escolha o satélite",
      content: "Selecione um dos satélites disponíveis para a aquisição de imagens.",
      component: SatelliteChooser,
    }, {
      label: "Defina a área de interesse",
      content: "Delimite a área de interesse utilizando o mapa abaixo.",
      requires: "satellite",
      component: AOIChooser,
    }, {
      label: "Defina o período",
      content: "Especifique a data de início e data de término do conjunto de imagens.",
      requires: "geometry",
      component: PeriodChooser,
    }, {
      label: "Filtre as imagens",
      content: "Aplique filtros para manter somente as imagens apropriadas.",
      requires: "availableDates",
      component: ImageListRefiner,

    }];
  }

  stepAttendsRequirements() {
    const { params } = this.props.match;

    const hasStep = params.step !== undefined;
    const step = hasStep ? params.step - 1 : 0;

    const stepData = this.steps[step];
    return (!("requires" in stepData) || stepData.requires in this.props);
  }

  componentDidMount() {
    this.props.user.login();

    if (!this.stepAttendsRequirements()) {
      this.navigate(FIRST);
    }
  }

  extractPath(hasStep) {
    const { match } = this.props;

    return hasStep ? match.url.substring(0, match.url.lastIndexOf("/")) : match.url;
  }

  navigate(direction) {
    const path = this.extractPath(true);
    const { step } = this.props.match.params;

    if (direction === NEXT || direction === PREVIOUS) {
      this.props.push(`${path}/${parseInt(step, 10) + direction}`);
    } else if (direction === FIRST) {
      this.props.push(`${path}/1`);
    } else if (direction === FINALIZE) {
      this.props.push("/main/processing");
    }
  }

  renderStep(props, Component) {
    if (this.stepAttendsRequirements()) {
      return <Component {...props} navigate={direction => this.navigate(direction)} />;
    }

    return null;
  }

  makeRoutes(hasStep) {
    const path = this.extractPath(hasStep);

    return this.steps.map((el, i) => {
      const id = i + 1;
      const Component = el.component;

      return (
        <Route key={id} path={`${path}/${id}`} render={props => this.renderStep(props, Component)} />
      );
    }).concat(
      <Redirect key={0} from={path} to={path + "/1"} />
    );
  }

  render() {
    const { classes, match } = this.props;
    console.log(this.props);

    const hasStep = match.params.step !== undefined;
    const step = hasStep ? match.params.step - 1 : 0;

    return (
      <div className={classes.wrapper}>
        <Grid container spacing={0} justify="center">
          <Grid item xs={12} className={classes.header}>
            <div>
              <Typography variant="display2" align="center" className={classes.title}>
                Aquisição de Imagens
              </Typography>
            </div>
          </Grid>
          <Grid item className="vcenter flow-column">
            <Paper className={classes.content} elevation={1}>
              <Stepper activeStep={step}>
                {this.steps.map((el, i) => (
                  <Step key={i}>
                    <StepLabel>{el.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Typography variant="subheading" align="center" className={classes.instructions}>
                {this.steps[step].content}
              </Typography>

              <Divider />

              <Switch>
                {this.makeRoutes(hasStep)}
              </Switch>
            </Paper>

          </Grid>
        </Grid>

        <Footer />
      </div>
    )
  }
}

const styles = theme => {
  console.log(theme);
  return {
    wrapper: {
      display: "flex",
      flexFlow: "column",
      flexGrow: 1,
    },
    header: {
      backgroundColor: theme.palette.primary[400],
      padding: space(6, 0, 16),
    },
    title: {
      color: "white",
    },
    content: {
      width: 1000,
      marginTop: space(-9),
    },
    instructions: {
      paddingTop: space(2),
      marginBottom: space(4),
    }
  };
};

const connector = connect(getAcquisitionParameters, { push });

const enhancer = compose(
  connector,
  withUser(),
  withAcquisition(),
  withStyles(styles),
);

export default enhancer(AcquisitionPage);
