import { FastifyRequest, FastifyReply } from "fastify"
import pokemonService from "../services/pokemon.service"
import { z } from "zod"

async function getAllPokemons(request: FastifyRequest, result: FastifyReply) {
  const querySchema = z.object({
    page: z.coerce.number().nonnegative().optional(),
    maxResults: z.coerce.number().nonnegative().optional(),
    name: z.string().optional()
  })

  const { page, maxResults, name } = querySchema.parse(request.query)

  result.send(await pokemonService.getAllPokemons(page, maxResults, name))
}

async function getPokemonById(request: FastifyRequest, result: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().uuid()
  })

  const { id } = paramsSchema.parse(request.params)

  result.send(await pokemonService.getPokemon(id))
}

async function getPokemonByPokedex(request: FastifyRequest, result: FastifyReply) {
  const paramsSchema = z.object({
    pokeDex: z.string()
  })

  const { pokeDex } = paramsSchema.parse(request.params)

  result.send(await pokemonService.getPokemonByPokedex(pokeDex))
}

export default {
  getAllPokemons,
  getPokemonById,
  getPokemonByPokedex
}