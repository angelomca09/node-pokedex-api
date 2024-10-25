import { prisma } from "../lib/prisma";
import fs from "fs"
import { downloadPokemonImages } from "./pokemon/downloadPokemonImage";

export async function populateDB() {

  console.log("\nLoading all Pokemon data...")
  let pokemonsJSON = JSON.parse(fs.readFileSync("src/util/pokemon/pokemons.json", "utf-8"))

  let typesSet = new Set<string>();
  let pokemon_types: any[] = []

  // Clean the Pokemon Table
  console.log("\nDeleting existing DB data...")
  await prisma.pokemonTypes.deleteMany()
  await prisma.pokemon.deleteMany()
  await prisma.type.deleteMany()

  const animatedDir = "./images/animated";
  const iconDir = "./images/icons";

  //Verify if paths exists and create them if needed
  console.log("\nChecking paths...")
  if (!fs.existsSync(animatedDir)) {
    console.log("'images/animated' does not exists! Creating it...")
    fs.mkdirSync(animatedDir, { recursive: true })
  }
  if (!fs.existsSync(iconDir)) {
    console.log("'images/icon' does not exists! Creating it...")
    fs.mkdirSync(iconDir, { recursive: true })
  }
  console.log("Paths checked!")

  // Create every pokemon without Types
  console.log("\nCreating Pokemons...")
  for (let pokemon of pokemonsJSON) {

    pokemon.types.forEach((type: any) => {
      //Add Type to Set
      typesSet.add(type)


      pokemon_types.push({ name: pokemon.name, type })
    })

    // Delete the key 'types' from pokemon object
    delete pokemon.types;

    const [url, icon] = await downloadPokemonImages(+pokemon.pokeDex)

    pokemon.url = url
    pokemon.icon = icon

    await prisma.pokemon.create({
      data: pokemon
    })
  }

  // Get all pokemons with IDs
  const allPokemons = await prisma.pokemon.findMany();

  // Create all Types based on Set of Types
  console.log("\nCreating Types...")
  for (let type of [...typesSet.values()]) {
    await prisma.type.create({
      data: { name: type }
    })
  }

  // Get all types with IDs
  const allTypes = await prisma.type.findMany();

  // Create all Relation between Pokemon - Type
  console.log("\nRelating Pokemons and Types...")
  for (let relation of pokemon_types) {

    const pokemonId = allPokemons.find(pokemon => pokemon.name === relation.name)?.id

    const typeId = allTypes.find(type => type.name === relation.type)?.id

    if (!pokemonId) continue
    if (!typeId) continue

    const data = {
      pokemonId,
      typeId
    }

    await prisma.pokemonTypes.create({
      data
    })
  }

  console.log("\nDB created!!\n")
}

populateDB()