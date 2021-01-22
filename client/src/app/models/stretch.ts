import StretchInstruction from './stretch-instruction';

interface Stretch {
    id: string;
    name: string;
    isUnilateral: boolean;
    instructions: StretchInstruction[];
}

export default Stretch;
