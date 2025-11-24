import React, { useEffect, useState } from 'react';
import { UserState, CharacterType } from '../types';
import { generateMoodComfort } from '../services/geminiService';

interface PartnerDailyCardProps {
    partnerState: UserState;
    partnerRole: CharacterType;
}

const PartnerDailyCard: React.FC<PartnerDailyCardProps> = ({ partnerState, partnerRole }) => {
    const [comfortMsg, setComfortMsg] = useState<string>("");

    useEffect(() => {
        let isMounted = true;
        const getComfort = async () => {
            if (partnerState.mood) {
                const partnerName = partnerRole === CharacterType.BUNNY ? "小兔子" : "小狗";
                const msg = await generateMoodComfort(partnerState.mood, partnerName);
                if (isMounted) setComfortMsg(msg);
            }
        };
        getComfort();
        return () => { isMounted = false; };
    }, [partnerState.mood, partnerRole]);

    const isBunny = partnerRole === CharacterType.BUNNY;
    const accentColor = isBunny ? 'text-bunny-500' : 'text-puppy-500';
    const bgAccent = isBunny ? 'bg-bunny-50' : 'bg-puppy-50';

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className="text-xl">💌</span>
                <span>TA的昨日心情 & 计划</span>
            </h3>

            <div className="space-y-4">
                {/* Daily Plan Section */}
                <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">今日计划</span>
                    <div className={`p-4 rounded-2xl ${bgAccent} text-gray-700 text-sm leading-relaxed`}>
                        {partnerState.dailyPlan || "TA 还没有记录今天的计划哦~"}
                    </div>
                </div>

                {/* Mood & Comfort Section */}
                <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">心情 / 烦恼</span>
                    <div className="relative">
                        <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 text-gray-600 text-sm italic mb-2">
                            "{partnerState.mood || "一切都好~"}"
                        </div>
                        
                        {partnerState.mood && (
                             <div className="flex gap-3 items-start animate-fade-in">
                                <div className="text-2xl mt-1">{isBunny ? '🐰' : '🐶'}</div>
                                <div className={`flex-1 p-3 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-white border border-gray-200 shadow-sm text-sm ${accentColor}`}>
                                    <span className="font-bold text-xs block mb-1 text-gray-400">Gemini 悄悄话:</span>
                                    {comfortMsg}
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerDailyCard;