import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jobService, { JobSubcategory } from '../../services/jobService';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';

interface Field {
  id: string;
  label: string;
  type: 'text' | 'select' | 'radio' | 'checkbox' | 'date' | 'number';
  required?: boolean;
  options?: string[];
}

const formConfigs: Record<string, Field[]> = {
  faucet: [
    {
      id: 'faucetType',
      label: 'What type of faucet?',
      type: 'select',
      required: true,
      options: ['Kitchen', 'Bathroom', 'Outdoor'],
    },
    {
      id: 'leaking',
      label: 'Is the water currently leaking?',
      type: 'radio',
      required: true,
      options: ['Yes', 'No'],
    },
  ],
  lighting: [
    {
      id: 'fixtureType',
      label: 'What kind of lights?',
      type: 'select',
      required: true,
      options: ['Ceiling', 'Wall-mounted', 'Other'],
    },
  ],
};

const Step2 = () => {
  const { state } = useLocation() as {
    state?: { categoryId: string; title: string };
  };
  const navigate = useNavigate();

  const [subcategories, setSubcategories] = useState<JobSubcategory[]>([]);
  const [subcategoryId, setSubcategoryId] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [description, setDescription] = useState('');
  const [descTouched, setDescTouched] = useState(false);
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.categoryId) return;
    jobService
      .getJobSubcategories(state.categoryId)
      .then((res) => setSubcategories(res.data))
      .catch(() => setSubcategories([]));
  }, [state]);

  useEffect(() => {
    if (!subcategoryId) {
      setFields([]);
      return;
    }
    jobService
      .getJobSubcategoryForm(subcategoryId)
      .then(() => setFields(formConfigs[subcategoryId] || []))
      .catch(() => setFields([]));
  }, [subcategoryId]);

  const handleFile = (files: FileList | null, type: 'image' | 'video') => {
    if (!files) return;
    const max = type === 'image' ? 5 : 2;
    const allowedTypes =
      type === 'image'
        ? ['image/jpeg', 'image/png', 'image/jpg']
        : ['video/mp4', 'video/quicktime'];
    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 20 * 1024 * 1024;

    const fileArr = Array.from(files);
    for (const f of fileArr) {
      if (!allowedTypes.includes(f.type)) {
        setUploadError('Unsupported format');
        return;
      }
      if (f.size > maxSize) {
        setUploadError('File too large');
        return;
      }
    }
    setUploadError(null);
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      if (type === 'image') {
        setImgFiles((prev) => [...prev, ...fileArr].slice(0, max));
      } else {
        setVideoFiles((prev) => [...prev, ...fileArr].slice(0, max));
      }
    }, 500);
  };

  const removeFile = (index: number, type: 'image' | 'video') => {
    if (type === 'image') {
      setImgFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setVideoFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const descriptionValid =
    description === '' || description.trim().length >= 20;

  const fieldsValid = fields.every((f) => {
    if (!f.required) return true;
    return answers[f.id] && answers[f.id].toString().trim() !== '';
  });

  const canSubmit =
    subcategoryId &&
    fieldsValid &&
    descriptionValid &&
    !uploading &&
    !uploadError;

  return (
    <form className="mx-auto max-w-md space-y-6 p-4">
      <p className="text-sm text-gray-600">Step 2 of 3 – Job Details</p>

      {/* Subcategory Selection */}
      <div className="space-y-1">
        <p className="text-sm font-medium">Subcategory</p>
        <div className="grid grid-cols-2 gap-3" role="radiogroup">
          {subcategories.map((sub) => (
            <motion.button
              key={sub.id}
              type="button"
              role="radio"
              aria-checked={subcategoryId === sub.id}
              whileTap={{ scale: 0.97 }}
              className={`rounded border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                subcategoryId === sub.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSubcategoryId(sub.id)}
            >
              {sub.name}
            </motion.button>
          ))}
        </div>
        {!subcategoryId && (
          <p className="text-sm text-red-500">Please choose a subcategory</p>
        )}
      </div>

      {/* Dynamic Questions */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Specific Questions</p>
        {fields.length === 0 ? (
          <p className="text-sm text-gray-500">
            We’re still adding questions for this job type. Please describe it
            in the next step.
          </p>
        ) : (
          fields.map((f) => (
            <div key={f.id} className="space-y-1">
              <label htmlFor={f.id} className="text-sm font-medium">
                {f.label}
              </label>
              {f.type === 'text' && (
                <input
                  id={f.id}
                  type="text"
                  value={answers[f.id] || ''}
                  onChange={(e) =>
                    setAnswers({ ...answers, [f.id]: e.target.value })
                  }
                  className={`w-full rounded border p-2 ${
                    f.required && !answers[f.id]
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } focus:border-primary`}
                />
              )}
              {f.type === 'number' && (
                <input
                  id={f.id}
                  type="number"
                  value={answers[f.id] || ''}
                  onChange={(e) =>
                    setAnswers({ ...answers, [f.id]: e.target.value })
                  }
                  className={`w-full rounded border p-2 ${
                    f.required && !answers[f.id]
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } focus:border-primary`}
                />
              )}
              {f.type === 'date' && (
                <input
                  id={f.id}
                  type="date"
                  value={answers[f.id] || ''}
                  onChange={(e) =>
                    setAnswers({ ...answers, [f.id]: e.target.value })
                  }
                  className={`w-full rounded border p-2 ${
                    f.required && !answers[f.id]
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } focus:border-primary`}
                />
              )}
              {f.type === 'select' && (
                <select
                  id={f.id}
                  value={answers[f.id] || ''}
                  onChange={(e) =>
                    setAnswers({ ...answers, [f.id]: e.target.value })
                  }
                  className={`w-full rounded border p-2 ${
                    f.required && !answers[f.id]
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } focus:border-primary`}
                >
                  <option value="">Select...</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              )}
              {f.type === 'radio' && (
                <div className="flex gap-4">
                  {f.options?.map((o) => (
                    <label key={o} className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name={f.id}
                        value={o}
                        checked={answers[f.id] === o}
                        onChange={(e) =>
                          setAnswers({ ...answers, [f.id]: e.target.value })
                        }
                      />
                      {o}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">
          Tell us more about the job
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => setDescTouched(true)}
          maxLength={1000}
          placeholder="Provide any extra details contractors should know…"
          className={`w-full rounded border p-2 focus:border-primary ${
            descTouched && !descriptionValid
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
          rows={4}
        />
        <div className="flex items-center justify-between text-sm">
          {descTouched && !descriptionValid && (
            <p className="text-red-500">Minimum 20 characters</p>
          )}
          <span className="ml-auto text-gray-400">
            {description.length}/1000
          </span>
        </div>
      </div>

      {/* Media Upload */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Media Upload</p>
        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
        <div className="flex gap-2">
          <label className="cursor-pointer text-sm text-primary underline">
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              hidden
              onChange={(e) => handleFile(e.target.files, 'image')}
            />
            Upload Images
          </label>
          <label className="cursor-pointer text-sm text-primary underline">
            <input
              type="file"
              accept=".mp4,.mov"
              multiple
              hidden
              onChange={(e) => handleFile(e.target.files, 'video')}
            />
            Upload Video
          </label>
          {uploading && <Spinner />}
        </div>
        {imgFiles.length > 0 && (
          <ul className="grid grid-cols-3 gap-2">
            {imgFiles.map((f, i) => (
              <li key={i} className="relative">
                <img
                  src={URL.createObjectURL(f)}
                  alt="preview"
                  className="h-24 w-full rounded object-cover"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1 rounded bg-white/70 px-1"
                  onClick={() => removeFile(i, 'image')}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        {videoFiles.length > 0 && (
          <ul className="space-y-2">
            {videoFiles.map((f, i) => (
              <li key={i} className="relative">
                <video
                  className="h-32 w-full rounded"
                  src={URL.createObjectURL(f)}
                  controls
                />
                <button
                  type="button"
                  className="absolute right-1 top-1 rounded bg-white/70 px-1"
                  onClick={() => removeFile(i, 'video')}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/post-job', { state })}
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={!canSubmit}
          onClick={() =>
            navigate('/post-job/schedule', {
              state: {
                ...state,
                subcategoryId,
                answers,
                description,
                imgFiles,
                videoFiles,
              },
            })
          }
        >
          Next: Schedule & Budget
        </Button>
      </div>
    </form>
  );
};

export default Step2;
