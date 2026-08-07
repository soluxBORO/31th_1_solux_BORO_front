// 상단 탭 (보라색)

import { useNavigate } from "react-router-dom";

interface TabProps {
    activeTab: "first" | "second"; // 첫 번째 탭 활성화 vs 두 번째 탭 활성화

    firstLabel: React.ReactNode;   // 첫 번째 탭 텍스트
    firstCount?: string;           // 첫 번째 탭 데이터 개수 (필수 X)
    firstPath: string;             // 첫 번째 탭 이동 경로

    secondLabel: React.ReactNode;   // 두 번째 탭 텍스트
    secondCount?: string;           // 두 번째 탭 데이터 개수 (필수 X)
    secondPath: string;            // 두 번째 탭 이동 경로
}

export default function Tab({ 
    activeTab, 
    firstLabel, 
    firstCount, 
    firstPath,
    secondLabel, 
    secondCount,
    secondPath
}: TabProps) {
    const navigate = useNavigate();

    return (
        <div className="px-6 mb-4 h-[44px] flex-shrink-0 relative">
            <div className="absolute top-0 left-[22px] flex bg-[#E6E6E6] rounded-[40px] w-[359px] h-[44px] p-1">
                
                {/* 첫 번째 탭 */}
                <button
                    onClick={() => navigate(firstPath)}
                    className={`transition-colors text-[14px] ${
                        activeTab === "first"
                            ? "w-[175px] h-[34px] mt-[1px] ml-[5px] flex items-center justify-center bg-[#9996FF] text-[#FFFFFF] rounded-[40px] !font-bold"
                            : "flex-1 py-1.5 text-center text-[#7F7F7F] hover:text-gray-600"
                    }`}
                >
                    {firstLabel}{firstCount ? ` ${firstCount}` : ""}
                </button>

                {/* 두 번째 탭 */}
                <button
                    onClick={() => navigate(secondPath)}
                    className={`transition-colors text-[14px] ${
                        activeTab === "second"
                            ? "w-[175px] h-[34px] mt-[1px] mr-[6px] flex items-center justify-center bg-[#9996FF] text-[#FFFFFF] rounded-[40px] !font-bold"
                            : "flex-1 py-1.5 text-center text-[#7F7F7F] hover:text-gray-600"
                    }`}
                >
                    {secondLabel}{secondCount ? ` ${secondCount}` : ""}
                </button>

            </div>
        </div>
    );
}