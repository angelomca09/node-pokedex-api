export const noStats = {
  id: true,
  name: true,
  pokeDex: true,
  url: true,
  types: {
    select: { type: { select: { name: true } } }
  }
}

export const completeSelect = {
  id: true,
  name: true,
  pokeDex: true,
  url: true,
  hp: true,
  attack: true,
  defense: true,
  spAtk: true,
  spDef: true,
  speed: true,
  total: true,
  types: {
    select: { type: { select: { name: true } } }
  }
}