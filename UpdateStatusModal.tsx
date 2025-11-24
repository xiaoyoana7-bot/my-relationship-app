import React, { useState } from 'react';
import { UserState, CharacterType } from '../types';

interface UpdateStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentState: UserState;
    onUpdate: (newState: Partial<UserState>) => void;
    role: CharacterType;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ 
    isOpen, onClose, currentState, onUpdate, role 
}) => {
    const [formData, setFormData] = useState({
        weather: currentState.weather,
        temperature: currentState.temperature,
        location: currentState.location,
        mood: currentState.mood,
        dailyPlan: currentState.dailyPlan,
        timezoneOffset: currentState.timezoneOffset
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'temperature' || name === 'timezoneOffset' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({
            ...formData,
            lastUpdated: Date.now()
        });
        onClose();
    };

    const isBunny = role === CharacterType.BUNNY;
    const buttonClass = isBunny ? 'bg-bunny-500 hover:bg-bunny-600' : 'bg-puppy-500 hover:bg-puppy-600';

    // Helper to get city examples
    const getTimezoneLabel = (offset: number) => {
        const prefix = offset >= 0 ? `+${offset}` : `${offset}`;
        let cities = "";
        switch(offset) {
            case 0: cities = " (伦敦, 里斯本)"; break;
            case 1: cities = " (柏林, 巴黎)"; break;
            case 8: cities = " (北京, 新加坡)"; break;
            case 9: cities = " (东京, 首尔)"; break;
            case -5: cities = " (纽约, 多伦多)"; break;
            case -8: cities = " (洛杉矶, 温哥华)"; break;
            default: cities = "";
        }
        return `UTC ${prefix}${cities}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-3xl w-full max-w-md z-10 p-6 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">更新我的状态</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">当前位置</label>
                            <input 
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:outline-none"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">时区 (UTC)</label>
                            <select 
                                name="timezoneOffset" 
                                value={formData.timezoneOffset}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm"
                            >
                                {Array.from({length: 27}, (_, i) => i - 12).map(offset => (
                                    <option key={offset} value={offset}>{getTimezoneLabel(offset)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">天气</label>
                            <select 
                                name="weather" 
                                value={formData.weather}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm"
                            >
                                <option value="晴朗">☀️ 晴朗</option>
                                <option value="多云">⛅ 多云</option>
                                <option value="阴天">☁️ 阴天</option>
                                <option value="小雨">🌧️ 小雨</option>
                                <option value="大雨">⛈️ 大雨</option>
                                <option value="下雪">❄️ 下雪</option>
                                <option value="大风">🌬️ 大风</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">气温 (°C)</label>
                            <input 
                                type="number"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:outline-none"
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100 my-2" />

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">今日计划 (让TA安心)</label>
                        <textarea 
                            name="dailyPlan"
                            rows={2}
                            value={formData.dailyPlan}
                            onChange={handleChange}
                            placeholder="例如：早上开会，下午去图书馆..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">心情/烦恼 (TA会看到的)</label>
                        <textarea 
                            name="mood"
                            rows={2}
                            value={formData.mood}
                            onChange={handleChange}
                            placeholder="例如：今天工作有点累，想你了..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:outline-none resize-none"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`w-full py-3 rounded-xl text-white font-bold shadow-md transition-transform active:scale-95 ${buttonClass}`}
                    >
                        更新并发送给TA
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateStatusModal;