import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import profileService from '../../services/profileService';

const cities = [
  'Halifax',
  'Dartmouth',
  'Sydney',
  'Truro',
  'New Glasgow',
  'Yarmouth',
];

export default function ProfileSetupPage() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const phoneDigits = phone.replace(/\D/g, '').slice(0, 10);
  const isPhoneValid = phoneDigits.length === 10;

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 10);
    if (digits.length > 6) return `(${p1}) ${p2}-${p3}`;
    if (digits.length > 3) return `(${p1}) ${p2}`;
    if (digits.length > 0) return `(${p1}`;
    return '';
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
    if (!isPhoneValid) e.phone = 'Enter a valid 10-digit number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!city.trim()) e.city = 'City is required';
    if (photo) {
      if (!['image/jpeg', 'image/png'].includes(photo.type)) {
        e.photo = 'JPG or PNG only';
      } else if (photo.size > 5 * 1024 * 1024) {
        e.photo = 'Max size 5MB';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setPhoto(f);
  };

  const next = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const finish = async () => {
    if (!validateStep2()) return;
    setSubmitting(true);
    try {
      await profileService.updateProfile({
        firstName,
        lastName,
        phone: phoneDigits,
        city,
        postalCode,
      });
      navigate('/dashboard');
    } catch {
      setErrors({ finish: 'Could not save profile, try again' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-xl font-semibold">
          {step === 1 ? 'Step 1 of 2 – Your Info' : 'Step 2 of 2 – Your Home'}
        </h1>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold"
                  >
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={validateStep1}
                    className={`w-full rounded-md border p-3 focus:border-primary focus:outline-none ${
                      errors.firstName
                        ? 'border-error text-error'
                        : 'border-brand-gray'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm italic text-error">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold"
                  >
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={validateStep1}
                    className={`w-full rounded-md border p-3 focus:border-primary focus:outline-none ${
                      errors.lastName
                        ? 'border-error text-error'
                        : 'border-brand-gray'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm italic text-error">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-semibold">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  onBlur={validateStep1}
                  placeholder="(902) 555-1234"
                  className={`w-full rounded-md border p-3 focus:border-primary focus:outline-none ${
                    errors.phone
                      ? 'border-error text-error'
                      : 'border-brand-gray'
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm italic text-error">{errors.phone}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <a href="/dashboard" className="text-sm text-primary underline">
                  Skip for now
                </a>
                <Button
                  onClick={next}
                  disabled={!firstName || !lastName || !isPhoneValid}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label htmlFor="city" className="block text-sm font-semibold">
                  City/Town *
                </label>
                <input
                  id="city"
                  list="city-list"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={validateStep2}
                  className={`w-full rounded-md border p-3 focus:border-primary focus:outline-none ${
                    errors.city
                      ? 'border-error text-error'
                      : 'border-brand-gray'
                  }`}
                />
                <datalist id="city-list">
                  {cities.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {!cities.includes(city) && city && !errors.city && (
                  <p className="text-sm italic text-gray-500">
                    Check your spelling
                  </p>
                )}
                {errors.city && (
                  <p className="text-sm italic text-error">{errors.city}</p>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="postal" className="block text-sm font-semibold">
                  Postal Code (optional)
                </label>
                <input
                  id="postal"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full rounded-md border border-brand-gray p-3 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2 text-center">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFile}
                  className="hidden"
                />
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-gray-200">
                  {photo && (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                {photo ? (
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    className="text-sm text-primary underline"
                  >
                    Remove Photo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-sm text-primary underline"
                  >
                    Add Photo
                  </button>
                )}
                {errors.photo && (
                  <p className="text-sm italic text-error">{errors.photo}</p>
                )}
              </div>
              {errors.finish && (
                <p className="text-sm italic text-error">{errors.finish}</p>
              )}
              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={back}>
                  Back
                </Button>
                <Button
                  onClick={finish}
                  disabled={submitting || !city}
                  className="flex items-center justify-center"
                >
                  {submitting && <Spinner className="mr-2 text-white" />}
                  {submitting ? 'Saving…' : 'Finish'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
