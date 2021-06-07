import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  logo: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    display: "inline-block",
    marginRight: theme.spacing(1),
  },
  big_logo: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    display: "inline-block",
  },
  wrap: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function Logo(props) {
  const classes = useStyles();
  return (
    <div className={classes.wrap}>
      {props.kind === "filled" ? (
        <svg
          id="logo"
          data-name="Grupo 1"
          xmlns="http://www.w3.org/2000/svg"
          className={props.variant === "big" ? classes.big_logo : classes.logo}
          width="53"
          height="49"
          viewBox="0 0 53 49"
        >
          <rect
            id="Retângulo_1"
            data-name="Retângulo 1"
            width="53"
            height="49"
            fill="none"
          />
          <path
            id="wave"
            data-name="Caminho 1"
            d="M75.35,37.34c-1.37-3-2.76-6.75-.48-9s5.07-1.71,6.46-3.42c1.74-2.14,1.07-3.66.32-5.71-1-2.58.28-4.27,2.69-5.59s4.5-2.44,7.61-2.1c0,0,5.87,10.57-1.13,18.89S75.35,37.34,75.35,37.34Z"
            transform="translate(-49.887 5.391)"
            fill="#02c39a"
            stroke="#293241"
            stroke-miterlimit="10"
            stroke-width="2"
          />
          <path
            id="globe"
            data-name="Caminho 2"
            d="M67.92,4.26A17.73,17.73,0,1,1,59,21.3a17.34,17.34,0,0,1,0-3.38"
            transform="translate(-49.887 5.391)"
            fill="none"
            stroke="#293241"
            stroke-miterlimit="10"
            stroke-width="2"
          />
          <path
            id="sat-body"
            data-name="Caminho 3"
            d="M68.25,9,64.9,13.45a3.89,3.89,0,0,1-5.44.74h0a3.89,3.89,0,0,1-.74-5.44l3.34-4.41Z"
            transform="translate(-49.887 5.391)"
            fill="none"
            stroke="#293241"
            stroke-miterlimit="10"
            stroke-width="2"
          />
          <line
            id="sat"
            data-name="Linha 1"
            x1="22.64"
            y1="17.48"
            transform="translate(1.793 6.181)"
            fill="none"
            stroke="#293241"
            stroke-miterlimit="10"
            stroke-width="2"
          />
        </svg>
      ) : (
        <svg
          id="logo"
          data-name="Grupo 1"
          xmlns="http://www.w3.org/2000/svg"
          className={props.variant === "big" ? classes.big_logo : classes.logo}
          width="53"
          height="49"
          viewBox="0 0 53 49"
        >
          <rect
            id="back"
            data-name="Retângulo 1"
            width="53"
            height="49"
            fill="none"
          />
          <path
            id="wave"
            data-name="Caminho 1"
            d="M75.35,37.34c-1.37-3-2.76-6.75-.48-9s5.07-1.71,6.46-3.42c1.74-2.14,1.07-3.66.32-5.71-1-2.58.28-4.27,2.69-5.59s4.5-2.44,7.61-2.1c0,0,5.87,10.57-1.13,18.89S75.35,37.34,75.35,37.34Z"
            transform="translate(-49.887 5.391)"
            fill="#02c39a"
            stroke="#fff"
            stroke-miterlimit="10"
            stroke-width="2"
          />
          <path
            id="globe"
            data-name="Caminho 2"
            d="M67.92,4.26A17.73,17.73,0,1,1,59,21.3a17.34,17.34,0,0,1,0-3.38"
            transform="translate(-49.887 5.391)"
            fill="none"
            stroke="#fff"
            stroke-miterlimit="10"
            stroke-width="2"
          />
          <path
            id="sat-body"
            data-name="Caminho 3"
            d="M68.25,9,64.9,13.45a3.89,3.89,0,0,1-5.44.74h0a3.89,3.89,0,0,1-.74-5.44l3.34-4.41Z"
            transform="translate(-49.887 5.391)"
            fill="none"
            stroke="#fff"
            stroke-miterlimit="10"
            stroke-width="2"
          />
          <line
            id="sat"
            data-name="Linha 1"
            x1="22.64"
            y1="17.48"
            transform="translate(1.793 6.181)"
            fill="none"
            stroke="#fff"
            stroke-miterlimit="10"
            stroke-width="2"
          />
        </svg>
      )}
    </div>
  );
}
