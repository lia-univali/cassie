import duckify from "../../tools/duckify";

export const namespace = "cassie";
export const store = "i18n";

export const Types = duckify(namespace, store, ["SET_LANG"]);

export const Actions = {
  setLang: (lang) => ({
    type: Types.SET_LANG,
    payload: { lang },
  }),
};

export default Actions;
