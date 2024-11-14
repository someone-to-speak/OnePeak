const useProblems = (learnLanguage: string) => {
  const problems = [
    { type: "word", label: `${learnLanguage} 단어 문제`, url: `/challenge/word/${learnLanguage}` },
    { type: "grammar", label: `${learnLanguage} 문법 문제`, url: `/challenge/grammar/${learnLanguage}` }
  ];

  return problems;
};

export default useProblems;
