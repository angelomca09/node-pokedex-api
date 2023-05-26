import { resolve } from "node:path";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import axios from "axios"

const pump = promisify(pipeline);

export async function downloadPokemonImage(pokeDex: number) {
  const sourceUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeDex}.png`

  const sourceResult = await axios.get(sourceUrl, { responseType: "stream" });

  const filename = `${pokeDex}.png`;

  const filePath = resolve(__dirname, "../../../images", filename)

  const writeStream = createWriteStream(filePath);

  await pump(sourceResult.data, writeStream);

  return `images/${filename}`
}