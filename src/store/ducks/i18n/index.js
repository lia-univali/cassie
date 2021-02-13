import i18next from 'i18next'

/**
 * Types
 */

const langType = (str) => `cassie/i18n/${str}`

export const Types = {
    SET_LANG: langType('SET_LANG')
}

/**
 * Actions
 */

export const Actions = {
    setLang: (lang) => {
        return { type: Types.SET_LANG, lang }
    }
}

/**
 * Reducer
 */

const initialState = {
    lang: 'pt-BR'
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SET_LANG: {
            i18next.changeLanguage(action.lang);
            return { ...state, lang: action.lang }
        }
        default: {
            return state;
        }
    }
}

export default reducer