import { prisma } from "../lib/prisma";
import { onlyTypeNames } from "../util/pokemon/pokemon-maps";
import { completeSelect, noStats } from "../util/pokemon/pokemon-select";

async function getAllPokemons(page: number = 1, maxResults: number = 15, name: string = "") {

  let take = 1;
  if (maxResults > 1) take = maxResults

  let skip = 0;
  if (page > 0) skip = (page - 1) * take

  const nameQuery = name ? { name: { contains: name } } : {}

  const allPokemons = await prisma.pokemon.findMany({
    select: noStats,
    where: nameQuery,
    skip,
    take,
    orderBy: {
      pokeDex: "asc"
    }
  })

  return allPokemons
}

async function getPokemon(pokemonId: string) {
  const pokemon = await prisma.pokemon.findUnique({
    where: { id: pokemonId },
    select: completeSelect
  })

  if (pokemon) pokemon.types = pokemon.types.map(onlyTypeNames)

  return pokemon
}

async function getPokemonByPokedex(pokeDex: string) {
  const pokemon = await prisma.pokemon.findUnique({
    where: { pokeDex },
    select: completeSelect
  })

  if (pokemon) pokemon.types = pokemon.types.map(onlyTypeNames)

  return pokemon
}

export default {
  getAllPokemons,
  getPokemon,
  getPokemonByPokedex
}