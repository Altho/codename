import type { CastResult } from "$lib/types/TGameplay";
import { supabase } from "$lib/db/client";
import { classesStore } from "$lib/stores/classes";
import type { BuiltClass } from "$lib/types/TGameplay";

export class Die {
  private value: number;
  private name: string;
  private trigger: number;
  public roll: () => CastResult;
  constructor(value: number, name: string, trigger: number) {
    this.value = value;
    this.name = name;
    this.trigger = trigger;
    this.roll = function () {
      const rollValue: number = Math.floor(Math.random() * this.value + 1);
      const result: CastResult = {
        value: rollValue,
        didTriggerEffect: rollValue === trigger,
        effectAmount: 1, //TODO: Remove this placeholder
      };
      return result;
    };
  }
}

export const loadClasses = async () => {
  const { data, error } = (await supabase.from("Classes").select(`
            *,
            SituationalBonuses (*),
            UniqueBonuses (*),
            TRC (*),
            SPC (*),
            ClassesEffect (
                CriticalEffects (
                    id,
                    Name,
                    DcEffect,
                    TriggeredOn,
                    Scales (*),
                    BonusFor (*)
                )
            )
        `)) as { data: BuiltClass[] | null; error: any };

  if (!error) {
    classesStore.set(data as BuiltClass[]);
  } else {
    console.error("Error:", error);
  }
};
