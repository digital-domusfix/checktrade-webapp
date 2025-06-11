import { SectionWrapper } from "../../components/SectionWrapper";

const testimonials = [
  { name: 'James — Halifax', quote: '“Saved me hours. The quote I got was fair and quick.”' },
  { name: 'Sara — Sydney', quote: '“I loved how local and personal everything felt.”' },
];

const TestimonialsSection = () => (
  <SectionWrapper id="testimonials" title="What Homeowners Say" className="bg-white">
    <div className="grid gap-6 sm:grid-cols-2">
      {testimonials.map((t, i) => (
        <div key={i} className="bg-cream-muted border-l-4 border-green-accent p-6 rounded shadow-sm">
          <p className="italic text-gray-700">{t.quote}</p>
          <p className="mt-4 font-semibold text-right text-gray-800">{t.name}</p>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default TestimonialsSection;
