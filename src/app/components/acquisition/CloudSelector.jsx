import React from "react";
import { useTranslation } from "react-i18next";

import {
  Input,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";

const CloudSelector = ({ level, onChange = () => {} }) => {
  const [t] = useTranslation();

  const createItems = () => {
    return [0, 0.025, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 1].map(
      (value, i) => (
        <MenuItem key={i} value={value}>
          {`<= ${value * 100} %`}
        </MenuItem>
      )
    );
  };

  return (
    <div id="cloudselector">
      <FormControl style={{ minWidth: 140, marginBottom: 16 }}>
        <InputLabel htmlFor="cloud-select">
          {t("forms.acquisition.3.cloudPercentage")}
        </InputLabel>
        <Select
          input={<Input name="cloud" id="cloud-select" />}
          onChange={(e) => onChange(e.target.value)}
          value={level}
        >
          {createItems()}
        </Select>
      </FormControl>
    </div>
  );
};

export default CloudSelector;
