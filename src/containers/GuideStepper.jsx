import React from 'react';
import { connect } from 'react-redux';
import Stepper, { Step, StepLabel, StepContent } from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';

class GuideStepper extends React.Component {
  createSteps() {
    const steps = [
      {
        label: "Selecione uma região",
        content: `Utilize a ferramenta de desenho de polígono ou retângulo para
                  especificar a região de interesse.`
      }, {
        label: "Obtenha as imagens",
        content: `Utilize o botão acima para consultar o banco de imagens de
                  satélite e obter as imagens disponíveis.`
      }, {
        label: "Escolha uma imagem",
        content: `Selecione uma das imagens da lista à esquerda e carregue-a.
                  Alternativamente, você pode realizar uma análise temporal.`
      }
    ];

    return steps.map(({label, content}, i) => (
      <Step key={i}>
        <StepLabel>{label}</StepLabel>
        <StepContent>
          <Typography variant="body1">{content}</Typography>
        </StepContent>
      </Step>
    ));
  }

  render() {
    const { step } = this.props;

    if (step === undefined) {
      return null;
    }

    return (
      <Stepper activeStep={step} orientation="vertical">
        {this.createSteps()}
      </Stepper>
    );
  }
}

export default connect(state => {
  let step = undefined;

  if (state.user.authenticated) {
    step = !state.data.region ? 0
         : !state.data.satelliteData ? 1
         : state.data.images.length === 0 ? 2
         : undefined;
  }

  return {step};
})(GuideStepper);
