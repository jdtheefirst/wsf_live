export const programLevels = [
  {
    slug: "beginner-program",
    title: "Beginner",
    belt_range: "White – Yellow – Orange",
    suggestedDurationWeeks: 8,
    level: "beginner" as const,
  },
  {
    slug: "intermediate-program",
    title: "Intermediate",
    belt_range: "Red – Purple – Green",
    suggestedDurationWeeks: 12,
    level: "intermediate" as const,
  },
  {
    slug: "advanced-program",
    title: "Advanced",
    belt_range: "Blue – Brown – Black 1st Dan",
    suggestedDurationWeeks: 20,
    level: "advanced" as const,
  },
  {
    slug: "elite-program",
    title: "Elite",
    belt_range: "Black 2nd – 4th Dan",
    suggestedDurationWeeks: 40,
    level: "expert" as const,
  },
];

export function getCurrentProgram(beltLevel: number) {
  return programLevels[beltLevel] || programLevels[0];
}

export function getProgramBySlug(slug: string) {
  return programLevels.find((program) => program.slug === slug);
}

// Convert old belt level to program progress
export function getProgramProgress(beltLevel: number) {
  const currentProgram = getCurrentProgram(beltLevel);
  const completedPrograms = programLevels.slice(0, beltLevel);
  const remainingPrograms = programLevels.slice(beltLevel + 1);

  return {
    currentProgram,
    completedPrograms,
    remainingPrograms,
    totalPrograms: programLevels.length,
    progressPercentage: (beltLevel / programLevels.length) * 100,
  };
}
