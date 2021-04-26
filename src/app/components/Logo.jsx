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
          xmlns="http://www.w3.org/2000/svg"
          className={props.variant === "big" ? classes.big_logo : classes.logo}
          width="30.536"
          height="26.388"
          viewBox="0 0 30.536 26.388"
        >
          <g
            id="Grupo_1"
            data-name="Grupo 1"
            transform="translate(-272.394 -187.604)"
          >
            <path
              id="Caminho_13"
              data-name="Caminho 13"
              d="M52.34,12.44a12.3,12.3,0,0,1-7.43,12.44c-1.56-.81-1.35-2.71.27-3.44,1.31-.59,3-.31,3.54-1.21,1-1.5-.82-4.65.18-6.23a3.18,3.18,0,0,1,3.44-1.56Z"
              transform="translate(250 187.6)"
              fill="#028090"
            />
            <path
              id="Caminho_14"
              data-name="Caminho 14"
              d="M52.34,12.44A3.18,3.18,0,0,0,48.9,14c-1,1.58.77,4.73-.18,6.23-.56.9-2.23.62-3.54,1.21-1.62.73-1.83,2.63-.27,3.44a11.9,11.9,0,0,1-3.74.95c-1-1.33-1.84-2.27-1.5-3.8a3.25,3.25,0,0,1,2-2.3A12.37,12.37,0,0,0,45.16,18c1.72-2-.89-4.88.73-7.17C47.22,9,49,9.14,51.51,9a12.27,12.27,0,0,1,.83,3.44Z"
              transform="translate(250 187.6)"
              fill="#f0fcf9"
            />
            <path
              id="Caminho_15"
              data-name="Caminho 15"
              d="M49.73,5.92A11.73,11.73,0,0,1,51.51,9c-2.52.15-4.29,0-5.62,1.85-1.62,2.29,1,5.22-.73,7.17a12.37,12.37,0,0,1-3.44,1.72,3.25,3.25,0,0,0-2,2.3c-.34,1.53.46,2.47,1.5,3.8a12.16,12.16,0,0,1-4.4-.4c-1-2.24-2-5-.32-6.73s3.85-1.29,4.9-2.58c1.31-1.62.81-2.78.24-4.33a1.422,1.422,0,0,0-.11-.33c-.5-1.77.43-3,2.15-3.9s3.72-2.39,6-1.55Z"
              transform="translate(250 187.6)"
              fill="#02c39a"
            />
            <path
              id="Caminho_16"
              data-name="Caminho 16"
              d="M36.82,25.54v-.11c-1-2.24-2-5-.32-6.73s3.85-1.29,4.9-2.58c1.31-1.62.81-2.78.24-4.33a1.422,1.422,0,0,0-.11-.33c-.5-1.77.43-3,2.15-3.9s3.72-2.39,6-1.55"
              transform="translate(250 187.6)"
              fill="none"
              stroke="#293241"
              stroke-miterlimit="10"
              stroke-width="1"
            />
            <path
              id="Caminho_17"
              data-name="Caminho 17"
              d="M41.17,25.83c-1-1.33-1.84-2.27-1.5-3.8a3.25,3.25,0,0,1,2-2.3A12.37,12.37,0,0,0,45.16,18c1.72-2-.89-4.88.73-7.17C47.22,9,49,9.14,51.51,9h.28"
              transform="translate(250 187.6)"
              fill="none"
              stroke="#293241"
              stroke-miterlimit="10"
              stroke-width="1"
            />
            <path
              id="Caminho_18"
              data-name="Caminho 18"
              d="M44.92,24.89c-1.56-.81-1.35-2.71.27-3.44,1.31-.59,3-.31,3.54-1.21,1-1.5-.82-4.65.18-6.23a3.18,3.18,0,0,1,3.44-1.56"
              transform="translate(250 187.6)"
              fill="none"
              stroke="#293241"
              stroke-miterlimit="10"
              stroke-width="1"
            />
            <path
              id="Caminho_19"
              data-name="Caminho 19"
              d="M34,2.82a12.17,12.17,0,0,1,4.95-1.54A12.3,12.3,0,0,1,49.73,5.92,11.73,11.73,0,0,1,51.51,9a12.3,12.3,0,0,1-6.6,15.89,11.9,11.9,0,0,1-3.74.95,12.16,12.16,0,0,1-4.4-.4,12.33,12.33,0,0,1-9-13.11"
              transform="translate(250 187.6)"
              fill="none"
              stroke="#293241"
              stroke-miterlimit="10"
              stroke-width="1"
            />
            <path
              id="Caminho_20"
              data-name="Caminho 20"
              d="M32.48,4.81l1.75,1.33-1.51,2L31.9,9.21a2.73,2.73,0,0,1-3.41.76,3,3,0,0,1-.38-.24A2.72,2.72,0,0,1,27,7.56a2.66,2.66,0,0,1,.55-1.62l.84-1.11,1.49-2Z"
              transform="translate(250 187.6)"
              fill="none"
              stroke="#293241"
              stroke-miterlimit="10"
              stroke-width="1"
            />
            <path
              id="Caminho_21"
              data-name="Caminho 21"
              d="M38.45,12.56,32.72,8.13l-4.29-3.3L22.7.4"
              transform="translate(250 187.6)"
              fill="none"
              stroke="#293241"
              stroke-miterlimit="10"
              stroke-width="1"
            />
          </g>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={props.variant === "big" ? classes.big_logo : classes.logo}
          width="30.536"
          height="26.388"
          stroke="currentColor"
          viewBox="0 0 30.536 26.388"
        >
          <g
            id="Grupo_2"
            data-name="Grupo 2"
            transform="translate(-360.394 -181.604)"
          >
            <path
              id="Caminho_34"
              data-name="Caminho 34"
              d="M36.82,25.54v-.11c-1-2.24-2-5-.32-6.73s3.85-1.29,4.9-2.58c1.31-1.62.81-2.78.24-4.33a1.422,1.422,0,0,0-.11-.33c-.5-1.77.43-3,2.15-3.9s3.72-2.39,6-1.55"
              transform="translate(338 181.6)"
              fill="none"
              stroke-miterlimit="10"
              stroke-width="1"
            />
            <path
              id="Caminho_35"
              data-name="Caminho 35"
              d="M41.17,25.83c-1-1.33-1.84-2.27-1.5-3.8a3.25,3.25,0,0,1,2-2.3A12.37,12.37,0,0,0,45.16,18c1.72-2-.89-4.88.73-7.17C47.22,9,49,9.14,51.51,9h.28"
              transform="translate(338 181.6)"
              fill="none"
              stroke-miterlimit="10"
              stroke-width="1"
            />
            <path
              id="Caminho_36"
              data-name="Caminho 36"
              d="M44.92,24.89c-1.56-.81-1.35-2.71.27-3.44,1.31-.59,3-.31,3.54-1.21,1-1.5-.82-4.65.18-6.23a3.18,3.18,0,0,1,3.44-1.56"
              transform="translate(338 181.6)"
              fill="none"
              stroke-miterlimit="10"
              stroke-width="1"
            />
            <path
              id="Caminho_37"
              data-name="Caminho 37"
              d="M34,2.82a12.17,12.17,0,0,1,4.95-1.54A12.3,12.3,0,0,1,49.73,5.92,11.73,11.73,0,0,1,51.51,9a12.3,12.3,0,0,1-6.6,15.89,11.9,11.9,0,0,1-3.74.95,12.16,12.16,0,0,1-4.4-.4,12.33,12.33,0,0,1-9-13.11"
              transform="translate(338 181.6)"
              fill="none"
              stroke-miterlimit="10"
              stroke-width="1"
            />
            <path
              id="Caminho_38"
              data-name="Caminho 38"
              d="M32.48,4.81l1.75,1.33-1.51,2L31.9,9.21a2.73,2.73,0,0,1-3.41.76,3,3,0,0,1-.38-.24A2.72,2.72,0,0,1,27,7.56a2.66,2.66,0,0,1,.55-1.62l.84-1.11,1.49-2Z"
              transform="translate(338 181.6)"
              fill="none"
              stroke-miterlimit="10"
              stroke-width="1"
            />
            <path
              id="Caminho_39"
              data-name="Caminho 39"
              d="M38.45,12.56,32.72,8.13l-4.29-3.3L22.7.4"
              transform="translate(338 181.6)"
              fill="none"
              stroke-miterlimit="10"
              stroke-width="1"
            />
          </g>
        </svg>
      )}
    </div>
  );
}
