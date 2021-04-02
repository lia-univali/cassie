import duckify from "../../tools/duckify";

export const namespace = "cassie";
export const store = "common";

export const Types = duckify(namespace, store, ["EVALUATE", "DONE"]);

export const Actions = {
  evaluate: () => ({
    type: Types.EVALUATE,
  }),
  done: () => ({
    type: Types.DONE,
  }),
};

export default Actions;
