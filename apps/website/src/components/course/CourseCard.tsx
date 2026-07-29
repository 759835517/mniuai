import Link from "next/link";

interface CourseCardProps {
  course: {
    slug: string;
    title: string;
    persona: string;
    personaColor: string;
    difficulty: string;
    duration: string;
    price: number;
    originalPrice: number;
    students: number;
    guarantee: boolean;
    emoji: string;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group bg-white border border-gray-200 hover:border-orange-300 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl relative">
        {course.emoji}
        {course.guarantee && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            🤝 保障
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${course.personaColor}`}>
            {course.persona}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {course.difficulty}
          </span>
          <span className="text-xs text-gray-400">{course.duration}</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-orange-500">¥{course.price}</span>
            <span className="text-xs text-gray-400 line-through ml-1">¥{course.originalPrice}</span>
          </div>
          <span className="text-xs text-gray-400">{course.students.toLocaleString()}人</span>
        </div>
      </div>
    </Link>
  );
}
