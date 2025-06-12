import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import Toast from '../../components/Toast';
import jobService, { JobCategory, JobSubcategory } from '../../services/jobService';
import profileService from '../../services/profileService';
import { useAuthStore } from '../../store/useAuthStore';

const cities = ['Halifax','Dartmouth','Sydney','Truro','New Glasgow','Yarmouth'];
const radiusOptions = [5,10,15,25];

export default function BusinessTradePage() {
  const userId = useAuthStore((s) => s.profile?.userId);
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState('');
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [subcategories, setSubcategories] = useState<JobSubcategory[]>([]);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [yearsExp, setYearsExp] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [radius, setRadius] = useState('');
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    jobService
      .getJobCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!categoryId) { setSubcategories([]); return; }
    jobService
      .getJobSubcategories(categoryId)
      .then((res) => setSubcategories(res.data))
      .catch(() => setSubcategories([]));
  }, [categoryId]);

  const validate = () => {
    const e: Record<string,string> = {};
    if (!categoryId) e.category = 'Choose a trade';
    if (selectedSubs.length === 0) e.subs = 'Choose at least one service you offer';
    if (!city.trim()) e.city = 'City is required';
    if (postalCode && !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postalCode)) {
      e.postalCode = 'Invalid postal code';
    }
    if (!radius) e.radius = 'Select a travel radius';
    const years = yearsExp ? Number(yearsExp) : undefined;
    if (yearsExp && (Number.isNaN(years) || years < 0 || years > 50)) {
      e.yearsExp = 'Enter 0-50';
    }
    setErrors(e);
    return e;
  };

  const toggleSub = (id: string) => {
    setSelectedSubs((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    try {
      await profileService.completeOnboarding({
        userId: userId || '',
        businessName: businessName || undefined,
        tradeCategory: categoryId,
        subcategories: selectedSubs,
        yearsExperience: yearsExp ? Number(yearsExp) : undefined,
        city,
        postalCode: postalCode || undefined,
        travelRadius: Number(radius),
      });
      navigate('/welcome');
    } catch (err: any) {
      const msg = err?.message || 'Could not save profile';
      setToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    categoryId && selectedSubs.length > 0 && city && radius && !submitting;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-center text-xl font-semibold">
          Step 2 of 4 – Business &amp; Trade
        </h1>
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="biz" className="text-sm font-semibold">
              Business Name (if applicable)
            </label>
            <input
              id="biz"
              type="text"
              value={businessName}
              placeholder="e.g., Nova Plumbing Ltd."
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded border border-brand-gray p-2"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">Trade Category *</label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSelectedSubs([]);
              }}
              onBlur={validate}
              className={`w-full rounded border p-2 ${
                errors.category ? 'border-error text-error' : 'border-brand-gray'
              }`}
            >
              <option value="">Select trade</option>
              {categories.map((c) => (
                <option key={c.id.value} value={c.id.value}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm italic text-error">{errors.category}</p>
            )}
          </div>
          <AnimatePresence>
            {categoryId && (
              <motion.div
                key="subs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-1"
              >
                <p className="text-sm font-semibold">Services Offered *</p>
                <div className="space-y-1">
                  {subcategories.map((s) => (
                    <label key={s.id} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selectedSubs.includes(s.id)}
                        onChange={() => toggleSub(s.id)}
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
                {errors.subs && (
                  <p className="text-sm italic text-error">{errors.subs}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-1">
            <label htmlFor="years" className="text-sm font-semibold">
              Years of Experience
            </label>
            <input
              id="years"
              type="number"
              value={yearsExp}
              min={0}
              max={50}
              onChange={(e) => setYearsExp(e.target.value)}
              onBlur={validate}
              className={`w-full rounded border p-2 ${
                errors.yearsExp ? 'border-error text-error' : 'border-brand-gray'
              }`}
            />
            {errors.yearsExp && (
              <p className="text-sm italic text-error">{errors.yearsExp}</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="city" className="text-sm font-semibold">
              City/Town *
            </label>
            <input
              id="city"
              list="city-list"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onBlur={validate}
              className={`w-full rounded border p-2 ${
                errors.city ? 'border-error text-error' : 'border-brand-gray'
              }`}
            />
            <datalist id="city-list">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {!cities.includes(city) && city && !errors.city && (
              <p className="text-sm italic text-gray-500">Check your spelling</p>
            )}
            {errors.city && (
              <p className="text-sm italic text-error">{errors.city}</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="postal" className="text-sm font-semibold">
              Postal Code
            </label>
            <input
              id="postal"
              type="text"
              value={postalCode}
              placeholder="A1A 1A1"
              onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
              onBlur={validate}
              className={`w-full rounded border p-2 ${
                errors.postalCode ? 'border-error text-error' : 'border-brand-gray'
              }`}
            />
            {errors.postalCode && (
              <p className="text-sm italic text-error">{errors.postalCode}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">Travel Radius *</label>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              onBlur={validate}
              className={`w-full rounded border p-2 ${
                errors.radius ? 'border-error text-error' : 'border-brand-gray'
              }`}
            >
              <option value="">Select radius</option>
              {radiusOptions.map((r) => (
                <option key={r} value={r}>{r === 25 ? '25+ km' : `${r} km`}</option>
              ))}
            </select>
            {errors.radius && (
              <p className="text-sm italic text-error">{errors.radius}</p>
            )}
          </div>
          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex items-center justify-center w-full"
            >
              {submitting && <Spinner className="mr-2 text-white" />}
              {submitting ? 'Next…' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast} onDismiss={() => setToast('')} />}
    </div>
  );
}
