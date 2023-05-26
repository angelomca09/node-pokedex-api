import fastify from "fastify";
import cors from "@fastify/cors";
import staticF from "@fastify/static";

import { pokemonRoutes } from "./routes/pokemon.route";
import { resolve } from "node:path";

const app = fastify();

app.register(staticF, { // Serving images as static files
  root: resolve(__dirname, "../images"),
  prefix: "/images"
})

app.register(cors, {
  origin: true, // All URLs can access the API
});

// Routes
app.register(pokemonRoutes)

app
  .listen({
    port: 3333,
    host: "0.0.0.0", // To Run on Android Mobile Apps
  })
  .then(() => {
    console.log("🌐 Pokedex API running!\n🔗 http://localhost:3333/pokemons");
  });