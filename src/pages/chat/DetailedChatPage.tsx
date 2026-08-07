// 상세 채팅
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { mockChatApi } from "../../api/mockChat";
import type { ChatMessageResponse } from "../../types/chat";

// 메시지 상세 시간 포맷 함수
const formatDetailTime = (isoString: string) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${ampm} ${hours} : ${minutes}`;
};

// 구분선용 날짜 포맷 함수 (오늘 / MM.DD / YY.MM.DD)
const formatSectionDate = (isoString: string): string => {
    const messageDate = new Date(isoString);
    const now = new Date();

    const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = today.getTime() - messageDay.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "오늘";
    
    const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
    const day = messageDate.getDate().toString().padStart(2, "0");

    if (messageDate.getFullYear() < now.getFullYear()) {
        const shortYear = messageDate.getFullYear().toString().slice(-2);
        return `${shortYear}.${month}.${day}`;
    }
    return `${month}.${day}`;
};

export default function DetailedChatPage() {
    const { roomId } = useParams<{ roomId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    
    const chatType = location.state?.type || "TRADE"; 
    const roomTitle = location.state?.title || "컴퓨터 공학과 과잠 대여";
    
    const currentUserId = 999; 

    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inputValue, setInputValue] = useState("");
    
    // 화면 치솟음 현상 해결을 위한 실제 스크롤 박스 전용 Ref 지정
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!roomId) return;
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const data = await mockChatApi.getChatRoomDetail(Number(roomId));
                setMessages(data);
            } catch (error) {
                console.error("채팅 내역을 불러오는데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMessages();
    }, [roomId]);

    // 전체 레이아웃이 깨지지 않게 컨테이너 내부 스크롤만 하단으로 이동
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage: ChatMessageResponse = {
            messageId: Date.now(),
            senderId: currentUserId,
            senderNickName: "나",
            content: inputValue,
            createdAt: new Date().toISOString(),
            unreadCount: 1,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const otherUserNickname = messages[0]?.senderNickName || "코딩왕";

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-height-[874px] max-height-[874px] w-[402px] h-[874px] overflow-hidden flex flex-col bg-white border-x border-[#E6E6E6] mx-auto">
            
            {/* 상단 헤더 */}
            <header className="flex items-center justify-between px-5 py-4 flex-shrink-0 bg-white z-10">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* 화살표 */}
                    <button onClick={() => navigate(-1)} className="text-[20px] font-bold flex-shrink-0">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 8.36377C14.5523 8.36377 15 7.91605 15 7.36377C15 6.81148 14.5523 6.36377 14 6.36377V7.36377V8.36377ZM0.292893 6.65666C-0.0976315 7.04719 -0.0976315 7.68035 0.292893 8.07088L6.65685 14.4348C7.04738 14.8254 7.68054 14.8254 8.07107 14.4348C8.46159 14.0443 8.46159 13.4111 8.07107 13.0206L2.41421 7.36377L8.07107 1.70692C8.46159 1.31639 8.46159 0.683226 8.07107 0.292702C7.68054 -0.0978227 7.04738 -0.0978227 6.65685 0.292702L0.292893 6.65666ZM14 7.36377V6.36377L1 6.36377V7.36377V8.36377L14 8.36377V7.36377Z" fill="black"/>
                        </svg>
                    </button>
                    {/* 프로필 */}
                    <div className="w-[56px] h-[56px] mt-1 rounded-full bg-[#E6E6E6] flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.625 16.8125C0.625 15.5859 1.11228 14.4095 1.97963 13.5421C2.84699 12.6748 4.02337 12.1875 5.25 12.1875H14.5C15.7266 12.1875 16.903 12.6748 17.7704 13.5421C18.6377 14.4095 19.125 15.5859 19.125 16.8125C19.125 17.4258 18.8814 18.014 18.4477 18.4477C18.014 18.8814 17.4258 19.125 16.8125 19.125H2.9375C2.32419 19.125 1.73599 18.8814 1.30232 18.4477C0.868638 18.014 0.625 17.4258 0.625 16.8125Z" stroke="#7F7F7F" stroke-width="1.25" stroke-linejoin="round"/>
                            <path d="M9.875 7.5625C11.7907 7.5625 13.3438 6.00949 13.3438 4.09375C13.3438 2.17801 11.7907 0.625 9.875 0.625C7.95926 0.625 6.40625 2.17801 6.40625 4.09375C6.40625 6.00949 7.95926 7.5625 9.875 7.5625Z" stroke="#7F7F7F" stroke-width="1.25"/>
                        </svg>
                    </div>
                    {/* 닉네임, 게시글 제목 */}
                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[16px] text-[#000000] leading-tight flex-shrink-0 pt-1.5">{otherUserNickname}</span>
                            <div className="w-[11px] h-[11px] rounded-full bg-[#43A860] flex-shrink-0 mt-1 ml-0.5" />
                        </div>
                        <p className="text-[13px] text-[#7F7F7F] line-clamp-1 mt-1.5">{roomTitle}</p>
                    </div>
                </div>
                {/* ⓘ 아이콘 */}
                <button>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8H12.01V8.01H12V8Z" stroke="black" stroke-width="3" stroke-linejoin="round"/>
                    <path d="M12 12V16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </header>

            {/* 채팅 메시지 영역 */}
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-[30px] mt-[-35px] bg-white flex flex-col gap-5"
            >
                {isLoading ? (
                    <div className="text-center text-[#7F7F7F] my-auto text-[14px]">채팅을 불러오는 중...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-[#7F7F7F] my-auto text-[14px]">나눈 대화가 없습니다.</div>
                ) : (
                    <>
                        {messages.map((msg, index) => {
                            const isMe = msg.senderId === currentUserId;
                            
                            const currentDateStr = new Date(msg.createdAt).toDateString();
                            const prevDateStr = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
                            const showDateSection = currentDateStr !== prevDateStr;

                            return (
                                <div key={msg.messageId} className="contents">
                                    {showDateSection && (
                                        <div className="mx-auto bg-[#E6E6E6] text-[#7F7F7F] text-[14px] px-3.5 py-1.5 rounded-[40px] my-2 flex-shrink-0">
                                            {formatSectionDate(msg.createdAt)}
                                        </div>
                                    )}

                                    {isMe ? (
                                        <div className="flex flex-col items-end gap-1 w-full flex-shrink-0">
                                            <div className="max-w-[90%] bg-[#E4E4FF] text-[#000000] rounded-[40px] rounded-tr-none px-9 py-4.5 text-[14px] leading-relaxed break-all whitespace-pre-wrap">
                                                {msg.content}
                                            </div>
                                            <span className="text-[12px] text-[#1A1A1A] mr-1">
                                                {formatDetailTime(msg.createdAt)}&nbsp;
                                                {(msg.unreadCount ?? 0) === 0 ? "✓" : msg.unreadCount}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-start gap-1 w-full flex-shrink-0">
                                            <div className="max-w-[90%] bg-[#E6E6E6] text-[#000000] rounded-[40px] rounded-tl-none px-9 py-4.5 text-[14px] leading-relaxed break-all whitespace-pre-wrap">
                                                {msg.content}
                                            </div>
                                            <span className="text-[12px] text-[#1A1A1A] ml-5">
                                                {formatDetailTime(msg.createdAt)}&nbsp;
                                                {(msg.unreadCount ?? 0) === 0 ? "✓" : msg.unreadCount}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </>
                )}

                {/* 하단 정보 상자 */}
                {!isLoading && (
                    chatType === "TRADE" ? (
                        <div className="border border-[#9996FF] bg-gradient-to-r from-[#E4E4FF] to-[#FFFFFF] rounded-[40px] rounded-tr-none px-8 py-5 flex flex-col gap-3 flex-shrink-0 mt-2">
                            <div className="flex items-center gap-2 text-[#000000] text-[12px]">
                                <span>
                                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.7489 14.1997C12.6088 15.6673 10.3912 15.6673 9.25113 14.1997L5.10977 8.86836C3.65657 6.9976 4.98977 4.27378 7.35864 4.27378L15.6414 4.27378C18.0102 4.27378 19.3434 6.9976 17.8902 8.86836L13.7489 14.1997Z" fill="#9996FF"/>
                                    <path d="M13.7489 8.80081C12.6088 7.33316 10.3912 7.33316 9.25113 8.80081L5.10977 14.1321C3.65657 16.0029 4.98977 18.7267 7.35864 18.7267L15.6414 18.7267C18.0102 18.7267 19.3434 16.0029 17.8902 14.1321L13.7489 8.80081Z" fill="#736EFF"/>
                                    <rect width="3.60158" height="8.8489" rx="1.80079" transform="matrix(0.869908 0.493213 -0.59512 0.803637 14.9507 6.7251)" fill="#9996FF"/>
                                    <rect width="3.70738" height="8.8489" rx="1.85369" transform="matrix(0.869908 0.493213 -0.59512 0.803637 11.4148 5.64893)" fill="#736EFF"/>
                                    <ellipse cx="12.0439" cy="13.5981" rx="1.63176" ry="1.63176" fill="white"/>
                                    </svg>
                                </span> 거래 정보
                            </div>
                            <div className="grid grid-cols-[70px_1fr] gap-y-2 text-[12px] text-[#000000]">
                                <span>상품명</span>
                                <span>{roomTitle}</span>
                                <span>대여기간</span>
                                <span>2026. 04 . 8 (수) ~ 2026. 04. 9 (목)</span>
                                <span>대여금액</span>
                                <span>5,000원</span>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-[#9996FF] bg-gradient-to-r from-[#E4E4FF] to-[#FFFFFF] rounded-[40px] rounded-tr-none px-8 py-5 flex flex-col gap-3 flex-shrink-0 mt-2">
                            <div className="flex items-center gap-2 text-[#000000] text-[12px]">
                                <span>
                                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.7489 14.1997C12.6088 15.6673 10.3912 15.6673 9.25113 14.1997L5.10977 8.86836C3.65657 6.9976 4.98977 4.27378 7.35864 4.27378L15.6414 4.27378C18.0102 4.27378 19.3434 6.9976 17.8902 8.86836L13.7489 14.1997Z" fill="#9996FF"/>
                                    <path d="M13.7489 8.80081C12.6088 7.33316 10.3912 7.33316 9.25113 8.80081L5.10977 14.1321C3.65657 16.0029 4.98977 18.7267 7.35864 18.7267L15.6414 18.7267C18.0102 18.7267 19.3434 16.0029 17.8902 14.1321L13.7489 8.80081Z" fill="#736EFF"/>
                                    <rect width="3.60158" height="8.8489" rx="1.80079" transform="matrix(0.869908 0.493213 -0.59512 0.803637 14.9507 6.7251)" fill="#9996FF"/>
                                    <rect width="3.70738" height="8.8489" rx="1.85369" transform="matrix(0.869908 0.493213 -0.59512 0.803637 11.4148 5.64893)" fill="#736EFF"/>
                                    <ellipse cx="12.0439" cy="13.5981" rx="1.63176" ry="1.63176" fill="white"/>
                                    </svg>
                                </span>
                                빈자리 정보
                            </div>
                            <div className="grid grid-cols-[70px_1fr] gap-y-2 text-[12px]">
                                <span>상세 위치</span>
                                <span>{roomTitle}</span>
                                <span>퇴실 시간</span>
                                <span>오전 10:30</span>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* 하단 메시지 입력란 */}
            <div className="h-[84px] p-4 bg-white border-t border-[#B3B3B3] flex items-center gap-4 flex-shrink-0 z-10">
                <div className="w-[295px] h-[60px] flex-1 flex items-center gap-3 border border-[#CCCCCC] rounded-[40px] px-4 py-2 bg-white">
                    <button className="text-[18px] text-[#7F7F7F] flex-shrink-0">
                        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.5 1.4375C0.5 1.18886 0.605357 0.950403 0.792893 0.774588C0.98043 0.598772 1.23478 0.5 1.5 0.5H18.5C18.7652 0.5 19.0196 0.598772 19.2071 0.774588C19.3946 0.950403 19.5 1.18886 19.5 1.4375V14.5625C19.5 14.8111 19.3946 15.0496 19.2071 15.2254C19.0196 15.4012 18.7652 15.5 18.5 15.5H1.5C1.23478 15.5 0.98043 15.4012 0.792893 15.2254C0.605357 15.0496 0.5 14.8111 0.5 14.5625V1.4375Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.25 5.1875C5.44891 5.1875 5.63968 5.11342 5.78033 4.98156C5.92098 4.8497 6 4.67086 6 4.48438C6 4.29789 5.92098 4.11905 5.78033 3.98719C5.63968 3.85533 5.44891 3.78125 5.25 3.78125C5.05109 3.78125 4.86032 3.85533 4.71967 3.98719C4.57902 4.11905 4.5 4.29789 4.5 4.48438C4.5 4.67086 4.57902 4.8497 4.71967 4.98156C4.86032 5.11342 5.05109 5.1875 5.25 5.1875Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.5 8L8 9.875L11 6.59375L19.5 12.6875V14.5625C19.5 14.8111 19.3946 15.0496 19.2071 15.2254C19.0196 15.4012 18.7652 15.5 18.5 15.5H1.5C1.23478 15.5 0.98043 15.4012 0.792893 15.2254C0.605357 15.0496 0.5 14.8111 0.5 14.5625V12.6875L5.5 8Z" stroke="black" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button className="text-[18px] text-[#7F7F7F] flex-shrink-0">
                        <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 3.5H3.5C4.03043 3.5 4.53914 3.28929 4.91421 2.91421C5.28929 2.53914 5.5 2.03043 5.5 1.5C5.5 1.23478 5.60536 0.98043 5.79289 0.792893C5.98043 0.605357 6.23478 0.5 6.5 0.5H12.5C12.7652 0.5 13.0196 0.605357 13.2071 0.792893C13.3946 0.98043 13.5 1.23478 13.5 1.5C13.5 2.03043 13.7107 2.53914 14.0858 2.91421C14.4609 3.28929 14.9696 3.5 15.5 3.5H16.5C17.0304 3.5 17.5391 3.71071 17.9142 4.08579C18.2893 4.46086 18.5 4.96957 18.5 5.5V14.5C18.5 15.0304 18.2893 15.5391 17.9142 15.9142C17.5391 16.2893 17.0304 16.5 16.5 16.5H2.5C1.96957 16.5 1.46086 16.2893 1.08579 15.9142C0.710714 15.5391 0.5 15.0304 0.5 14.5V5.5C0.5 4.96957 0.710714 4.46086 1.08579 4.08579C1.46086 3.71071 1.96957 3.5 2.5 3.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.5 9.5C6.5 10.2956 6.81607 11.0587 7.37868 11.6213C7.94129 12.1839 8.70435 12.5 9.5 12.5C10.2956 12.5 11.0587 12.1839 11.6213 11.6213C12.1839 11.0587 12.5 10.2956 12.5 9.5C12.5 8.70435 12.1839 7.94129 11.6213 7.37868C11.0587 6.81607 10.2956 6.5 9.5 6.5C8.70435 6.5 7.94129 6.81607 7.37868 7.37868C6.81607 7.94129 6.5 8.70435 6.5 9.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button className="text-[18px] text-[#7F7F7F] flex-shrink-0">
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.27782 10.7222L10.7222 6.27782M12.8075 10.82L15.1274 8.5C16.0063 7.62115 16.5 6.42917 16.5 5.18629C16.5 3.94341 16.0063 2.75143 15.1274 1.87258C14.2486 0.993733 13.0566 0.5 11.8137 0.5C10.5708 0.5 9.37885 0.993733 8.5 1.87258L6.18005 4.19253M10.82 12.8075L8.5 15.1274C8.06484 15.5626 7.54822 15.9078 6.97966 16.1433C6.41109 16.3788 5.8017 16.5 5.18629 16.5C4.57088 16.5 3.96149 16.3788 3.39292 16.1433C2.82436 15.9078 2.30775 15.5626 1.87258 15.1274C1.43742 14.6923 1.09223 14.1756 0.856723 13.6071C0.621214 13.0385 0.5 12.4291 0.5 11.8137C0.5 11.1983 0.621214 10.5889 0.856723 10.0203C1.09223 9.45177 1.43742 8.93516 1.87258 8.5L4.19253 6.18005" stroke="black" stroke-linecap="round"/>
                        </svg>
                    </button>
                    
                    <div className="w-[1px] self-stretch bg-[#CCCCCC] mx-1 my-1" />
                    
                    <textarea 
                        rows={1}
                        placeholder="메시지를 입력하세요." 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 text-[14px] focus:outline-none resize-none h-[22px] max-h-[22px] overflow-hidden py-0.5"
                    />
                </div>
                <button onClick={handleSendMessage} className="flex-shrink-0 active:opacity-80 transition-opacity">
                    <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="29.5" cy="29.5" r="29.5" fill="#9996FF"/>
                    <path d="M37.9056 24.0577C38.3472 22.836 37.1634 21.6522 35.9418 22.0948L21.0118 27.4947C19.7861 27.9383 19.6379 29.6108 20.7655 30.2641L25.5312 33.0233L29.7868 28.7674C29.9796 28.5812 30.2379 28.4782 30.5059 28.4805C30.7739 28.4828 31.0303 28.5903 31.2199 28.7799C31.4094 28.9694 31.5169 29.2258 31.5192 29.4939C31.5216 29.7619 31.4185 30.0202 31.2323 30.213L26.9767 34.4688L29.7368 39.2348C30.389 40.3624 32.0614 40.2132 32.505 38.9885L37.9056 24.0577Z" fill="white"/>
                    </svg>
                </button>
            </div>

        </div>
    );
}