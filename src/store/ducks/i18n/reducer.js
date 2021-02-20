import i18n from 'i18next'
import { Types } from './header'

const INITIAL_STATE = {
  lang: 'pt-BR'
}

export const reducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case Types.SET_LANG: {
      i18n.changeLanguage(payload.lang)
      return { ...state, lang: payload.lang }
    }
    default: {
        return state
    }
  }
}

export default reducer