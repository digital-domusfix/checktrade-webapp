import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import Toast from '../../components/Toast';
import profileService from '../../services/profileService';
import { useAuthStore } from '../../store/useAuthStore';

const cities = [
  'Halifax',
  'Dartmouth',
  'Sydney',
  'Truro',
  'New Glasgow',
  'Yarmouth',
];

interface ProfileSetupPageProps {
  /**
   * Show the "Skip for now" link. Defaults to the value of the
   * `VITE_SHOW_PROFILE_SKIP_LINK` environment variable (true unless it is
   * explicitly set to "false").
   */
  showSkipLink?: boolean;
}

export default function ProfileSetupPage({
  showSkipLink,
}: ProfileSetupPageProps = {}) {
  const shouldShowSkip =
    showSkipLink ?? import.meta.env.VITE_SHOW_PROFILE_SKIP_LINK !== 'false';
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [nexting, setNexting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.profile?.userId);
  const [toastMessage, setToastMessage] = useState('');

  const phoneDigits = phone.replace(/\D/g, '').slice(0, 10);
  const isPhoneValid = /^(902|782)\d{7}$/.test(phoneDigits);

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
    if (!isPhoneValid) e.phone = 'Enter a valid 902 or 782 phone number';
    setErrors(e);
    return e;
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
    return e;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setPhoto(f);
  };

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [photo]);

  useEffect(() => {
    setNexting(false);
  }, [step]);

  const next = () => {
    if (step !== 1) return;
    setNexting(true);
    const errs = validateStep1();
    if (Object.keys(errs).length === 0) {
      setStep(2);
    } else {
      setNexting(false);
      const first = Object.keys(errs)[0];
      const map: Record<string, React.RefObject<HTMLInputElement>> = {
        firstName: firstNameRef,
        lastName: lastNameRef,
        phone: phoneRef,
      };
      map[first]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const finish = async () => {
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      const map: Record<string, React.RefObject<HTMLInputElement>> = {
        city: cityRef,
        photo: fileRef,
      };
      map[first]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }
    setSubmitting(true);
    try {
      await profileService.updateProfile({
        userId: userId || '',
        firstName,
        lastName,
        phone: phoneDigits,
        city,
        postalCode,
      });
      navigate('/welcome');
    } catch (err: any) {
      const message = err?.message || 'Could not save profile, try again';
      setErrors({ finish: message });
      setToastMessage(message);
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
                    ref={firstNameRef}
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
                    ref={lastNameRef}
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
                  ref={phoneRef}
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
                {shouldShowSkip && (
                  <a
                    href="/dashboard"
                    className="text-sm text-primary underline"
                  >
                    Skip for now
                  </a>
                )}
                <Button
                  onClick={next}
                  disabled={!firstName || !lastName || !isPhoneValid}
                  className="flex items-center justify-center"
                >
                  {nexting && <Spinner className="mr-2 text-white" />}
                  {nexting ? 'Next…' : 'Next'}
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
                  ref={cityRef}
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
                <div className="mx-auto size-24 overflow-hidden rounded-full bg-gray-200">
                  {photo && previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="size-full object-cover"
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
      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
      )}
    </div>
  );
}
