/**
 * Translations for the whole app.
 *
 * Structure:  messages[languageCode][key] = text
 *   - Language codes: 'en' (English), 'fil' (Filipino), 'es' (Spanish), 'ja' (Japanese)
 *   - Keys look like 'nav.logIn' or 'onboarding.finish', written as "<area>.<name>"
 *   - {placeholders} such as {max} or {name} are filled in by locale.t(key, { max: 8 })
 *
 * Rules:
 *   - English ('en') is the main list. Every key must exist in 'en'.
 *   - If another language is missing a key, the app shows the English text.
 *   - A language that is not listed here shows the whole app in English.
 *
 * To add a language: copy the 'en' block, change the code, translate the values.
 * To add a text: add the key to 'en' first, then to the other languages.
 *
 * Used by: src/stores/locale.js (do not import this file directly in pages;
 * use useLocaleStore().t('key') instead).
 */

export const messages = {
  en: {
    // Navigation bar
    'nav.discover': 'Discover',
    'nav.forYou': 'For You',
    'nav.watchlist': 'Watchlist',
    'nav.watchTogether': 'Watch Together',
    'nav.moderation': 'Moderation',
    'nav.logIn': 'Log In',
    'nav.register': 'Register',
    'nav.profile': 'Profile',
    'nav.logOut': 'Log out',
    'nav.accountMenu': 'Account menu',
    'nav.main': 'Main',

    // Search bar
    'search.label': 'Search',
    'search.placeholder': 'Search for movies & more',

    // Onboarding page
    'onboarding.welcome': 'WELCOME',
    'onboarding.subtitle': 'Tell us your preferences so we can recommend the best movies and shows just for you.',
    'onboarding.genresTitle': '01 / Choose your favorite genres',
    'onboarding.genresHint': 'Pick 1 to {max} genres · {count} selected',
    'onboarding.others': 'Others +',
    'onboarding.otherGenreLabel': 'Specify the genre you enjoy',
    'onboarding.otherGenrePlaceholder': 'Enter a genre...',
    'onboarding.addGenre': 'Add genre',
    'onboarding.providersTitle': '02 / Where do you watch?',
    'onboarding.providersHint': 'Select all that you have.',
    'onboarding.othersTile': 'Others',
    'onboarding.otherProviderLabel': 'Specify where you watch',
    'onboarding.otherProviderPlaceholder': 'Enter a streaming service...',
    'onboarding.addProvider': 'Add streaming service',
    'onboarding.regionTitle': '03 / Which region are you in?',
    'onboarding.regionHint': 'This helps us show the right content and releases for your location.',
    'onboarding.region': 'Region',
    'onboarding.language': 'Language',
    'onboarding.blurSpoilers': 'Blur spoilers by default',
    'onboarding.skip': 'Skip for now',
    'onboarding.finish': '→ Finish',
    'onboarding.saved': 'Preferences saved',
    'onboarding.pickAtLeastOne': 'Pick at least 1 genre.',
    'onboarding.maxGenres': 'You can pick up to {max} genres.',
    'onboarding.alreadySelected': '"{name}" is already selected.',
    'onboarding.noTranslation': 'Translation for {language} is not available yet. The app will be shown in English.',
  },

  fil: {
    // Navigation bar
    'nav.discover': 'Tuklasin',
    'nav.forYou': 'Para sa Iyo',
    'nav.watchlist': 'Watchlist',
    'nav.watchTogether': 'Sabay-sabay Manood',
    'nav.moderation': 'Moderasyon',
    'nav.logIn': 'Mag-log In',
    'nav.register': 'Mag-rehistro',
    'nav.profile': 'Profile',
    'nav.logOut': 'Mag-log out',
    'nav.accountMenu': 'Menu ng account',
    'nav.main': 'Pangunahin',

    // Search bar
    'search.label': 'Maghanap',
    'search.placeholder': 'Maghanap ng pelikula at iba pa',

    // Onboarding page
    'onboarding.welcome': 'MALIGAYANG PAGDATING',
    'onboarding.subtitle': 'Sabihin sa amin ang iyong mga gusto para maibigay namin ang pinakamagagandang pelikula at palabas para sa iyo.',
    'onboarding.genresTitle': '01 / Piliin ang paborito mong genre',
    'onboarding.genresHint': 'Pumili ng 1 hanggang {max} genre · {count} ang napili',
    'onboarding.others': 'Iba pa +',
    'onboarding.otherGenreLabel': 'Tukuyin ang genre na gusto mo',
    'onboarding.otherGenrePlaceholder': 'Maglagay ng genre...',
    'onboarding.addGenre': 'Magdagdag ng genre',
    'onboarding.providersTitle': '02 / Saan ka nanonood?',
    'onboarding.providersHint': 'Piliin ang lahat ng mayroon ka.',
    'onboarding.othersTile': 'Iba pa',
    'onboarding.otherProviderLabel': 'Tukuyin kung saan ka nanonood',
    'onboarding.otherProviderPlaceholder': 'Maglagay ng streaming service...',
    'onboarding.addProvider': 'Magdagdag ng streaming service',
    'onboarding.regionTitle': '03 / Saang rehiyon ka?',
    'onboarding.regionHint': 'Nakakatulong ito para maipakita namin ang tamang nilalaman at paglabas para sa iyong lokasyon.',
    'onboarding.region': 'Rehiyon',
    'onboarding.language': 'Wika',
    'onboarding.blurSpoilers': 'I-blur ang mga spoiler bilang default',
    'onboarding.skip': 'Laktawan muna',
    'onboarding.finish': '→ Tapusin',
    'onboarding.saved': 'Nai-save ang mga kagustuhan',
    'onboarding.pickAtLeastOne': 'Pumili ng kahit 1 genre.',
    'onboarding.maxGenres': 'Hanggang {max} genre lang ang maaari mong piliin.',
    'onboarding.alreadySelected': 'Napili na ang "{name}".',
  },

  es: {
    // Navigation bar
    'nav.discover': 'Descubrir',
    'nav.forYou': 'Para ti',
    'nav.watchlist': 'Lista de seguimiento',
    'nav.watchTogether': 'Ver juntos',
    'nav.moderation': 'Moderación',
    'nav.logIn': 'Iniciar sesión',
    'nav.register': 'Registrarse',
    'nav.profile': 'Perfil',
    'nav.logOut': 'Cerrar sesión',
    'nav.accountMenu': 'Menú de cuenta',
    'nav.main': 'Principal',

    // Search bar
    'search.label': 'Buscar',
    'search.placeholder': 'Busca películas y más',

    // Onboarding page
    'onboarding.welcome': 'BIENVENIDO',
    'onboarding.subtitle': 'Cuéntanos tus preferencias para recomendarte las mejores películas y series.',
    'onboarding.genresTitle': '01 / Elige tus géneros favoritos',
    'onboarding.genresHint': 'Elige de 1 a {max} géneros · {count} seleccionados',
    'onboarding.others': 'Otros +',
    'onboarding.otherGenreLabel': 'Indica el género que te gusta',
    'onboarding.otherGenrePlaceholder': 'Escribe un género...',
    'onboarding.addGenre': 'Añadir género',
    'onboarding.providersTitle': '02 / ¿Dónde ves contenido?',
    'onboarding.providersHint': 'Selecciona todos los que tengas.',
    'onboarding.othersTile': 'Otros',
    'onboarding.otherProviderLabel': 'Indica dónde ves contenido',
    'onboarding.otherProviderPlaceholder': 'Escribe un servicio de streaming...',
    'onboarding.addProvider': 'Añadir servicio de streaming',
    'onboarding.regionTitle': '03 / ¿En qué región estás?',
    'onboarding.regionHint': 'Esto nos ayuda a mostrar el contenido y los estrenos adecuados para tu ubicación.',
    'onboarding.region': 'Región',
    'onboarding.language': 'Idioma',
    'onboarding.blurSpoilers': 'Difuminar spoilers por defecto',
    'onboarding.skip': 'Omitir por ahora',
    'onboarding.finish': '→ Finalizar',
    'onboarding.saved': 'Preferencias guardadas',
    'onboarding.pickAtLeastOne': 'Elige al menos 1 género.',
    'onboarding.maxGenres': 'Puedes elegir hasta {max} géneros.',
    'onboarding.alreadySelected': '"{name}" ya está seleccionado.',
  },

  ja: {
    // Navigation bar
    'nav.discover': '見つける',
    'nav.forYou': 'おすすめ',
    'nav.watchlist': 'ウォッチリスト',
    'nav.watchTogether': '一緒に見る',
    'nav.moderation': 'モデレーション',
    'nav.logIn': 'ログイン',
    'nav.register': '新規登録',
    'nav.profile': 'プロフィール',
    'nav.logOut': 'ログアウト',
    'nav.accountMenu': 'アカウントメニュー',
    'nav.main': 'メイン',

    // Search bar
    'search.label': '検索',
    'search.placeholder': '映画などを検索',

    // Onboarding page
    'onboarding.welcome': 'ようこそ',
    'onboarding.subtitle': '好みを教えてください。あなたにぴったりの映画や番組をおすすめします。',
    'onboarding.genresTitle': '01 / お気に入りのジャンルを選ぶ',
    'onboarding.genresHint': '1〜{max}個のジャンルを選択 · {count}個選択中',
    'onboarding.others': 'その他 +',
    'onboarding.otherGenreLabel': '好きなジャンルを入力',
    'onboarding.otherGenrePlaceholder': 'ジャンルを入力...',
    'onboarding.addGenre': 'ジャンルを追加',
    'onboarding.providersTitle': '02 / どこで視聴しますか？',
    'onboarding.providersHint': '利用中のものをすべて選択してください。',
    'onboarding.othersTile': 'その他',
    'onboarding.otherProviderLabel': '視聴しているサービスを入力',
    'onboarding.otherProviderPlaceholder': 'ストリーミングサービスを入力...',
    'onboarding.addProvider': 'サービスを追加',
    'onboarding.regionTitle': '03 / どの地域にお住まいですか？',
    'onboarding.regionHint': 'お住まいの地域に合った作品や公開情報を表示するために使用します。',
    'onboarding.region': '地域',
    'onboarding.language': '言語',
    'onboarding.blurSpoilers': 'ネタバレをデフォルトでぼかす',
    'onboarding.skip': '今はスキップ',
    'onboarding.finish': '→ 完了',
    'onboarding.saved': '設定を保存しました',
    'onboarding.pickAtLeastOne': 'ジャンルを1つ以上選択してください。',
    'onboarding.maxGenres': 'ジャンルは最大{max}個まで選べます。',
    'onboarding.alreadySelected': '「{name}」はすでに選択されています。',
  },
}

