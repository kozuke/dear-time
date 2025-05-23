import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { useStore } from "../../store/useStore";
import { Header } from "../../components/ui/header";

const messages = [
  "今日の笑顔が、ずっと心に残ります",
  "そばにいる時間が、いちばんの贈りもの",
  "一緒にいる分だけ、心が近づいていきます",
];

export const StitchDesign = (): JSX.Element => {
  const childInfo = useStore((state) => state.childInfo);
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const years = ["2024", "2025", "2026", "2027", "2028"];

  return (
    <div className="flex flex-col items-start relative min-h-screen bg-gradient-to-br from-[#FFF5EA] to-[#FFE4E1]">
      <div className="flex flex-col min-h-[800px] items-start relative self-stretch w-full">
        <Header />

        <main className="items-start justify-center px-40 py-5 flex-1 grow flex relative self-stretch w-full">
          <div className="flex flex-col max-w-[960px] h-[695px] items-start relative flex-1 grow">
            <div className="flex flex-col items-center pt-5 pb-3 px-4 self-stretch w-full relative flex-[0_0_auto]">
              <h2 className="self-stretch mt-[-1.00px] font-bold text-[#896b60] text-[28px] text-center tracking-[0] leading-[35px] font-sans">
                {childInfo?.name}さんとの時間
              </h2>
            </div>

            <div className="flex flex-col items-center pt-1 pb-3 px-4 relative self-stretch w-full flex-[0_0_auto]">
              <p className="self-stretch mt-[-1.00px] font-normal text-[#896b60] text-base text-center tracking-[0] leading-6 font-sans">
                {childInfo?.name}さんが22歳になるまでの大切な時間
              </p>
            </div>

            <div className="flex flex-col items-center pt-6 pb-3 px-4 self-stretch w-full relative flex-[0_0_auto]">
              <h3 className="self-stretch mt-[-1.00px] font-bold text-[#896b60] text-[32px] text-center tracking-[0] leading-10 font-sans">
                1 年 4 ヶ月 20 日
              </h3>
            </div>

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
                    <span className="relative self-stretch mt-[-1.00px] font-normal text-[#896b60] text-sm tracking-[0] leading-[21px] whitespace-nowrap font-sans">
                      85%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#FFE4E1] rounded h-2">
                  <Progress value={85} className="h-2 bg-[#896b60] rounded" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-none w-full bg-white/60">
              <CardContent className="flex flex-wrap items-start gap-[16px_16px] px-4 py-6 self-stretch w-full relative flex-[0_0_auto]">
                <div className="flex-col min-w-72 gap-2 flex-1 grow flex items-start relative">
                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <h4 className="relative self-stretch mt-[-1.00px] font-medium text-[#896b60] text-base tracking-[0] leading-6 font-sans">
                      時間の推移
                    </h4>
                  </div>

                  <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                    <span className="relative self-stretch mt-[-1.00px] font-bold text-[#896b60] text-[32px] tracking-[0] leading-10 font-sans">
                      100%
                    </span>
                  </div>

                  <div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                    <span className="relative self-stretch mt-[-1.00px] font-normal text-[#896b60] text-base tracking-[0] leading-6 whitespace-nowrap font-sans">
                      これからの5年間
                    </span>
                    <span className="relative self-stretch mt-[-1.00px] font-medium text-[#07870a] text-base tracking-[0] leading-6 whitespace-nowrap font-sans">
                      +5%
                    </span>
                  </div>

                  <div className="flex min-h-[180px] items-start gap-6 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
                    {years.map((year) => (
                      <div
                        key={year}
                        className="inline-flex flex-col items-end gap-6 relative flex-[0_0_auto]"
                      >
                        <div className="relative self-stretch w-full h-[137px] bg-[#FFF5EA] border-t-2 border-[#896b60]" />
                        <span className="relative self-stretch mt-[-1.00px] font-bold text-[#896b60] text-[13px] tracking-[0] leading-5 whitespace-nowrap font-sans">
                          {year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col items-center pt-1 pb-3 px-4 relative self-stretch w-full flex-[0_0_auto]">
              <p className="relative self-stretch mt-[-1.00px] font-normal text-[#896b60] text-base text-center tracking-[0] leading-6 font-sans">
                {randomMessage}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};