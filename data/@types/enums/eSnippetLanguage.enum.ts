export enum eSnippetLanguage {
  C = 'c',
  'C++' = 'cpp',
  Assembly = 'assembly',
  Js = 'js',
}

export const languageMap = new Map<eSnippetLanguage, string>([
  [eSnippetLanguage.C, 'C'],
  [eSnippetLanguage['C++'], 'C++'],
  [eSnippetLanguage.Assembly, 'Assembly'],
  [eSnippetLanguage.Js, 'JavaScript'],
]);
