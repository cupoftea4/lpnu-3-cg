export type Question = {
  id: number;
  question: string;
  options?: string[];
  images?: string[];
  illustration?: string;
  rightAnswer: number;
  block: number;
}

export const tests: Question[] = [
  {
    id: 1,
    question: 'Який з цих фракталів є стохастичним ?',
    images: [
      '/test-1-1.png',
      '/test-1-2.png',
      '/test-1-3.png',
    ],
    rightAnswer: 0,
    block: 0,
  },
  {
    id: 2,
    question: 'Чи здатні фрактали належати до декількох видів одночасно?',
    options: [
      'Так',
      'Ні',
    ],
    rightAnswer: 0,
    block: 0,
  },
  {
    id: 3,
    question: 'Геометричні фрактали за рівнем самоподібності є…',
    illustration: '/test-3.png',
    options: [
      'точно самоподібні',
      'майже самоподібні',
      'статистично самоподібні'
    ],
    rightAnswer: 0,
    block: 0,
  },
  {
    id: 4,
    question: 'Чому система RGB називається апаратно-орієнтованою?',
    options: [
      'система є найбільш популярною, використовується в багатьох випадках і програмах',
      'система є простою для людського сприйняття',
      'екрани створюють кольори, випромінюючи і поєднуючи три базові, система працює за таким самим принципом'
    ],
    rightAnswer: 2,
    block: 1,
  },
  {
    id: 5,
    question: 'Як розшифровуються букви у HSL?',
    options: [
      'Hue, Saturation, Lightness',
      'Hue, Saturation, Luminance',
      'Hue, Satiation, Lightness'
    ],
    rightAnswer: 0,
    block: 1,
  },
  {
    id: 6,
    question: 'Яка модель побудована на основі суб`єктивного сприйняття кольору людиною і добре узгоджується з нею?',
    options: [
      'XYZ',
      'RGB',
      'HSL'
    ],
    rightAnswer: 2,
    block: 1,
  },
  {
    id: 7,
    question: 'Яке з цих афінних перетворень вимагає виконання двох базових?',
    options: [
      'Поворот відносно початку координат',
      'Відзеркалення відносно осі х',
      'Переміщення відносно початку координат'
    ],
    rightAnswer: 1,
    block: 2,
  },
  {
    id: 8,
    question: 'Який з цих варіантів відповіді є властивістю афінного перетворення?',
    options: [
      'зберігається паралельність ліній і площин',
      'при перетворенні завжди змінюється  пропорції об’єктів',
      'афінні перетворення є двох типів: лінійні, нелінійні'
    ],
    rightAnswer: 0,
    block: 2,
  }
]