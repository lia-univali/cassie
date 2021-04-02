import React from "react";

import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@material-ui/core";

// @TODO unused component
const GuideStepper = ({ step }) => {
  const createSteps = () => {
    const steps = [
      {
        label: "Selecione uma região",
        content: `Utilize a ferramenta de desenho de polígono ou retângulo para
                  especificar a região de interesse.`,
      },
      {
        label: "Obtenha as imagens",
        content: `Utilize o botão acima para consultar o banco de imagens de
                  satélite e obter as imagens disponíveis.`,
      },
      {
        label: "Escolha uma imagem",
        content: `Selecione uma das imagens da lista à esquerda e carregue-a.
                  Alternativamente, você pode realizar uma análise temporal.`,
      },
    ];

    return steps.map(({ label, content }, i) => (
      <Step key={i}>
        <StepLabel>{label}</StepLabel>
        <StepContent>
          <Typography variant="body1">{content}</Typography>
        </StepContent>
      </Step>
    ));
  };

  return !step ? null : (
    <Stepper activeStep={step} orientation="vertical">
      {createSteps()}
    </Stepper>
  );
};

export default GuideStepper;
