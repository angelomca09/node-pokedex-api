import { resolve } from "node:path";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import axios from "axios"

const pump = promisify(pipeline);

export async function downloadPokemonImages(pokeDex: number) {

  const baseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions"

  const animatedUrl = baseUrl.concat(`/generation-v/black-white/animated/${pokeDex}.gif`)
  const iconUrl = baseUrl.concat(`/generation-vii/icons/${pokeDex}.png`)

  const animatedResult = await axios.get(animatedUrl, { responseType: "stream" });
  const iconResult = await axios.get(iconUrl, { responseType: "stream" });

  const animatedFilename = `${pokeDex}.gif`;
  const iconFilename = `${pokeDex}.png`;

  const animatedFilePath = resolve(__dirname, "../../../images/animated", animatedFilename)
  const iconFilePath = resolve(__dirname, "../../../images/icons", iconFilename)

  const animatedWriteStream = createWriteStream(animatedFilePath);
  const iconWriteStream = createWriteStream(iconFilePath);

  await pump(animatedResult.data, animatedWriteStream);
  await pump(iconResult.data, iconWriteStream);

  return [`images/animated/${animatedFilename}`, `images/icons/${iconFilename}`]
}