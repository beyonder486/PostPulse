// components/SocialProof.tsx
interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export default function SocialProof() {
  const testimonials: Testimonial[] = [
    {
      quote: "This tool saved me 5 hours a week!",
      author: "Sarah",
      role: "Freelance Designer"
    }
  ];

  return (
    <div className="mt-8 text-center">
      {testimonials.map((testimonial, index) => (
        <div key={index}>
          <p className="text-gray-400 italic">&quot;{testimonial.quote}&quot;</p>
          <div className="flex justify-center mt-2">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {testimonial.author.charAt(0)}
            </div>
            <p className="text-white ml-2">
              – {testimonial.author}, {testimonial.role}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}