import path from "node:path";
import fs from "node:fs";
import MidiWriter from "midi-writer-js";
import { renderMidi } from "../services/fluidSynth";
import Attempt from "../models/attempt.model";
import {
    generateHighestLowestPitchQuestion,
    generatePitchDirectionQuestion
} from "../services/generators/Pitch"

export const playNote = async(req,res)=> {
    const { pitch } = req.body; // vd: "C4"

    if (!pitch) {
        return res.status(400).json({ error: "Missing pitch" });
    }

    const id = Date.now(); // tránh trùng file khi nhiều request cùng lúc
    const midiPath = path.resolve(`tmp/${id}.mid`);
    const outputPath = path.resolve(`tmp/${id}.wav`);

    const track = new MidiWriter.Track();
    track.addEvent(
        new MidiWriter.NoteEvent({
            pitch: [pitch],
            duration: "1",
            velocity: 100,
        }),
    );

    const writer = new MidiWriter.Writer(track);
    fs.writeFileSync(midiPath, writer.buildFile());

    try {
        await renderMidi(midiPath, outputPath);
        res.sendFile(outputPath, () => {
            fs.unlinkSync(midiPath);
            fs.unlinkSync(outputPath);
        });
    } catch (err) {
        res.status(500).json({ error: "Render failed" });
    }
}
export const playAttemptPitch = async (req,res)=>{
    const userId = req.body;
    const { attemptId, questionId } = req.params;
    const attempt = Attempt.findOne(
        attemptId,
        userId
    );
}