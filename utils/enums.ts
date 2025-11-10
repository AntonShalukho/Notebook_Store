export enum Timeout {
  ONE = 1000,
  TWO = 2000,
  THREE = 3000,
  FIVE = 5000,
  TEN = 10000,
  FIFTEEN = 15000,
  TWENTY = 20000,
  THIRTY = 30000,
  FORTY = 40000,
  SIXTY = 60000,
  NINETY = 90000,
  HUNDRED_TWENTY = 120000,
  HUNDRED_EIGHTY = 180000,
}

/**
 * Disabled some item types since we want to test discount items
 */
export enum ItemTypes {
  NOTEPAD = 'Записные книжки',
  WEEKLIES = 'Еженедельники',
  SPIRAL_NOTEBOOKS = 'Блокноты на спирали',
  // MUSIC_NOTEBOOKS = 'Нотные тетради',
  UNDATED_DIARIES = 'Недатированные ежедневники',
  // NOTEBOOKS = 'Тетради',
}
