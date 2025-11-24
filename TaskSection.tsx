import React from 'react';
import { Task, CharacterType } from '../types';

interface TaskSectionProps {
    tasks: Task[];
    totalPoints: number;
    onToggleTask: (taskId: string) => void;
    currentRole: CharacterType;
    onRefreshTask: () => void;
}

const TaskSection: React.FC<TaskSectionProps> = ({ 
    tasks, 
    totalPoints, 
    onToggleTask, 
    currentRole,
    onRefreshTask
}) => {
    const isBunny = currentRole === CharacterType.BUNNY;
    const themeColor = isBunny ? 'text-bunny-600' : 'text-puppy-600';
    const progressBarColor = isBunny ? 'bg-bunny-500' : 'bg-puppy-500';
    
    // Unlock Logic
    const nextUnlock = 100;
    const isThemeUnlocked = totalPoints >= nextUnlock;
    const progress = Math.min((totalPoints / nextUnlock) * 100, 100);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden">
             {/* Decorative Background */}
             <div className={`absolute top-0 right-0 w-40 h-40 opacity-5 rounded-bl-full ${isBunny ? 'bg-bunny-500' : 'bg-puppy-500'}`}></div>

            <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <span>恋爱任务</span>
                </h3>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    <span className="text-xs font-bold text-gray-400">恋爱积分</span>
                    <span className={`font-black ${themeColor} text-lg`}>{totalPoints}</span>
                </div>
            </div>

            {/* Unlock Status / Progress */}
            <div className="mb-6">
                <div className="flex justify-between text-xs mb-1 font-bold text-gray-400">
                    <span>{isThemeUnlocked ? '🎉 暗夜模式主题已解锁！' : '解锁新主题'}</span>
                    <span>{totalPoints} / {nextUnlock}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                        className={`h-full ${isThemeUnlocked ? 'bg-gradient-to-r from-purple-400 to-pink-500' : progressBarColor} transition-all duration-500 ease-out relative`} 
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                {tasks.map(task => {
                    const isWeekly = task.type === 'WEEKLY';
                    return (
                        <div 
                            key={task.id}
                            onClick={() => !task.completed && onToggleTask(task.id)}
                            className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer group ${
                                task.completed 
                                    ? 'bg-gray-50 border-gray-100 opacity-60 grayscale' 
                                    : isWeekly
                                        ? `bg-gradient-to-r from-yellow-50 to-white border-yellow-200 hover:border-yellow-300 hover:shadow-md`
                                        : `bg-white border-transparent hover:border-${isBunny ? 'bunny' : 'puppy'}-200 hover:shadow-md`
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                                        task.completed 
                                            ? 'bg-green-400 border-green-400 text-white' 
                                            : 'border-gray-200 text-transparent group-hover:border-gray-300'
                                    }`}>
                                        ✓
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                            {task.title}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {isWeekly && (
                                                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">
                                                    WEEKLY
                                                </span>
                                            )}
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                +{task.points} 积分
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xl">
                                    {isWeekly ? '🏆' : '📅'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button 
                onClick={onRefreshTask}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline text-center w-full decoration-dashed underline-offset-4"
            >
                🎲 生成新的每日任务
            </button>
        </div>
    );
};

export default TaskSection;