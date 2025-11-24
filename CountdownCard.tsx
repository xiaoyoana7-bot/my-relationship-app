import React, { useState } from 'react';
import { MeetingPlan } from '../types';

interface CountdownCardProps {
    nextMeetingDate: string;
    plans: MeetingPlan[];
    onUpdateDate: (date: string) => void;
    onAddPlan: (title: string) => void;
    onTogglePlan: (id: string) => void;
    theme: 'bunny' | 'puppy';
}

const CountdownCard: React.FC<CountdownCardProps> = ({ 
    nextMeetingDate, 
    plans, 
    onUpdateDate, 
    onAddPlan, 
    onTogglePlan,
    theme
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newDate, setNewDate] = useState(nextMeetingDate);
    const [newPlanInput, setNewPlanInput] = useState("");

    const calculateDaysLeft = () => {
        if (!nextMeetingDate) return 0;
        const target = new Date(nextMeetingDate);
        const today = new Date();
        target.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        const diff = target.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    };

    const daysLeft = calculateDaysLeft();

    const handleSaveDate = () => {
        onUpdateDate(newDate);
        setIsEditing(false);
    };

    const handleAddPlan = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlanInput.trim()) {
            onAddPlan(newPlanInput);
            setNewPlanInput("");
        }
    };

    const themeClass = theme === 'bunny' ? 'text-bunny-500 bg-bunny-500' : 'text-puppy-500 bg-puppy-500';
    const borderClass = theme === 'bunny' ? 'focus:ring-bunny-300' : 'focus:ring-puppy-300';
    const buttonClass = theme === 'bunny' ? 'bg-bunny-500 hover:bg-bunny-600' : 'bg-puppy-500 hover:bg-puppy-600';

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    📅 <span className="text-lg">见面倒计时</span>
                </h3>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                    {isEditing ? '取消' : '修改日期'}
                </button>
            </div>

            {/* Countdown Display */}
            <div className="text-center mb-8 relative">
                {isEditing ? (
                    <div className="flex flex-col gap-2 animate-fade-in">
                        <input 
                            type="date" 
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className={`border border-gray-200 rounded-lg p-2 text-center w-full focus:outline-none focus:ring-2 ${borderClass}`}
                        />
                        <button 
                            onClick={handleSaveDate}
                            className={`text-white text-sm py-1 rounded-lg ${buttonClass} transition-colors`}
                        >
                            保存
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-6xl font-black text-gray-800 tracking-tighter mb-2">
                            {daysLeft > 0 ? daysLeft : 0}
                            <span className="text-lg font-medium text-gray-400 ml-2">天</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            距离 {nextMeetingDate} 见面
                        </p>
                        {daysLeft === 0 && (
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                <span className="text-4xl animate-bounce">🎉 见面啦！</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Plan List */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <h4 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">见面计划清单</h4>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-4 custom-scrollbar">
                    {plans.length === 0 && <p className="text-gray-400 text-sm text-center py-4">还没有计划，快去添加吧！</p>}
                    {plans.map(plan => (
                        <div 
                            key={plan.id} 
                            onClick={() => onTogglePlan(plan.id)}
                            className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                                plan.completed ? 'bg-gray-50' : 'bg-white border border-gray-100 hover:border-gray-200 shadow-sm'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                plan.completed ? 'border-gray-300 bg-gray-300' : `border-gray-300 group-hover:${themeClass.split(' ')[0]}`
                            }`}>
                                {plan.completed && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className={`text-sm ${plan.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                {plan.title}
                            </span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddPlan} className="relative">
                    <input 
                        type="text" 
                        placeholder="想一起去做什么..."
                        value={newPlanInput}
                        onChange={(e) => setNewPlanInput(e.target.value)}
                        className={`w-full bg-gray-50 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 ${borderClass} transition-all`}
                    />
                    <button 
                        type="submit"
                        disabled={!newPlanInput.trim()}
                        className={`absolute right-2 top-2 bottom-2 px-3 rounded-lg text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass}`}
                    >
                        添加
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CountdownCard;