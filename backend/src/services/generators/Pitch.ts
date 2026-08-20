import type { OctaveType,typeDifficultyDistance,typeDifficultyOctave } from "../../types/typeGenerators";


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
    difficultyDistance: typeDifficultyDistance,
    allowSame: boolean,
) => {
    const maxDistance = distanceRange[difficultyDistance][1];
    const octave : OctaveType = OctaveNumber[octaveDifficulty];
    const root = getRandomNoteInOctave(octave);

    const distance =
        Math.floor(Math.random() * maxDistance) +
        (allowSame ? 0 : 1);

    const target = getNote(root, distance, octave);
    // const answer,question
    const difference = root - target;
    let answer
    if (difference < 0) {
        answer = "up";
    } else if (difference > 0) {
        answer = "down";
    } else {
        answer = "equal";
    }
    return {
        question : [
            getNoteName(root),
            getNoteName(root),
        ],
        answer,
    };
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
const TaoNoteKhacNhau = (
    octaveDifficulty: typeDifficultyOctave,
    difficultyDistance: typeDifficultyDistance ,
) => {
    const octave : OctaveType = OctaveNumber[octaveDifficulty]
    const minNote = octaveLocation[octave.minOctave];
    const maxNote = octaveLocation[octave.maxOctave];

    const root = getRandomNoteInOctave(octave);

    const range = distanceRange[difficultyDistance];

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
    return [root,note1,note2]
}
export const generateHighestLowestPitchQuestion = (
    octaveDifficulty: typeDifficultyOctave,
    difficultyDistance: typeDifficultyDistance = "easy",
) => {
    const [root, note1, note2] = TaoNoteKhacNhau(
        octaveDifficulty,
        difficultyDistance
    );
    const max = Math.max(root, note1, note2); 
    const min = Math.min(root, note1, note2); 

    return {
        question : [
            getNoteName(root),
            getNoteName(note1),
            getNoteName(note2),
        ],
        answer : {max,min}
    };
};
export const generateMatchingPitchesQuestion = (
    octaveDifficulty: typeDifficultyOctave,
    difficultyDistance: typeDifficultyDistance = "easy",
) => {
    const [root, note1, note2] = TaoNoteKhacNhau(
        octaveDifficulty,
        difficultyDistance
    );
    let result = [
        getNoteName(root),
        getNoteName(note1),
        getNoteName(note2),
    ];

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
    const duplicate = result.find(
        (note, index) => result.indexOf(note) !== index
    );
    return {
        question : result,
        answer : duplicate,
    }
}
