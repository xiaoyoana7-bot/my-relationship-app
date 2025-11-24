import React, { useState, useEffect } from 'react';
import { CharacterType, AppData, UserState, MeetingPlan, Task, Capsule } from './types';
import RoleSwitcher from './components/RoleSwitcher';
import WeatherCard from './components/WeatherCard';
import CountdownCard from './components/CountdownCard';
import PartnerDailyCard from './components/PartnerDailyCard';
import UpdateStatusModal from './components/UpdateStatusModal';
import TaskSection from './components/TaskSection';
import CapsuleSection from './components/CapsuleSection';
import { generateLoveQuote, generateRomanticTask } from './services/geminiService';

// Initial Data
const INITIAL_BUNNY: UserState = {
    character: CharacterType.BUNNY,
    name: "小兔子",
    location: "北京",
    weather: "晴朗",
    temperature: 22,
    timezoneOffset: 8,
    mood: "今天吃到了好吃的胡萝卜蛋糕！",
    dailyPlan: "早上瑜伽，下午写代码，晚上和修勾视频。",
    clothingNote: "今天风大，出门记得戴帽子哦！",
    lastUpdated: Date.now()
};

const INITIAL_PUPPY: UserState = {
    character: CharacterType.PUPPY,
    name: "小狗",
    location: "伦敦",
    weather: "小雨",
    temperature: 14,
    timezoneOffset: 0,
    mood: "想念你的第100天。",
    dailyPlan: "努力工作赚钱买机票，晚上遛弯。",
    clothingNote: "虽然下雨，但也要穿得帅帅的。",
    lastUpdated: Date.now()
};

const INITIAL_PLANS: MeetingPlan[] = [
    { id: '1', title: '一起去迪士尼看烟花', date: '', completed: false },
    { id: '2', title: '去吃那家很火的火锅', date: '', completed: false }
];

const INITIAL_TASKS: Task[] = [
    { id: 't1', title: '给对方发一张自拍', type: 'DAILY', points: 10, completed: false, assignedTo: 'BOTH' },
    { id: 't2', title: '分享一首今天喜欢的歌', type: 'DAILY', points: 10, completed: false, assignedTo: 'BOTH' },
    { id: 't3', title: '周末连麦看电影', type: 'WEEKLY', points: 50, completed: false, assignedTo: 'BOTH' }
];

