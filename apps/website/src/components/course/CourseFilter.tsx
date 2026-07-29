"use client";

interface CourseFilterProps {
  personas: string[];
  difficulties: string[];
  selectedPersona: string;
  selectedDifficulty: string;
  onPersonaChange: (persona: string) => void;
  onDifficultyChange: (difficulty: string) => void;
}

export function CourseFilter({
  personas,
  difficulties,
  selectedPersona,
  selectedDifficulty,
  onPersonaChange,
  onDifficultyChange,
}: CourseFilterProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium text-gray-700 mb-2">人群</div>
        <div className="flex flex-wrap gap-2">
          {personas.map((p) => (
            <button
              key={p}
              onClick={() => onPersonaChange(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                p === selectedPersona
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-700 mb-2">难度</div>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                d === selectedDifficulty
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
