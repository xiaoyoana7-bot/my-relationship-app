import React, { useEffect, useState } from 'react';
import { UserState, CharacterType } from '../types';
import { generateClothingAdvice } from '../services/geminiService';

interface WeatherCardProps {
    partnerState: UserState;
    partnerRole: CharacterType;
    onUpdatePartner: (newState: Partial<UserState>) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ partnerState, partnerRole, onUpdatePartner }) => {
    const [advice, setAdvice] = useState<string>("正在思考穿衣建议...");
    const [currentTime, setCurrentTime] = useState<string>("");
    const [isEditingTimezone, setIsEditingTimezone] = useState(false);
    
    // State for manual clothing note
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [tempNote, setTempNote] = useState(partnerState.clothingNote || "");

    useEffect(() => {
        setTempNote(partnerState.clothingNote || "");
    }, [partnerState.clothingNote]);

    useEffect(() => {
        // Update clock based on partner's timezone
        const timer = setInterval(() => {
            const now = new Date();
            // Simple timezone offset calculation
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const partnerTime = new Date(utc + (3600000 * partnerState.timezoneOffset));
            
            setCurrentTime(partnerTime.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, [partnerState.timezoneOffset]);

    useEffect(() => {
        let isMounted = true;
        const fetchAdvice = async () => {
            const text = await generateClothingAdvice(partnerState.weather, partnerState.temperature, partnerRole);
            if (isMounted) setAdvice(text);
        };
        fetchAdvice();
        return () => { isMounted = false; };
    }, [partnerState.weather, partnerState.temperature, partnerRole]);

    const handleSaveNote = () => {
        onUpdatePartner({ clothingNote: tempNote });
        setIsEditingNote(false);
    };

    const isBunny = partnerRole === CharacterType.BUNNY;
    const themeColor = isBunny ? 'text-bunny-600' : 'text-puppy-600';
    const bgColor = isBunny ? 'bg-bunny-50' : 'bg-puppy-50';
    const borderColor = isBunny ? 'border-bunny-100' : 'border-puppy-100';
    const accentColor = isBunny ? 'bg-bunny-100 text-bunny-700' : 'bg-puppy-100 text-puppy-700';

    return (
        <div className={`relative overflow-hidden rounded-3xl p-6 ${bgColor} border-2 ${borderColor} shadow-sm transition-all hover:shadow-md`}>
            {/* Header: Location & Time */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{isBunny ? '🐰' : '🐶'}</span>
                        <h3 className={`font-bold text-lg ${themeColor}`}>{partnerState.location}</h3>
                    </div>
                    <p className="text-xs text-gray-500 font-medium tracking-wide">PARTNER'S SIDE</p>
                </div>
                <div className="text-right">
                    <div className={`text-4xl font-black ${themeColor} tracking-tight`}>
                        {currentTime}
                    </div>
                    
                    <div className="flex justify-end items-center gap-2 mt-1">
                        {isEditingTimezone ? (
                            <select
                                className="text-xs border border-gray-300 rounded bg-white/80 p-1 outline-none text-gray-700"
                                value={partnerState.timezoneOffset}
                                onChange={(e) => {
                                    onUpdatePartner({ timezoneOffset: Number(e.target.value) });
                                    setIsEditingTimezone(false);
                                }}
                                autoFocus
                                onBlur={() => setIsEditingTimezone(false)}
                            >
                                {Array.from({length: 27}, (_, i) => i - 12).map(offset => (
                                    <option key={offset} value={offset}>
                                        UTC{offset >= 0 ? '+' + offset : offset}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div 
                                className="text-xs text-gray-500 font-medium cursor-pointer hover:text-gray-700 flex items-center gap-1 group"
                                onClick={() => setIsEditingTimezone(true)}
                                title="点击修改时区"
                            >
                                {partnerState.timezoneOffset >= 0 ? `UTC+${partnerState.timezoneOffset}` : `UTC${partnerState.timezoneOffset}`}
                                <span className="opacity-30 group-hover:opacity-100 transition-opacity">✎</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Weather Info */}
            <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                     <div className={`text-5xl ${isBunny ? 'text-bunny-400' : 'text-puppy-400'}`}>
                         {partnerState.weather.includes('晴') ? '☀️' : 
                          partnerState.weather.includes('雨') ? '🌧️' : 
                          partnerState.weather.includes('云') ? '☁️' : '⛅'}
                     </div>
                     <div>
                         <div className="text-3xl font-bold text-gray-700">{partnerState.temperature}°C</div>
                         <div className="text-gray-500">{partnerState.weather}</div>
                     </div>
                 </div>
            </div>

            {/* AI Advice */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 mb-3">
                <div className="flex gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Gemini 贴心提醒</span>
                </div>
                <p className={`text-sm ${themeColor} font-medium leading-relaxed`}>
                    "{advice}"
                </p>
            </div>

            {/* Manual Partner Advice (New Feature) */}
            <div className={`rounded-xl p-4 border transition-colors ${isEditingNote ? 'bg-white border-pink-300 ring-2 ring-pink-100' : 'bg-white/40 border-dashed border-gray-300 hover:border-pink-300'}`}>
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                        <span>✏️</span> 爱的叮嘱
                    </span>
                    {!isEditingNote && (
                        <button 
                            onClick={() => setIsEditingNote(true)} 
                            className="text-[10px] text-gray-400 hover:text-pink-500 font-bold"
                        >
                            修改
                        </button>
                    )}
                </div>
                
                {isEditingNote ? (
                    <div>
                        <textarea
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0 text-gray-700 resize-none font-serif placeholder-gray-300"
                            rows={2}
                            placeholder="写下给TA的穿衣提醒..."
                            autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button 
                                onClick={() => {
                                    setIsEditingNote(false);
                                    setTempNote(partnerState.clothingNote || "");
                                }}
                                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleSaveNote}
                                className={`text-xs text-white px-3 py-1 rounded-lg font-bold shadow-sm ${isBunny ? 'bg-bunny-400 hover:bg-bunny-500' : 'bg-puppy-400 hover:bg-puppy-500'}`}
                            >
                                保存
                            </button>
                        </div>
                    </div>
                ) : (
                    <p 
                        className="text-sm text-gray-600 font-serif italic cursor-pointer min-h-[20px]"
                        onClick={() => setIsEditingNote(true)}
                    >
                        {partnerState.clothingNote || <span className="text-gray-300 not-italic text-xs">点击这里给TA写穿衣提醒...</span>}
                    </p>
                )}
            </div>
        </div>
    );
};

export default WeatherCard;