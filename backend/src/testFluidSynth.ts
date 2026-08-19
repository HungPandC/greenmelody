import MidiWriter from "midi-writer-js";
import path from "node:path";
import fs from "node:fs";
import { renderMidi } from "./services/fluidSynth";

async function main() {
    const midiPath = path.resolve("test.mid");
    const outputPath = path.resolve("test.wav");

    const track = new MidiWriter.Track();

    track.addEvent(
        new MidiWriter.NoteEvent({
            pitch: ["C4"],
            duration: "1",
            velocity: 100,
        }),
    );

    const writer = new MidiWriter.Writer(track);
    fs.writeFileSync(midiPath, writer.buildFile());

    await renderMidi(midiPath, outputPath);

    console.log("Done:", outputPath);
}

main();