export type AchievementSlug = 
    'fractals-theory' 
  | 'colors-theory' 
  | 'transformations-theory' 
  | 'all-tests'; 

export type Achievement = {
  slug: AchievementSlug;
  title: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    slug: 'fractals-theory',
    title: 'Теорія фракталів',
    description: 'Вивчив теорію фракталів'
  },
  {
    slug: 'colors-theory',
    title: 'Теорія кольорів',
    description: 'Вивчив теорію кольорів'
  },
  {
    slug: 'transformations-theory',
    title: 'Теорія перетворень',
    description: 'Вивчив теорію перетворень'
  },
  {
    slug: 'all-tests',
    title: 'Всі тести',
    description: 'Виконав всі тести'
  }

]