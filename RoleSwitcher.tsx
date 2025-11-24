import React, { useState, useRef } from 'react';
import { CharacterType } from '../types';

interface RoleSwitcherProps {
    currentRole: CharacterType;
    onSwitch: (role: CharacterType) => void;
    bunnyLocation: string;
    puppyLocation: string;
    bunnyAvatar?: string;
    puppyAvatar?: string;
    onUpdateLocation: (role: CharacterType, location: string) => void;
    onUpdateAvatar: (role: CharacterType, avatarData: string) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ 
    currentRole, 
    onSwitch, 
    bunnyLocation, 
    puppyLocation,
    bunnyAvatar,
    puppyAvatar,
    onUpdateLocation,
    onUpdateAvatar
}) => {
    const [editingRole, setEditingRole] = useState<CharacterType | null>(null);
    const [editValue, setEditValue] = useState("");
    
    // File upload refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadTargetRole, setUploadTargetRole] = useState<CharacterType | null>(null);

    const startEditing = (role: CharacterType, currentLocation: string) => {
        setEditingRole(role);
        setEditValue(currentLocation);
    };

    const saveLocation = (role: CharacterType) => {
        if (editValue.trim()) {
            onUpdateLocation(role, editValue);
        }
        setEditingRole(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, role: CharacterType) => {
        if (e.key === 'Enter') saveLocation(role);
    };

    // Avatar Upload Logic
    const handleAvatarClick = (role: CharacterType) => {
        setUploadTargetRole(role);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && uploadTargetRole) {
            // Check size (limit to ~2MB to prevent localStorage overflow)
            if (file.size > 2 * 1024 * 1024) {
                alert("图片太大了，请选择一张小于 2MB 的图片哦~");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onUpdateAvatar(uploadTargetRole, base64String);
                // Reset
                if (fileInputRef.current) fileInputRef.current.value = "";
                setUploadTargetRole(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderAvatar = (role: CharacterType, avatarUrl?: string, defaultEmoji: string = "") => {
        const isBunny = role === CharacterType.BUNNY;
        const isActive = currentRole === role;
        
        return (
            <div className="flex flex-col items-center group relative">
                {/* Avatar Button */}
                <button
                    onClick={() => onSwitch(role)}
                    className={`relative transition-all duration-500 ease-in-out ${isActive ? 'scale-110 -translate-y-2' : 'scale-95 opacity-70 hover:opacity-100'}`}
                >
                    <div className={`w-28 h-28 rounded-full border-[6px] flex items-center justify-center bg-cover bg-center shadow-xl overflow-hidden transition-colors relative ${
                        isBunny 
                            ? (isActive ? 'border-pink-400 shadow-pink-200 bg-pink-50' : 'border-gray-100 bg-pink-50')
                            : (isActive ? 'border-orange-400 shadow-orange-200 bg-orange-50' : 'border-gray-100 bg-orange-50')
                    }`}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-7xl leading-none pt-2 filter drop-shadow-sm transform group-hover:scale-110 transition-transform">
                                {defaultEmoji}
                            </span>
                        )}
                        
                        {/* Hover Overlay for switching */}
                        {!isActive && (
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">切换视角</span>
                            </div>
                        )}
                    </div>

                    {/* "Me" Badge */}
                    {isActive && (
                        <div className={`absolute -top-2 -right-2 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-bounce ${isBunny ? 'bg-pink-500' : 'bg-orange-500'}`}>
                            Me
                        </div>
                    )}
                </button>

                {/* Camera / Upload Button (Only visible on hover or active) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAvatarClick(role);
                    }}
                    className={`absolute bottom-8 right-0 p-1.5 rounded-full bg-white shadow-md border hover:scale-110 transition-transform z-20 ${
                        isBunny ? 'text-pink-500 border-pink-100' : 'text-orange-500 border-orange-100'
                    }`}
                    title="更换头像"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                </button>
                
                {/* Location Display/Edit */}
                <div className="mt-3 flex items-center gap-1">
                    {editingRole === role ? (
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveLocation(role)}
                            onKeyDown={(e) => handleKeyDown(e, role)}
                            className={`w-24 text-center text-sm border-b-2 focus:outline-none bg-transparent ${isBunny ? 'border-pink-400' : 'border-orange-400'}`}
                            autoFocus
                        />
                    ) : (
                        <div 
                            onClick={() => startEditing(role, isBunny ? bunnyLocation : puppyLocation)}
                            className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg transition-colors ${isBunny ? 'hover:bg-pink-50' : 'hover:bg-orange-50'}`}
                        >
                            <span className="text-sm font-bold text-gray-600">📍 {isBunny ? bunnyLocation : puppyLocation}</span>
                            <span className="text-gray-300 text-xs">✎</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex justify-center gap-8 mb-8 items-end relative">
             {/* Hidden File Input */}
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />

            {renderAvatar(CharacterType.BUNNY, bunnyAvatar, "🐰")}

            {/* Heart Divider */}
            <div className="mb-12 text-gray-300 animate-pulse text-2xl">
                ❤️
            </div>

            {renderAvatar(CharacterType.PUPPY, puppyAvatar, "🐶")}
        </div>
    );
};

export default RoleSwitcher;