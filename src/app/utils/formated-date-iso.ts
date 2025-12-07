export function formatedDateISO(day: 'today' | 'tomorrow'): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  switch (day) {
    case 'today': {
      return today.toISOString().slice(0, 10);
    }
    case 'tomorrow': {
      return tomorrow.toISOString().slice(0, 10);
    }
  }
}
