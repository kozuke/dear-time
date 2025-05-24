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
      return (
        <div className="bg-white/90 p-2 rounded shadow-md border border-[#896b60]/20">
          <p className="text-[#896b60] font-medium">現在の時点</p>
          <p className="text-[#896b60]">{`${data.exactAge}歳`}</p>
          <p className="text-[#896b60]">{`残り時間: ${data.remaining.toFixed(1)}%`}</p>
        </div>
      );
    }
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

      const birth = new Date(childInfo.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const exactAge = age + (monthDiff / 12);
      setCurrentAge(age);

      const formattedData: ChartDataPoint[] = progressions.map(prog => ({
        age: prog.age,
        remaining: 100 - prog.progressPercentage,
        isCurrentPoint: false
      }));

      const currentYearData = formattedData.find(d => d.age === Math.floor(exactAge));
      const nextYearData = formattedData.find(d => d.age === Math.ceil(exactAge));
      
      if (currentYearData && nextYearData) {
        const fraction = exactAge - Math.floor(exactAge);
        const interpolatedRemaining = 
          currentYearData.remaining + 
          (nextYearData.remaining - currentYearData.remaining) * fraction;

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

  const milestone75Age = findMilestoneAge(75);
  const milestone50Age = findMilestoneAge(50);
  const milestone25Age = findMilestoneAge(25);
  const milestone10Age = findMilestoneAge(10);

  return (
    <div className="flex flex-col items-center relative min-h-screen bg-gradient-to-br from-[#FFF5EA] to-[#FFE4E1]">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl w-full">
        <div className="w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="font-dancing text-[#896b60] text-4xl mb-4">
              {childInfo?.name}さんとの時間
            </h2>
            <p className="text-[#896b60] text-lg">
              {childInfo?.name}さんが22歳になるまでの大切な時間
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h3 className="font-dancing text-[#896b60] text-5xl mb-4">
              {remainingTimeDisplay}
            </h3>
            <p className="text-[#896b60] text-lg">
              今日は一緒に過ごす大切な時間
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <Card className="border-none shadow-none w-full bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-[#896b60] text-lg">
                    経過時間
                  </h4>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="text-[#896b60] text-lg"
                  >
                    {progressPercentage}%
                  </motion.span>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                  className="w-full bg-[#FFE4E1] rounded-full h-3 overflow-hidden"
                >
                  <Progress value={progressPercentage} className="h-3 bg-[#896b60] rounded-full transition-all duration-1000" />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Card className="border-none shadow-none w-full bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <h4 className="font-medium text-[#896b60] text-lg mb-4">
                  接触時間の推移
                </h4>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="w-full h-[400px] bg-white/80 rounded-lg p-4 shadow-sm"
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
                          if (index === 0 || index === array.length - 1) {
                            acc.push(point.age);
                            return acc;
                          }
                          
                          if (point.isCurrentPoint) {
                            const exactAge = Number(point.exactAge);
                            acc.push(exactAge);
                            const prevEvenAge = Math.floor(exactAge / 2) * 2;
                            if (prevEvenAge > 0 && !acc.includes(prevEvenAge)) {
                              acc.push(prevEvenAge);
                            }
                            return acc;
                          }

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
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="mt-6 space-y-2"
                >
                  <div className="flex items-center gap-4 justify-center">
                    <span className="text-[#896b60] text-lg">
                      現在の年齢: {currentAge}歳
                    </span>
                    <span className="font-medium text-[#07870a] text-lg">
                      残り{getProgressDisplay(progressPercentage)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {[
                      { percentage: 75, age: milestone75Age },
                      { percentage: 50, age: milestone50Age },
                      { percentage: 25, age: milestone25Age },
                      { percentage: 10, age: milestone10Age }
                    ].map(({ percentage, age }) => age !== null && (
                      <div key={`milestone-text-${percentage}`} className="text-base text-[#896b60] text-center">
                        ⚑ {age}歳で残り{percentage}%になります
                      </div>
                    ))}
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="text-center mt-12"
          >
            <p className="font-dancing text-[#896b60] text-2xl">
              {randomMessage}
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};