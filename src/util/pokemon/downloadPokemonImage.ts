import { resolve } from "node:path";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import axios from "axios"

const pump = promisify(pipeline);

export async function downloadPokemonImages(pokeDex: number) {

  console.log("Downloading Data for Pokemon ", pokeDex)
  const baseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions"

  const animatedUrl = baseUrl.concat(`/generation-v/black-white/animated/${pokeDex}.gif`)
  const iconUrl = baseUrl.concat(`/generation-vii/icons/${pokeDex}.png`)

  const animatedResult = await axios.get(animatedUrl, { responseType: "stream" }).then((res) => { console.log("Got animated gif!"); return res });
  const iconResult = await axios.get(iconUrl, { responseType: "stream" }).then((res) => { console.log("Got icon!"); return res });

  const animatedFilename = `${pokeDex}.gif`;
  const iconFilename = `${pokeDex}.png`;

  const animatedDir = "./images/animated";
  const iconDir = "./images/icons";

  const animatedFilePath = resolve(animatedDir, animatedFilename)
  const iconFilePath = resolve(iconDir, iconFilename)

  const animatedWriteStream = createWriteStream(animatedFilePath);
  const iconWriteStream = createWriteStream(iconFilePath);

  await pump(animatedResult.data, animatedWriteStream).then(() => console.log("Saved animated gif!"));
  await pump(iconResult.data, iconWriteStream).then(() => console.log("Saved icon!"));

  return [`images/animated/${animatedFilename}`, `images/icons/${iconFilename}`]
}