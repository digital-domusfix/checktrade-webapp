import { useEffect, useState } from 'react';
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

const TestimonialsSection = () => {
  const [motionDiv, setMotionDiv] = useState<React.ComponentType<any> | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(query.matches);
    import('framer-motion').then((mod) => {
      setMotionDiv(() => mod.motion.div);
    });
  }, []);

  const Container = motionDiv || 'div';
  const Item = motionDiv || 'div';

  const containerProps = reduceMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true },
        variants: {
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        },
      };

  const itemVariants = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      };

  const hoverProps = reduceMotion ? {} : { whileHover: { scale: 1.03 } };

  return (
    <SectionWrapper id="testimonials" title="What Homeowners Say" className="bg-white">
      <Container
        className="overflow-x-auto flex gap-6 snap-x sm:grid sm:grid-cols-2 sm:overflow-visible"
        {...containerProps}
      >
        {testimonials.map((t, i) => (
          <Item
            key={i}
            className="shrink-0 snap-center bg-base p-6 rounded shadow-sm flex gap-4 items-start"
            variants={itemVariants}
            {...hoverProps}
          >
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
          </Item>
        ))}
      </Container>
    </SectionWrapper>
  );
};

export default TestimonialsSection;
