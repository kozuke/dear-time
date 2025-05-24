import { addYears, intervalToDuration, isBefore } from 'date-fns';
import {
  ageSpecificTimeData,
  SPECIAL_PERIOD_HOURS_PER_YEAR,
  SPECIAL_PERIOD_START_AGE_YEARS,
  SPECIAL_PERIOD_DEFINITION_END_AGE_YEARS,
  TOTAL_DEFINED_HOURS_UP_TO_22,
  TOTAL_DEFINED_YEARS
} from '../data/ageSpecificTimeData';

interface RemainingTime {
  years: number;
  months: number;
  days: number;
  totalHours: number; // これは最終的な残り接触時間
  progressPercentage: number; // 進捗率（0-100の数値）
}

// 指定された年齢までの総接触時間（0歳から）を計算する
const calculateTotalContactHoursUpToAge = (limitAgeYears: number): number => {
  let cumulativeHours = 0;

  // 0歳から18歳まで
  for (const period of ageSpecificTimeData) {
    if (period.startAgeYears < limitAgeYears) {
      if (period.endAgeYears <= limitAgeYears) {
        cumulativeHours += period.totalContactHoursInPeriod;
      } else {
        // 期間の途中で ageLimit に達する場合
        const fraction = (limitAgeYears - period.startAgeYears) / (period.endAgeYears - period.startAgeYears);
        cumulativeHours += period.totalContactHoursInPeriod * fraction;
      }
    }
  }

  // 特別期間（19歳から limitAgeYears まで、ただし上限は SPECIAL_PERIOD_DEFINITION_END_AGE_YEARS）
  if (limitAgeYears > SPECIAL_PERIOD_START_AGE_YEARS) {
    const specialPeriodEffectiveEndAge = Math.min(limitAgeYears, SPECIAL_PERIOD_DEFINITION_END_AGE_YEARS);
    const specialPeriodDurationYears = specialPeriodEffectiveEndAge - SPECIAL_PERIOD_START_AGE_YEARS;
    if (specialPeriodDurationYears > 0) {
      cumulativeHours += specialPeriodDurationYears * SPECIAL_PERIOD_HOURS_PER_YEAR;
    }
  }
  return Math.floor(cumulativeHours);
};

// 今日までに消費された接触時間を計算する
const calculateConsumedContactHours = (birthDate: Date, today: Date): number => {
  let consumedHours = 0;
  const currentAgeMillis = today.getTime() - birthDate.getTime();
  const currentAgeYears = currentAgeMillis / (1000 * 60 * 60 * 24 * 365.25); //より正確な年計算

  // 0歳から18歳までの消費時間
  for (const period of ageSpecificTimeData) {
    if (currentAgeYears > period.startAgeYears) { // 現在の年齢が期間の開始後
      if (currentAgeYears >= period.endAgeYears) { // 期間全体が経過済み
        consumedHours += period.totalContactHoursInPeriod;
      } else { // 期間の途中
        const fractionConsumed = (currentAgeYears - period.startAgeYears) / (period.endAgeYears - period.startAgeYears);
        consumedHours += period.totalContactHoursInPeriod * fractionConsumed;
        break; // 現在進行中の期間なので、ここでループを抜ける
      }
    } else {
        break; // まだ到達していない期間
    }
  }

  // 特別期間（19歳以降）の消費時間
  if (currentAgeYears > SPECIAL_PERIOD_START_AGE_YEARS) {
    const consumedSpecialPeriodYears = Math.min(currentAgeYears, SPECIAL_PERIOD_DEFINITION_END_AGE_YEARS) - SPECIAL_PERIOD_START_AGE_YEARS;
    if (consumedSpecialPeriodYears > 0) {
        consumedHours += consumedSpecialPeriodYears * SPECIAL_PERIOD_HOURS_PER_YEAR;
    }
  }
  return Math.floor(consumedHours);
};

