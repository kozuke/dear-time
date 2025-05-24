export interface AgeTimeData {
  ageLabel: string; // 例: "〜3ヶ月", "1歳"
  startAgeYears: number; // この区分の開始年齢（年単位、例: 0, 0.25, 1）
  endAgeYears: number;   // この区分の終了年齢（年単位、例: 0.25, 1, 2）
  totalContactHoursInPeriod: number; // この期間全体の総接触時間
}

export const ageSpecificTimeData: AgeTimeData[] = [
  { ageLabel: "〜3ヶ月",    startAgeYears: 0,    endAgeYears: 0.25, totalContactHoursInPeriod: 720 + 360 },    // 1080
  { ageLabel: "4ヶ月〜1歳", startAgeYears: 0.25, endAgeYears: 1,    totalContactHoursInPeriod: 875 + 1000 },   // 1875
  { ageLabel: "1歳",        startAgeYears: 1,    endAgeYears: 2,    totalContactHoursInPeriod: 940 + 1300 },   // 2240
  { ageLabel: "2歳",        startAgeYears: 2,    endAgeYears: 3,    totalContactHoursInPeriod: 940 + 1300 },   // 2240
  { ageLabel: "3歳",        startAgeYears: 3,    endAgeYears: 4,    totalContactHoursInPeriod: 940 + 1300 },   // 2240
  { ageLabel: "4歳",        startAgeYears: 4,    endAgeYears: 5,    totalContactHoursInPeriod: 705 + 1040 },   // 1745
  { ageLabel: "5歳",        startAgeYears: 5,    endAgeYears: 6,    totalContactHoursInPeriod: 705 + 1040 },   // 1745
  { ageLabel: "6歳",        startAgeYears: 6,    endAgeYears: 7,    totalContactHoursInPeriod: 705 + 1040 },   // 1745
  { ageLabel: "7歳",        startAgeYears: 7,    endAgeYears: 8,    totalContactHoursInPeriod: 587.5 + 910 },  // 1497.5
  { ageLabel: "8歳",        startAgeYears: 8,    endAgeYears: 9,    totalContactHoursInPeriod: 587.5 + 910 },  // 1497.5
  { ageLabel: "9歳",        startAgeYears: 9,    endAgeYears: 10,   totalContactHoursInPeriod: 587.5 + 910 },  // 1497.5
  { ageLabel: "10歳",       startAgeYears: 10,   endAgeYears: 11,   totalContactHoursInPeriod: 352.5 + 650 },  // 1002.5
  { ageLabel: "11歳",       startAgeYears: 11,   endAgeYears: 12,   totalContactHoursInPeriod: 352.5 + 650 },  // 1002.5
  { ageLabel: "12歳",       startAgeYears: 12,   endAgeYears: 13,   totalContactHoursInPeriod: 352.5 + 650 },  // 1002.5
  { ageLabel: "13歳",       startAgeYears: 13,   endAgeYears: 14,   totalContactHoursInPeriod: 235 + 390 },    // 625
  { ageLabel: "14歳",       startAgeYears: 14,   endAgeYears: 15,   totalContactHoursInPeriod: 235 + 390 },    // 625
  { ageLabel: "15歳",       startAgeYears: 15,   endAgeYears: 16,   totalContactHoursInPeriod: 235 + 390 },    // 625
  { ageLabel: "16歳",       startAgeYears: 16,   endAgeYears: 17,   totalContactHoursInPeriod: 117.5 + 260 },  // 377.5
  { ageLabel: "17歳",       startAgeYears: 17,   endAgeYears: 18,   totalContactHoursInPeriod: 117.5 + 260 },  // 377.5
  { ageLabel: "18歳",       startAgeYears: 18,   endAgeYears: 19,   totalContactHoursInPeriod: 117.5 + 260 },  // 377.5
];

// 特別期間（19〜22歳）の定義
export const SPECIAL_PERIOD_HOURS_PER_YEAR = 100;
export const SPECIAL_PERIOD_START_AGE_YEARS = 19;
// ageLimit はこの値まで許容するが、計算上は22歳の誕生日まで
export const SPECIAL_PERIOD_DEFINITION_END_AGE_YEARS = 22;

// 全期間（0歳から22歳まで）の総接触時間と年数（CALC_DEFINITION.mdに基づく）
// これを年月日の変換基準にする
export const TOTAL_DEFINED_HOURS_UP_TO_22 = 25817.5;
export const TOTAL_DEFINED_YEARS = 22; 