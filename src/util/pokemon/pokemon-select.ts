export const noStats = {
  id: true,
  name: true,
  pokeDex: true,
  icon: true,
}

export const completeSelect = {
  id: true,
  name: true,
  pokeDex: true,
  url: true,
  icon: true,
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