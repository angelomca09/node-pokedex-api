import { FastifyInstance } from "fastify";
import pokemonControllers from "../controllers/pokemon.controllers";

export async function pokemonRoutes(app: FastifyInstance) {
  app.get("/pokemons", pokemonControllers.getAllPokemons)
  app.get("/pokemons/:pokeDex", pokemonControllers.getPokemonByPokedex)
}