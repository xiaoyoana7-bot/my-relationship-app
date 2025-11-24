import React, { useState } from 'react';
import { Capsule, CharacterType } from '../types';

interface CapsuleSectionProps {
    capsules: Capsule[];
    onAddCapsule: (content: string, date: string, type: 'TEXT' | 'PHOTO_NOTE' | 'VOICE_NOTE') => void;
    currentRole: CharacterType;
}

const CapsuleSection: React.FC<CapsuleSectionProps> = ({ capsules, onAddCapsule, currentRole }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [content, setContent] = useState("");
    const [openDate, setOpenDate] = useState("");
    const [capsuleType, setCapsuleType] = useState<'TEXT' | 'PHOTO_NOTE' | 'VOICE_NOTE'>('TEXT');

    const isBunny = currentRole === CharacterType.BUNNY;
    const buttonClass = isBunny ? 'bg-bunny-500 hover:bg-bunny-600' : 'bg-puppy-500 hover:bg-puppy-600';

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (content && openDate) {
            onAddCapsule(content, openDate, capsuleType);
            setIsCreating(false);
            setContent("");
            setOpenDate("");
            setCapsuleType('TEXT');
        }
    };

    const getIcon = (type: string) => {
        switch(type) {
            case 'PHOTO_NOTE': return '📷';
            case 'VOICE_NOTE': return '🎙️';
            default: return '📝';
        }
    };

    const getBgColor = (type: string) => {
         switch(type) {
            case 'PHOTO_NOTE': return 'bg-blue-50';
            case 'VOICE_NOTE': return 'bg-purple-50';
            default: return 'bg-gray-50';
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="text-xl">💊</span>
                    <span>回忆胶囊</span>
                </h3>
                <button 
                    onClick={() => setIsCreating(true)}
                    className={`text-xs px-4 py-2 rounded-xl text-white font-bold transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm ${buttonClass}`}
                >
                    + 埋下
                </button>
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar pb-2">
                <div className="flex gap-4 min-w-full">
                    {capsules.length === 0 && (
                        <div className="w-full flex flex-col items-center justify-center py-8 text-gray-400 text-sm bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <span className="text-2xl mb-2 opacity-50">📫</span>
                            埋下第一个胶囊，<br/>给未来的我们一个惊喜。
                        </div>
                    )}
                    
                    {capsules.map(capsule => {
                        const isLocked = new Date(capsule.openDate) > new Date();
                        
                        return (
                            <div 
                                key={capsule.id}
                                className={`flex-shrink-0 w-36 h-48 p-4 rounded-[2rem] border transition-all relative flex flex-col items-center justify-between group ${
                                    isLocked 
                                        ? 'bg-gray-100 border-gray-200' 
                                        : `${getBgColor(capsule.type)} border-transparent shadow-sm`
                                }`}
                            >
                                <div className="absolute top-3 right-3 text-[10px] opacity-50 font-bold">
                                    {capsule.sender === CharacterType.BUNNY ? '🐰' : '🐶'}
                                </div>
                                
                                <div className={`mt-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner ${isLocked ? 'bg-gray-200' : 'bg-white'}`}>
                                    {isLocked ? '🔒' : getIcon(capsule.type)}
                                </div>
                                
                                {isLocked ? (
                                    <div className="text-center w-full">
                                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Locked</div>
                                        <div className="bg-gray-200 text-gray-500 text-[10px] py-1 px-2 rounded-full font-mono">
                                            {capsule.openDate}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center w-full">
                                        <p className="text-xs font-bold text-gray-700 line-clamp-2 mb-2 break-all">
                                            {capsule.content}
                                        </p>
                                        <div className="text-[10px] text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full inline-block">
                                            已开启
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Create Modal Overlay */}
            {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl animate-fade-in-up transform transition-all">
                        <div className="text-center mb-6">
                            <div className="inline-block p-3 rounded-full bg-pink-50 text-2xl mb-2">💊</div>
                            <h4 className="font-bold text-gray-800 text-lg">制作回忆胶囊</h4>
                            <p className="text-gray-400 text-xs mt-1">写给未来的我们</p>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div className="grid grid-cols-3 gap-3">
                                {(['TEXT', 'PHOTO_NOTE', 'VOICE_NOTE'] as const).map(t => (
                                    <button
                                        type="button"
                                        key={t}
                                        onClick={() => setCapsuleType(t)}
                                        className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all ${
                                            capsuleType === t 
                                                ? `border-${isBunny ? 'bunny' : 'puppy'}-400 bg-${isBunny ? 'bunny' : 'puppy'}-50 text-${isBunny ? 'bunny' : 'puppy'}-600` 
                                                : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                        }`}
                                    >
                                        <span className="text-lg mb-1">{getIcon(t)}</span>
                                        <span className="text-[10px] font-bold">
                                            {t === 'TEXT' ? '文字' : t === 'PHOTO_NOTE' ? '照片' : '语音'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={capsuleType === 'TEXT' ? "写下这句情话..." : capsuleType === 'PHOTO_NOTE' ? "描述这张照片..." : "记录这段语音..."}
                                className="w-full bg-gray-50 border-transparent rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all resize-none h-28"
                                required
                            />
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">开启日期</label>
                                <input 
                                    type="date"
                                    min={todayStr}
                                    value={openDate}
                                    onChange={(e) => setOpenDate(e.target.value)}
                                    className="w-full bg-gray-50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-600"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 py-3 rounded-xl text-gray-500 font-bold text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    取消
                                </button>
                                <button 
                                    type="submit" 
                                    className={`flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg ${buttonClass} active:scale-95 transition-transform`}
                                >
                                    密封胶囊
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CapsuleSection;