function App() {
    // ---- State ----
    const [role, setRole] = useState<CharacterType>(CharacterType.BUNNY);
    const [appData, setAppData] = useState<AppData>(() => {
        const saved = localStorage.getItem('loveSpaceData');
        return saved ? JSON.parse(saved) : {
            nextMeetingDate: "2024-12-25",
            meetingPlans: INITIAL_PLANS,
            bunnyState: INITIAL_BUNNY,
            puppyState: INITIAL_PUPPY,
            tasks: INITIAL_TASKS,
            capsules: [],
            totalPoints: 0,
            lastTaskResetDate: new Date().toDateString()
        };
    });
    
    const [loveQuote, setLoveQuote] = useState<string>("加载中...");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ---- Effects ----
    
    // Check for Daily Task Reset
    useEffect(() => {
        const today = new Date().toDateString();
        if (appData.lastTaskResetDate !== today) {
            setAppData(prev => ({
                ...prev,
                lastTaskResetDate: today,
                tasks: prev.tasks.map(t => 
                    t.type === 'DAILY' ? { ...t, completed: false } : t
                )
            }));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('loveSpaceData', JSON.stringify(appData));
    }, [appData]);

    useEffect(() => {
        let isMounted = true;
        generateLoveQuote().then(quote => {
            if (isMounted) setLoveQuote(quote);
        });
        return () => { isMounted = false; };
    }, []); 

    // ---- Handlers ----
    const handleSwitchRole = (newRole: CharacterType) => setRole(newRole);

    const updatePlanDate = (date: string) => {
        setAppData(prev => ({ ...prev, nextMeetingDate: date }));
    };

    const addPlan = (title: string) => {
        const newPlan: MeetingPlan = {
            id: Date.now().toString(),
            title,
            date: '',
            completed: false
        };
        setAppData(prev => ({ ...prev, meetingPlans: [newPlan, ...prev.meetingPlans] }));
    };

    const togglePlan = (id: string) => {
        setAppData(prev => ({
            ...prev,
            meetingPlans: prev.meetingPlans.map(p => 
                p.id === id ? { ...p, completed: !p.completed } : p
            )
        }));
    };

    // Generic updater for any character
    const handleUpdateUser = (targetRole: CharacterType, newState: Partial<UserState>) => {
        setAppData(prev => {
            if (targetRole === CharacterType.BUNNY) {
                return { ...prev, bunnyState: { ...prev.bunnyState, ...newState } };
            } else {
                return { ...prev, puppyState: { ...prev.puppyState, ...newState } };
            }
        });
    };

    const handleStatusUpdate = (newState: Partial<UserState>) => {
        handleUpdateUser(role, newState);
    };

    // Specific location update handler for RoleSwitcher
    const handleLocationUpdate = (targetRole: CharacterType, newLocation: string) => {
         handleUpdateUser(targetRole, { location: newLocation });
    };

    // Avatar Update Handler
    const handleAvatarUpdate = (targetRole: CharacterType, avatarUrl: string) => {
        handleUpdateUser(targetRole, { avatar: avatarUrl });
    };

    // Task & Capsule Handlers
    const toggleTask = (taskId: string) => {
        setAppData(prev => {
            const task = prev.tasks.find(t => t.id === taskId);
            if (!task || task.completed) return prev;

            const newPoints = prev.totalPoints + task.points;
            return {
                ...prev,
                totalPoints: newPoints,
                tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: true } : t)
            };
        });
    };

    const refreshDailyTask = async () => {
        const newTaskTitle = await generateRomanticTask();
        setAppData(prev => ({
            ...prev,
            tasks: [
                ...prev.tasks,
                {
                    id: Date.now().toString(),
                    title: newTaskTitle,
                    type: 'DAILY',
                    points: 15,
                    completed: false,
                    assignedTo: 'BOTH'
                }
            ]
        }));
    };

    const addCapsule = (content: string, openDate: string, type: 'TEXT' | 'PHOTO_NOTE' | 'VOICE_NOTE') => {
        const newCapsule: Capsule = {
            id: Date.now().toString(),
            sender: role,
            content,
            type,
            createDate: Date.now(),
            openDate,
            isLocked: true
        };
        setAppData(prev => ({
            ...prev,
            capsules: [...prev.capsules, newCapsule]
        }));
    };

    // ---- Derived Data ----
    const currentUserState = role === CharacterType.BUNNY ? appData.bunnyState : appData.puppyState;
    const partnerState = role === CharacterType.BUNNY ? appData.puppyState : appData.bunnyState;
    const partnerRole = role === CharacterType.BUNNY ? CharacterType.PUPPY : CharacterType.BUNNY;

    // Theme logic
    const isBunny = role === CharacterType.BUNNY;
    const themeColor = isBunny ? 'text-bunny-600' : 'text-puppy-600';
    const btnColor = isBunny ? 'bg-bunny-500 hover:bg-bunny-600 shadow-bunny-200' : 'bg-puppy-500 hover:bg-puppy-600 shadow-puppy-200';

    return (
        <div className={`min-h-screen transition-colors duration-500 ease-in-out ${isBunny ? 'bg-gradient-to-br from-bunny-50 to-white' : 'bg-gradient-to-br from-puppy-50 to-white'}`}>
            <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
                
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className={`text-3xl md:text-4xl font-black mb-8 tracking-tight ${themeColor}`}>
                        LoveSpace <span className="text-gray-300 font-light mx-2">|</span> 异地恋小窝
                    </h1>
                    
                    {/* Role Switcher with Location Editing & Avatar Upload */}
                    <RoleSwitcher 
                        currentRole={role} 
                        onSwitch={handleSwitchRole} 
                        bunnyLocation={appData.bunnyState.location}
                        puppyLocation={appData.puppyState.location}
                        bunnyAvatar={appData.bunnyState.avatar}
                        puppyAvatar={appData.puppyState.avatar}
                        onUpdateLocation={handleLocationUpdate}
                        onUpdateAvatar={handleAvatarUpdate}
                    />
                </div>

                {/* Love Quote Banner */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white mb-8 text-center relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1 h-full ${isBunny ? 'bg-bunny-400' : 'bg-puppy-400'}`}></div>
                    <p className="font-serif text-lg md:text-xl text-gray-700 italic">
                        "{loveQuote}"
                    </p>
                    <div className="absolute -right-4 -bottom-4 text-9xl opacity-5 pointer-events-none select-none">
                        {isBunny ? '❤' : '⭐'}
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Left Column: Partner Info & Partner's Yesterday */}
                    <div className="space-y-6 flex flex-col">
                        <WeatherCard 
                            partnerState={partnerState} 
                            partnerRole={partnerRole}
                            onUpdatePartner={(newState) => handleUpdateUser(partnerRole, newState)} 
                        />
                        <PartnerDailyCard partnerState={partnerState} partnerRole={partnerRole} />
                    </div>

                    {/* Right Column: Countdown & Planner */}
                    <div className="h-full">
                         <CountdownCard 
                            nextMeetingDate={appData.nextMeetingDate}
                            plans={appData.meetingPlans}
                            onUpdateDate={updatePlanDate}
                            onAddPlan={addPlan}
                            onTogglePlan={togglePlan}
                            theme={isBunny ? 'bunny' : 'puppy'}
                         />
                    </div>
                </div>

                {/* Second Grid: Tasks & Capsules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TaskSection 
                        tasks={appData.tasks}
                        totalPoints={appData.totalPoints}
                        onToggleTask={toggleTask}
                        currentRole={role}
                        onRefreshTask={refreshDailyTask}
                    />
                    <CapsuleSection 
                        capsules={appData.capsules}
                        onAddCapsule={addCapsule}
                        currentRole={role}
                    />
                </div>

                {/* Floating Action Button for Status Update */}
                <div className="fixed bottom-8 right-8 z-40">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={`group flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 ${btnColor}`}
                        title="更新我的状态"
                    >
                        <span className="text-2xl group-hover:animate-spin">✏️</span>
                    </button>
                    <span className="absolute right-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        告诉TA你的状态
                    </span>
                </div>

                <UpdateStatusModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    currentState={currentUserState}
                    onUpdate={handleStatusUpdate}
                    role={role}
                />

                <footer className="text-center text-gray-300 text-xs mt-12 pb-4">
                    LoveSpace © {new Date().getFullYear()} • Powered by Gemini
                </footer>
            </div>
        </div>
    );
}

export default App;