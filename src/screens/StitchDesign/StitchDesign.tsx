import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { useStore } from "../../store/useStore";
import { Header } from "../../components/ui/header";
import { calculateRemainingTime, calculateProgressionsByAge, type AgeProgression } from "../../utils/timeCalculator";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";

const messages = [
  "今日の笑顔が、ずっと心に残ります",
  "そばにいる時間が、いちばんの贈りもの",
  "一緒にいる分だけ、心が近づいていきます",
];

// カラーパレットの定義
const colors = {
  primary: "#896b60",
  secondary: "#FFE4E1",
  accent: "#07870a",
  background: "rgba(255, 244, 234, 0.8)",
  milestone: {
    text: "#896b60",
    background: "rgba(137, 107, 96, 0.1)",
    line: "rgba(137, 107, 96, 0.2)",
  },
  graph: {
    line: "#896b60",
    point: {
      default: "#896b60",
      current: "#07870a",
    },
    area: "rgba(137, 107, 96, 0.1)",
  },
};

const getProgressDisplay = (progressPercentage: number) => {
  const remainingPercentage = 100 - progressPercentage;
  if (remainingPercentage > 0 && remainingPercentage < 1) {
    return "1%未満";
  }
  return `${remainingPercentage}%`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.isCurrentPoint) {
      // 現在時点の詳細な表示
      return (
        <div className="bg-white/90 p-2 rounded shadow-md border border-[#896b60]/20">
          <p className="text-[#896b60] font-medium">現在の時点</p>
          <p className="text-[#896b60]">{`${data.exactAge}歳`}</p>
          <p className="text-[#896b60]">{`残り時間: ${data.remaining.toFixed(1)}%`}</p>
        </div>
      );
    }
    // 通常の年齢ポイントの表示
    return (
      <div className="bg-white/90 p-2 rounded shadow-md border border-[#896b60]/20">
        <p className="text-[#896b60] font-medium">{`${data.age}歳`}</p>
        <p className="text-[#896b60]">{`残り時間: ${data.remaining}%`}</p>
      </div>
    );
  }
  return null;
};

interface ChartDataPoint {
  age: number;
  remaining: number;
  isCurrentPoint: boolean;
  exactAge?: string;
}

