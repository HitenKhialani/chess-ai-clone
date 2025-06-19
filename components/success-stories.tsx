import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "FIDE Master",
    rating: "2300+",
    image: "/testimonials/sarah.jpg",
    content:
      "Endgame's AI analysis helped me identify critical weaknesses in my game. The personalized training plan was instrumental in my recent tournament success.",
  },
  {
    name: "Michael Patel",
    role: "Club Player",
    rating: "1800+",
    image: "/testimonials/michael.jpg",
    content:
      "The interactive lessons and real-time feedback have transformed my understanding of chess. I've gained 300 rating points in just 6 months!",
  },
  {
    name: "Emma Wilson",
    role: "Chess Coach",
    rating: "2100+",
    image: "/testimonials/emma.jpg",
    content:
      "I recommend Endgame to all my students. The AI-powered analysis and comprehensive curriculum make teaching and learning chess much more effective.",
  },
]

export default function SuccessStories() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-[#4f46e5]">Success Stories</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What Our Users Say
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Join thousands of players who have improved their chess game with Endgame.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col justify-between rounded-2xl bg-[#1f2937] p-8 ring-1 ring-[#374151] xl:p-10"
            >
              <div className="flex items-center gap-x-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#13151a]">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-x-2">
                    <h3 className="text-lg font-semibold leading-6 text-white">
                      {testimonial.name}
                    </h3>
                    <div className="text-sm text-[#4f46e5]">{testimonial.rating}</div>
                  </div>
                  <p className="text-sm leading-6 text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <div className="mt-8 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <blockquote className="mt-6 text-base leading-6 tracking-wide text-gray-300">
                {testimonial.content}
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 