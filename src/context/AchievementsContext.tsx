import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Achievement, AchievementSlug, achievements } from "../utils/achievements";
import { toast } from "react-toastify";

type AchievementsContextState = {
  completedAchievements: Achievement[];
  notifyAction: (action: AchievementSlug) => void;
};


const AchievementsContext = createContext<AchievementsContextState | undefined>(undefined);

export const AchievementsProvider = ({ children }: { children: ReactNode}) => {
  const [completedAchievementsSlugs, setCompletedAchievementsSlugs] = useState<AchievementSlug[]>(() => {
    const savedAchievements = localStorage.getItem('completedAchievements');
    return savedAchievements ? JSON.parse(savedAchievements) : [];
  });

  useEffect(() => {
    localStorage.setItem('completedAchievements', JSON.stringify(completedAchievementsSlugs));
  }, [completedAchievementsSlugs]);

  const notifyAction = (action: AchievementSlug) => {
    if (!completedAchievementsSlugs.includes(action)) {
      const achievement = achievements.find(a => a.slug === action);
      if (achievement) {
        toast.success(achievement.description, {
          icon: '🏆',
        });
        setCompletedAchievementsSlugs(prev => [...prev, action]);
      }
    }
  };

  const completedAchievements = achievements.filter(a => completedAchievementsSlugs.includes(a.slug)); 

  return (
    <AchievementsContext.Provider value={{ completedAchievements, notifyAction }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within a AchievementsProvider');
  }
  return context;
};
