import { SectionWrapper } from '../../components/SectionWrapper';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'James',
    location: 'Halifax',
    quote: '“Saved me hours. The quote I got was fair and quick.”',
    avatar: '/avatars/james.jpg',
  },
  {
    name: 'Sara',
    location: 'Sydney',
    quote: '“I loved how local and personal everything felt.”',
    avatar: '/avatars/sara.jpg',
  },
];

const TestimonialsSection = () => (
  <SectionWrapper id="testimonials" title="What Homeowners Say" className="bg-white">
    <div className="grid gap-6 sm:grid-cols-2">
      {testimonials.map((t, i) => (
        <div key={i} className="bg-base p-6 rounded shadow-sm flex gap-4 items-start">
          <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="italic text-gray-700">{t.quote}</p>
            <div className="flex items-center text-yellow-500 my-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="font-semibold text-gray-800">
              {t.name} — {t.location}
            </p>
          </div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default TestimonialsSection;
