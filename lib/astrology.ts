export function getChineseZodiac(year: number): { sign: string; emoji: string } {
  const zodiac = [
    {sign: 'Krysa', emoji: '🐀'},
    {sign: 'Buvol', emoji: '🐂'},
    {sign: 'Tygr', emoji: '🐅'},
    {sign: 'Zajíc', emoji: '🐇'},
    {sign: 'Drak', emoji: '🐉'},
    {sign: 'Had', emoji: '🐍'},
    {sign: 'Kůň', emoji: '🐎'},
    {sign: 'Koza', emoji: '🐐'},
    {sign: 'Opice', emoji: '🐒'},
    {sign: 'Kohout', emoji: '🐓'},
    {sign: 'Pes', emoji: '🐕'},
    {sign: 'Vepř', emoji: '🐖'},
  ];
  const index = (year - 4) % 12;
  return zodiac[index];
}

export function getWesternZodiac(month: number, day: number): { sign: string; emoji: string } {
  const zodiacs = [
    {sign: 'Kozoroh', emoji: '♑', from: [12, 22], to: [1, 19]},
    {sign: 'Vodnář', emoji: '♒', from: [1, 20], to: [2, 18]},
    {sign: 'Ryby', emoji: '♓', from: [2, 19], to: [3, 20]},
    {sign: 'Beran', emoji: '♈', from: [3, 21], to: [4, 19]},
    {sign: 'Býk', emoji: '♉', from: [4, 20], to: [5, 20]},
    {sign: 'Blíženci', emoji: '♊', from: [5, 21], to: [6, 20]},
    {sign: 'Rak', emoji: '♋', from: [6, 21], to: [7, 22]},
    {sign: 'Lev', emoji: '♌', from: [7, 23], to: [8, 22]},
    {sign: 'Panna', emoji: '♍', from: [8, 23], to: [9, 22]},
    {sign: 'Váhy', emoji: '♎', from: [9, 23], to: [10, 22]},
    {sign: 'Štír', emoji: '♏', from: [10, 23], to: [11, 21]},
    {sign: 'Střelec', emoji: '♐', from: [11, 22], to: [12, 21]},
  ];

  for (const z of zodiacs) {
    const [fromM, fromD] = z.from;
    const [toM, toD] = z.to;
    if (
        (month === fromM && day >= fromD) ||
        (month === toM && day <= toD)
    ) {
      return {sign: z.sign, emoji: z.emoji};
    }
  }
  return {sign: 'Kozoroh', emoji: '♑'}; // fallback
}
