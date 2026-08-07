import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: "홈", path: "/" },
        { name: "대여 현황", path: "/rental" },
        { name: "채팅", path: "/chat" },
        { name: "마이 페이지", path: "/mypage" },
    ];

    const isActive = (path: string) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="absolute bottom-0 left-0 min-w-[402px] max-w-[402px] w-[402px] min-h-[61px] max-h-[61px] h-[61px] bg-white border-t border-[#B3B3B3] flex justify-around items-end pb-1 z-50">
            {navItems.map((item) => {
                const active = isActive(item.path);

                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="flex flex-col items-center justify-between h-full w-full pt-4.5 flex-1 relative cursor-pointer"
                    >
                        <span
                            className={`text-[16px] transition-colors duration-200 ${
                                active ? "text-[#9996FF] font-bold" : "text-[#1A1A1A]"
                            }`}
                        >
                            {item.name}
                        </span>

                        <div className="w-full flex justify-center h-[5px] mb-2">
                            <div
                                className={`w-[70px] h-full rounded-full transition-all duration-200 ${
                                    active ? "bg-[#9996FF]" : "bg-transparent"
                                }`}
                            />
                        </div>
                    </button>
                );
            })}
        </div>
    );
}