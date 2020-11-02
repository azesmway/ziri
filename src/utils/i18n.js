import I18n from 'i18n-js'
import * as RNLocalize from 'react-native-localize'

import en from './locales/en'
import ru from './locales/ru'
import ua from './locales/ua'

const locales = RNLocalize.getLocales()

if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag
}

I18n.fallbacks = true
I18n.translations = {
  en,
  ru,
  ua
}

export function t(name, params = {}) {
  return I18n.t(name, params)
}

export default I18n
