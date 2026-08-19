import { execFile } from "node:child_process";
import path from "node:path";

const soundfontPath = path.resolve(
    process.cwd(),
    "src/Sound/piano.sf2"
);

export function renderMidi(midiPath: string, outputPath: string) {
    return new Promise<void>((resolve, reject) => {
        execFile(
            "fluidsynth",
            [
                "-ni",
                "-F",
                outputPath,
                soundfontPath,
                midiPath,
            ],
            (error, stdout, stderr) => {
                if (error) {
                    console.error(stderr);
                    reject(error);
                    return;
                }

                resolve();
            }
        );
    });
}