/**
 * Display names for genres, per language.
 * Only the text shown on screen is translated. The value that is saved
 * (in preferences and in the catalog) always stays in English.
 * Genres missing here are shown in English.
 */
export const genreNames = {
  fil: {
    Action: 'Aksyon', Adventure: 'Pakikipagsapalaran', Animation: 'Animasyon', Comedy: 'Komedya',
    Crime: 'Krimen', Documentary: 'Dokumentaryo', Drama: 'Drama', Family: 'Pampamilya',
    Fantasy: 'Pantasya', History: 'Kasaysayan', Horror: 'Katatakutan', Music: 'Musika',
    Mystery: 'Misteryo', Romance: 'Romansa', 'Sci-Fi': 'Sci-Fi', Thriller: 'Thriller',
    War: 'Digmaan', Western: 'Western',
  },
  es: {
    Action: 'Acción', Adventure: 'Aventura', Animation: 'Animación', Comedy: 'Comedia',
    Crime: 'Crimen', Documentary: 'Documental', Drama: 'Drama', Family: 'Familiar',
    Fantasy: 'Fantasía', History: 'Historia', Horror: 'Terror', Music: 'Música',
    Mystery: 'Misterio', Romance: 'Romance', 'Sci-Fi': 'Ciencia ficción', Thriller: 'Suspenso',
    War: 'Bélica', Western: 'Western',
  },
  ja: {
    Action: 'アクション', Adventure: 'アドベンチャー', Animation: 'アニメーション', Comedy: 'コメディ',
    Crime: 'クライム', Documentary: 'ドキュメンタリー', Drama: 'ドラマ', Family: 'ファミリー',
    Fantasy: 'ファンタジー', History: '歴史', Horror: 'ホラー', Music: '音楽',
    Mystery: 'ミステリー', Romance: 'ロマンス', 'Sci-Fi': 'SF', Thriller: 'スリラー',
    War: '戦争', Western: '西部劇',
  },
}