export const StitchDesign = (): JSX.Element => {
  const childInfo = useStore((state) => state.childInfo);
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  const [remainingTimeDisplay, setRemainingTimeDisplay] = useState("計算中...");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [ageProgressions, setAgeProgressions] = useState<AgeProgression[]>([]);
  const [currentAge, setCurrentAge] = useState(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (childInfo) {
      const { years, months, days, progressPercentage } = calculateRemainingTime(childInfo.birthDate, childInfo.ageLimit);
      setRemainingTimeDisplay(`${years} 年 ${months} ヶ月 ${days} 日`);
      setProgressPercentage(progressPercentage);

      const progressions = calculateProgressionsByAge(childInfo.birthDate, childInfo.ageLimit);
      setAgeProgressions(progressions);

      // 現在の年齢と経過月数を計算
      const birth = new Date(childInfo.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const exactAge = age + (monthDiff / 12);
      setCurrentAge(age);

      // Rechartsのデータ形式に変換（残り時間の割合を使用）
      const formattedData: ChartDataPoint[] = progressions.map(prog => ({
        age: prog.age,
        remaining: 100 - prog.progressPercentage,
        isCurrentPoint: false
      }));

      // 現在時点のデータを追加
      // 現在の年齢の前後のデータポイントを見つける
      const currentYearData = formattedData.find(d => d.age === Math.floor(exactAge));
      const nextYearData = formattedData.find(d => d.age === Math.ceil(exactAge));
      
      if (currentYearData && nextYearData) {
        // 線形補間で現在時点の残り時間を計算
        const fraction = exactAge - Math.floor(exactAge);
        const interpolatedRemaining = 
          currentYearData.remaining + 
          (nextYearData.remaining - currentYearData.remaining) * fraction;

        // 現在時点のデータを挿入
        const currentPointIndex = formattedData.findIndex(d => d.age > exactAge);
        const currentPoint: ChartDataPoint = {
          age: Math.floor(exactAge),
          exactAge: exactAge.toFixed(1),
          remaining: interpolatedRemaining,
          isCurrentPoint: true
        };
        formattedData.splice(currentPointIndex, 0, currentPoint);
      }

      setChartData(formattedData);
    }
  }, [childInfo]);

  // マイルストーン年齢を計算する関数
  const findMilestoneAge = (targetPercentage: number): number | null => {
    if (!ageProgressions.length) return null;
    
    for (let i = 0; i < ageProgressions.length - 1; i++) {
      const remainingPercent1 = 100 - ageProgressions[i].progressPercentage;
      const remainingPercent2 = 100 - ageProgressions[i + 1].progressPercentage;
      if (remainingPercent1 >= targetPercentage && remainingPercent2 < targetPercentage) {
        const p1 = ageProgressions[i];
        const p2 = ageProgressions[i + 1];
        const ratio = (remainingPercent1 - targetPercentage) / (remainingPercent1 - remainingPercent2);
        return Number((p1.age + ratio * (p2.age - p1.age)).toFixed(1));
      }
    }
    return null;
  };

  // マイルストーン年齢を計算
  const milestone75Age = findMilestoneAge(75);
  const milestone50Age = findMilestoneAge(50);
  const milestone25Age = findMilestoneAge(25);
  const milestone10Age = findMilestoneAge(10);

  return (
    <div className="flex flex-col items-start relative min-h-screen bg-gradient-to-br from-[#FFF5EA] to-[#FFE4E1]">
      <div className="flex flex-col min-h-[800px] items-start relative self-stretch w-full">
        <Header />

        <main className="items-start justify-center px-40 py-5 flex-1 grow flex relative self-stretch w-full">
          <div className="flex flex-col max-w-[960px] h-[695px] items-start relative flex-1 grow">
            <div className="flex flex-col items-center pt-5 pb-3 px-4 self-stretch w-full relative flex-[0_0_auto]">
              <h2 className="self-stretch mt-[-1.00px] font-bold text-[#896b60] text-[28px] text-center tracking-[0] leading-35px font-sans">
                {childInfo?.name}さんとの時間
              </h2>
            </div>

            <div className="flex flex-col items-center pt-1 pb-3 px-4 relative self-stretch w-full flex-[0_0_auto]">
              <p className="self-stretch mt-[-1.00px] font-normal text-[#896b60] text-base text-center tracking-[0] leading-6 font-sans">
                {childInfo?.name}さんが22歳になるまでの大切な時間
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center pt-6 pb-3 px-4 self-stretch w-full relative flex-[0_0_auto]"
            >
              <h3 className="self-stretch mt-[-1.00px] font-bold text-[#896b60] text-[32px] text-center tracking-[0] leading-10 font-sans">
                {remainingTimeDisplay}
              </h3>
            </motion.div>

            <div className="flex flex-col items-center pt-1 pb-3 px-4 relative self-stretch w-full flex-[0_0_auto]">
              <p className="self-stretch mt-[-1.00px] font-normal text-[#896b60] text-base text-center tracking-[0] leading-6 font-sans">
                今日は一緒に過ごす大切な時間
              </p>
            </div>

            <Card className="border-none shadow-none w-full bg-white/60">
              <CardContent className="flex flex-col items-start gap-3 p-4 self-stretch w-full relative flex-[0_0_auto]">
                <div className="justify-between self-stretch w-full flex-[0_0_auto] flex items-start relative">
                  <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                    <h4 className="whitespace-nowrap relative self-stretch mt-[-1.00px] font-medium text-[#896b60] text-base tracking-[0] leading-6 font-sans">
                      経過時間
                    </h4>
                  </div>

                  <div className="inline-flex flex-col h-6 items-start relative flex-[0_0_auto]">
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative self-stretch mt-[-1.00px] font-normal text-[#896b60] text-sm tracking-[0] leading-[21px] whitespace-nowrap font-sans"
                    >
                      {progressPercentage}%
                    </motion.span>
                  </div>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full bg-[#FFE4E1] rounded h-2"
                >
                  <Progress value={progressPercentage} className="h-2 bg-[#896b60] rounded" />
                </motion.div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-none w-full bg-white/60">
              <CardContent className="flex flex-wrap items-start gap-[16px_16px] px-4 py-6 self-stretch w-full relative flex-[0_0_auto]">
                <div className="flex-col min-w-72 gap-2 flex-1 grow flex items-start relative">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <h4 className="relative self-stretch mt-[-1.00px] font-medium text-[#896b60] text-base tracking-[0] leading-6 font-sans">
                      接触時間の推移
                    </h4>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="relative w-full h-[350px] bg-white/80 rounded-lg p-4"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.primary} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke={colors.milestone.line}
                        />
                        <XAxis
                          dataKey="age"
                          stroke={colors.primary}
                          tick={{ fill: colors.primary }}
                          label={{ value: '年齢', position: 'bottom', fill: colors.primary }}
                          ticks={chartData.reduce((acc: number[], point, index, array) => {
                            // 最初と最後の年齢は必ず表示
                            if (index === 0 || index === array.length - 1) {
                              acc.push(point.age);
                              return acc;
                            }
                            
                            // 現在時点のデータは必ず表示
                            if (point.isCurrentPoint) {
                              const exactAge = Number(point.exactAge);
                              // 現在時点の年齢を追加
                              acc.push(exactAge);
                              // 現在時点の前の偶数年齢を追加（2歳など）
                              const prevEvenAge = Math.floor(exactAge / 2) * 2;
                              if (prevEvenAge > 0 && !acc.includes(prevEvenAge)) {
                                acc.push(prevEvenAge);
                              }
                              return acc;
                            }

                            // 2の倍数の年齢を表示
                            if (point.age % 2 === 0 && point.age > 0) {
                              acc.push(point.age);
                            }
                            return acc;
                          }, [])}
                          tickFormatter={(value) => {
                            const point = chartData.find(d => 
                              d.isCurrentPoint ? 
                              Number(d.exactAge) === value : 
                              d.age === value
                            );
                            if (point?.isCurrentPoint) {
                              return '現在';
                            }
                            return `${Math.floor(value)}歳`;
                          }}
                        />
                        <YAxis
                          stroke={colors.primary}
                          tick={{ fill: colors.primary }}
                          label={{ value: '残り時間 (%)', angle: -90, position: 'left', fill: colors.primary }}
                          domain={[0, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="remaining"
                          stroke={colors.primary}
                          fillOpacity={1}
                          fill="url(#progressGradient)"
                          animationDuration={1500}
                          dot={(props: any) => {
                            if (props.payload.isCurrentPoint) {
                              return (
                                <circle
                                  cx={props.cx}
                                  cy={props.cy}
                                  r={6}
                                  fill={colors.accent}
                                  stroke={colors.accent}
                                />
                              );
                            }
                            return (
                              <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={4}
                                fill={colors.primary}
                                stroke={colors.primary}
                              />
                            );
                          }}
                        />
                        {chartData.find(d => d.isCurrentPoint) && (
                          <ReferenceLine
                            x={Number(chartData.find(d => d.isCurrentPoint)?.exactAge)}
                            stroke={colors.accent}
                            strokeDasharray="3 3"
                            strokeWidth={2}
                            label={
                              <Label
                                value="現在"
                                position="top"
                                fill={colors.accent}
                              />
                            }
                          />
                        )}
                        {[
                          { age: milestone75Age, label: "75%" },
                          { age: milestone50Age, label: "50%" },
                          { age: milestone25Age, label: "25%" },
                          { age: milestone10Age, label: "10%" }
                        ].map(milestone => 
                          milestone.age && (
                            <ReferenceLine
                              key={milestone.label}
                              x={milestone.age}
                              stroke={colors.milestone.line}
                              strokeDasharray="3 3"
                              label={
                                <Label
                                  value={milestone.label}
                                  position="top"
                                  fill={colors.milestone.text}
                                />
                              }
                            />
                          )
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="flex flex-col gap-2 mt-4"
                  >
                    <div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                      <span className="relative self-stretch mt-[-1.00px] font-normal text-[#896b60] text-base tracking-[0] leading-6 whitespace-nowrap font-sans">
                        現在の年齢: {currentAge}歳
                      </span>
                      <span className="relative self-stretch mt-[-1.00px] font-medium text-[#07870a] text-base tracking-[0] leading-6 whitespace-nowrap font-sans">
                        残り{getProgressDisplay(progressPercentage)}
                      </span>
                    </div>
                    {[
                      { percentage: 75, age: milestone75Age },
                      { percentage: 50, age: milestone50Age },
                      { percentage: 25, age: milestone25Age },
                      { percentage: 10, age: milestone10Age }
                    ].map(({ percentage, age }) => age !== null && (
                      <div key={`milestone-text-${percentage}`} className="text-sm text-[#896b60]">
                        ⚑ {age}歳で残り{percentage}%になります
                      </div>
                    ))}
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="flex flex-col items-center pt-1 pb-3 px-4 relative self-stretch w-full flex-[0_0_auto]"
            >
              <p className="relative self-stretch mt-[-1.00px] font-normal text-[#896b60] text-base text-center tracking-[0] leading-6 font-sans">
                {randomMessage}
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};