export const calculateRemainingTime = (birthDateString: string, ageLimit: number): RemainingTime => {
  const birth = new Date(birthDateString);
  const today = new Date();

  // 生年月日が今日より後の場合は、今日の日付を使用
  const effectiveBirthDate = birth > today ? today : birth;

  // 1. 0歳から目標年齢 (ageLimit) までの総接触時間を計算
  const totalPossibleHours = calculateTotalContactHoursUpToAge(ageLimit);

  // 2. 今日までに消費された接触時間を計算
  const consumedHours = calculateConsumedContactHours(effectiveBirthDate, today);

  // 3. 残りの接触時間
  let remainingHours = totalPossibleHours - consumedHours;
  remainingHours = Math.max(0, Math.floor(remainingHours)); // マイナスにならないように、かつ小数点以下切り捨て

  // 4. 進捗率を計算（残り時間 ÷ 総接触時間 × 100）
  const remainingPercentage = Math.floor((remainingHours / totalPossibleHours) * 100);
  const progressPercentage = 100 - remainingPercentage;

  // --- ここから年月日計算ロジックを変更 ---
  let years = 0;
  let months = 0;
  let days = 0;

  if (remainingHours > 0) {
    // 1年の平均時間数（24時間 × 365.25日）
    const hoursPerYear = 24 * 365.25;
    
    // 年数を計算（小数点以下切り捨て）
    years = Math.floor(remainingHours / hoursPerYear);
    
    // 残りの時間から月数を計算（小数点以下切り捨て）
    const remainingHoursAfterYears = remainingHours % hoursPerYear;
    const hoursPerMonth = hoursPerYear / 12;
    months = Math.floor(remainingHoursAfterYears / hoursPerMonth);
    
    // 残りの時間から日数を計算（小数点以下切り捨て）
    const remainingHoursAfterMonths = remainingHoursAfterYears % hoursPerMonth;
    const hoursPerDay = 24;
    days = Math.floor(remainingHoursAfterMonths / hoursPerDay);
  }

  return {
    years,
    months,
    days,
    totalHours: remainingHours,
    progressPercentage: Math.min(100, progressPercentage),
  };
};

// 特定の年の年末時点での進捗率を計算する
export const calculateProgressAtYearEnd = (birthDateString: string, targetYear: number, ageLimit: number): number => {
  const birth = new Date(birthDateString);
  const yearEndDate = new Date(targetYear, 11, 31); // 12月31日（月は0から始まるため11）

  // 年末時点で既にageLimitを超えている場合は100%を返す
  const targetDate = new Date(birth);
  targetDate.setFullYear(birth.getFullYear() + ageLimit);
  if (yearEndDate > targetDate) {
    return 100;
  }

  // 1. 0歳から目標年齢までの総接触時間を計算
  const totalPossibleHours = calculateTotalContactHoursUpToAge(ageLimit);

  // 2. 年末時点までの消費時間を計算
  const consumedHours = calculateConsumedContactHours(birth, yearEndDate);

  // 3. 残り時間の割合を計算し、進捗率を返す
  const remainingHours = totalPossibleHours - consumedHours;
  const remainingPercentage = Math.floor((remainingHours / totalPossibleHours) * 100);
  return Math.min(100, 100 - remainingPercentage);
};

// 0歳から目標年齢までの各年齢時点での進捗率を計算する
export interface AgeProgression {
  age: number;
  progressPercentage: number;
}

export const calculateProgressionsByAge = (birthDateString: string, ageLimit: number): AgeProgression[] => {
  const birth = new Date(birthDateString);
  const progressions: AgeProgression[] = [];

  // 0歳から目標年齢までの総接触時間を計算
  const totalPossibleHours = calculateTotalContactHoursUpToAge(ageLimit);

  // 各年齢時点での進捗率を計算
  for (let age = 0; age <= ageLimit; age++) {
    const targetDate = new Date(birth);
    targetDate.setFullYear(birth.getFullYear() + age);
    
    // その年齢時点までの消費時間を計算
    const consumedHours = calculateConsumedContactHours(birth, targetDate);
    
    // 残り時間の割合を計算し、進捗率を算出
    const remainingHours = totalPossibleHours - consumedHours;
    const remainingPercentage = Math.floor((remainingHours / totalPossibleHours) * 100);
    const progressPercentage = Math.min(100, 100 - remainingPercentage);
    
    progressions.push({
      age,
      progressPercentage
    });
  }

  return progressions;
}; 