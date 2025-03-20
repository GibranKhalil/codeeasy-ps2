export enum eSnippetEngine {
  Athena = 'athena',
  Tyra = 'tyra',
}

export const enginesMap = new Map<eSnippetEngine, string>([
  [eSnippetEngine.Athena, 'AthenaENV'],
  [eSnippetEngine.Tyra, 'Tyra'],
]);
