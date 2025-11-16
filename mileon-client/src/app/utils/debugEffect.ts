import { effect } from '@angular/core';

export function debugEffect(name: string, fn: () => void) {
  let runs = 0;

  return effect(() => {
    runs++;
    console.log(`[${name}] run #${runs}`);

    if (runs > 50) { // סף שרירותי – אם זה עובר = חשוד בלופ
      console.error(`[${name}] POSSIBLE LOOP`, new Error().stack);
      debugger; // יעצור לך בדפדפן
    }

    fn();
  });
}
