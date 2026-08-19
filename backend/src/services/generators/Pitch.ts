import type { OctaveType,typeDifficultyDistance,typeDifficultyOctave } from "./typeGenerators";


const NOTES   = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const octaveLocation = [
    2,   // B0
    14,  // B1
    26,  // B2
    38,  // B3
    50,  // B4
    62,  // B5
    74,  // B6
    86,  // B7
    87   // C8
];
const getNoteName = (note: number): string => {
    return NOTES[note % 12];
};

const getRandomNoteInOctave = (octave: OctaveType) => {
    const minNote = octaveLocation[octave.minOctave];
    const maxNote = octaveLocation[octave.maxOctave];

    return (
        Math.floor(Math.random() * (maxNote - minNote + 1)) +
        minNote
    );
};

const getNote = (
    root: number,
    distance: number,
    octave: OctaveType
) => {
    const minNote = octaveLocation[octave.minOctave];
    const maxNote = octaveLocation[octave.maxOctave];

    const canUp = root + distance <= maxNote;
    const canDown = root - distance >= minNote;

    let target: number;

    if (canUp && canDown) {
        target = root + (Math.random() < 0.5 ? distance : -distance);
    } else if (canUp) {
        target = root + distance;
    } else {
        target = root - distance;
    }

    return target;
};
const OctaveNumber = {
    easy: {
        minOctave: 3,
        maxOctave: 5,
    },

    medium: {
        minOctave: 2,
        maxOctave: 7,
    },

    hardHight: {
        minOctave: 6,
        maxOctave: 8,
    },

    hardLow: {
        minOctave: 0,
        maxOctave: 4,
    },

    extreme: {
        minOctave: 0,
        maxOctave: 8,
    },
};

export const generatePitchDirectionQuestion = (
    octaveDifficulty: typeDifficultyOctave,
    maxDistance: number,
    allowSame: boolean,
) => {
    const octave : OctaveType = OctaveNumber[octaveDifficulty]
    const root = getRandomNoteInOctave(octave);

    const distance =
        Math.floor(Math.random() * maxDistance) +
        (allowSame ? 0 : 1);

    const target = getNote(root, distance, octave);

    return [
        getNoteName(root),
        getNoteName(target),
    ];
};

const distanceRange = {
    easy: [3, 8],
    medium: [2, 10],
    hard: [1, 12],
};

const questionNoteCount = {
    // not dc tim bang for nen can tru 1
    "nghelonhoacnhonhat": 2,
    "tim2notbangnhau": 3,
};


type QuestionType =
    | "nghelonhoacnhonhat"
    | "tim2notbangnhau";

export const generateHighestLowestPitchQuestion = (
    octaveDifficulty: typeDifficultyOctave,
    difficulty: typeDifficultyDistance = "easy",
    questionType: QuestionType = "nghelonhoacnhonhat",
) => {
    const octave : OctaveType = OctaveNumber[octaveDifficulty]
    const minNote = octaveLocation[octave.minOctave];
    const maxNote = octaveLocation[octave.maxOctave];

    const root = getRandomNoteInOctave(octave);

    const range = distanceRange[difficulty];

    const possibleNotes: number[] = [];

    for (let note = minNote; note <= maxNote; note++) {
        const distance = Math.abs(note - root);

        if (
            distance >= range[0] &&
            distance <= range[1]
        ) {
            possibleNotes.push(note);
        }
    }

    const note1 =
        possibleNotes[
            Math.floor(Math.random() * possibleNotes.length)
        ];

    const remainingNotes = possibleNotes.filter(
        note => note !== note1
    );

    const note2 =
        remainingNotes[
            Math.floor(Math.random() * remainingNotes.length)
        ];

    let result = [
        getNoteName(root),
        getNoteName(note1),
        getNoteName(note2),
    ];

    if (questionType === "tim2notbangnhau") {
        const duplicateIndex =
            Math.floor(Math.random() * 3);

        const duplicateNote =
            result[
                Math.floor(Math.random() * 3)
            ];

        result.splice(
            duplicateIndex,
            0,
            duplicateNote
        );
    }

    return result;
};





// day ko phai chung voi 2 cai kia
export const generateIntervalIdentificationQuestion = (
    
)=>{

}