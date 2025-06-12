import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import legalService from '../../services/legalService';

const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

export default function LegalCredentialsPage() {
  const navigate = useNavigate();
  const insuranceRef = useRef<HTMLInputElement>(null);
  const businessRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);

  const [soleTrader, setSoleTrader] = useState(false);
  const [insurance, setInsurance] = useState<File | null>(null);
  const [business, setBusiness] = useState<File | null>(null);
  const [govId, setGovId] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    Record<string, 'idle' | 'uploading' | 'success'>
  >({});
  const [docIds, setDocIds] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) return 'Unsupported format';
    if (file.size > 10 * 1024 * 1024) return 'File too large';
    return '';
  };

  const handleFile = (
    file: File | null,
    setter: (f: File | null) => void,
    key: string,
  ) => {
    if (!file) return;
    const err = validateFile(file);
    setErrors((e) => ({ ...e, [key]: err }));
    if (err) return;
    setStatus((s) => ({ ...s, [key]: 'uploading' }));
    legalService
      .uploadDocument(file)
      .then((res) => {
        setter(file);
        setDocIds((d) => ({ ...d, [key]: res.id }));
        setStatus((s) => ({ ...s, [key]: 'success' }));
      })
      .catch(() => {
        setErrors((e) => ({ ...e, [key]: 'Upload failed' }));
        setStatus((s) => ({ ...s, [key]: 'idle' }));
      });
  };

  const canSubmit =
    status.insurance === 'success' &&
    status.govId === 'success' &&
    (soleTrader || status.business === 'success' || !businessRef.current) &&
    agree;

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!insurance) e.insurance = 'Required';
    if (!soleTrader && !business) e.business = 'Required';
    if (!govId) e.govId = 'Required';
    if (!agree) e.agree = 'You must accept the terms';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    try {
      await legalService.submitCredentials({
        insuranceId: docIds.insurance,
        businessId: docIds.business,
        govId: docIds.govId!,
        soleTrader,
      });
      navigate('/welcome');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-xl font-semibold">
          Step 3 of 4 – Legal &amp; Verification
        </h1>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={soleTrader}
              onChange={(e) => setSoleTrader(e.target.checked)}
            />
            I&apos;m a sole trader
          </label>
          <div className="space-y-1">
            <label htmlFor="insurance" className="text-sm font-semibold">
              Proof of Insurance *
            </label>
            <input
              ref={insuranceRef}
              id="insurance"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                handleFile(
                  e.target.files && e.target.files[0],
                  setInsurance,
                  'insurance',
                )
              }
              className="block w-full text-sm"
            />
            {status.insurance === 'uploading' && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Spinner className="text-primary" /> Uploading…
              </div>
            )}
            {status.insurance === 'success' && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="size-4" /> Uploaded
              </div>
            )}
            {errors.insurance && (
              <p className="text-sm italic text-error" role="alert">
                {errors.insurance}
              </p>
            )}
          </div>
          {!soleTrader && (
            <div className="space-y-1">
              <label htmlFor="business" className="text-sm font-semibold">
                Business Registration Document *
              </label>
              <input
                ref={businessRef}
                id="business"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFile(
                    e.target.files && e.target.files[0],
                    setBusiness,
                    'business',
                  )
                }
                className="block w-full text-sm"
              />
              {status.business === 'uploading' && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Spinner className="text-primary" /> Uploading…
                </div>
              )}
              {status.business === 'success' && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="size-4" /> Uploaded
                </div>
              )}
              {errors.business && (
                <p className="text-sm italic text-error" role="alert">
                  {errors.business}
                </p>
              )}
            </div>
          )}
          <div className="space-y-1">
            <label htmlFor="govId" className="text-sm font-semibold">
              Government ID *
            </label>
            <input
              ref={idRef}
              id="govId"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                handleFile(
                  e.target.files && e.target.files[0],
                  setGovId,
                  'govId',
                )
              }
              className="block w-full text-sm"
            />
            {status.govId === 'uploading' && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Spinner className="text-primary" /> Uploading…
              </div>
            )}
            {status.govId === 'success' && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="size-4" /> Uploaded
              </div>
            )}
            {errors.govId && (
              <p className="text-sm italic text-error" role="alert">
                {errors.govId}
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            I agree to the CheckTrade{' '}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              Terms and Code of Conduct
            </a>
          </label>
          {errors.agree && (
            <p className="text-sm italic text-error">{errors.agree}</p>
          )}
          <div className="flex justify-between pt-2 gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/business-profile')}
              className="w-1/2"
            >
              Back
            </Button>
            <Button
              onClick={submit}
              disabled={!canSubmit || submitting}
              className="flex items-center justify-center w-1/2"
            >
              {submitting && <Spinner className="mr-2 text-white" />}
              {submitting ? 'Submitting…' : 'Submit for Approval'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
