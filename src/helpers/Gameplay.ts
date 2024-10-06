import type {CastResult} from "../types/TGameplay";

export class Die {
    private value: number;
    private name: string;
    private trigger: number;
    public roll: () => CastResult;
    constructor(value: number, name:string,  trigger: number) {
        this.value = value;
        this.name = name;
        this.trigger= trigger;
        this.roll = function(){
            const rollValue: number = Math.floor(Math.random() * this.value + 1);
            const result: CastResult = {
                value: rollValue,
                didTriggerEffect: rollValue === trigger,
                effectAmount: 1 //TODO: Remove this placeholder
            }
            return result;

        }
    }

}