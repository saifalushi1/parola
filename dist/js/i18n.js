const strings={en:{home:'Overview',learn:'Learning path',practice:'Practice',phrasebook:'Phrasebook',alphabet:'Alphabet & sounds',grammar:'Grammar notes',stats:'Your progress',settings:'Settings'}};
export const t=(key,locale='en')=>strings[locale]?.[key]??strings.en[key]??key;
