import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import  Modal  from '../../components/Modal';
import { ContactPerson, getContactById, updateContact, deleteContact } from '../../services/contactService';

const EditContactPage = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<ContactPerson | null>(null);
  const [form, setForm] = useState<ContactPerson | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!contactId) return;
    getContactById(contactId).then((data) => {
      setContact(data);
      setForm({ ...data });
    });
  }, [contactId]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form?.fullName) errs.fullName = 'Name is required.';
    if (!form?.email) errs.email = 'Email is required.';
    if (!form?.phone) errs.phone = 'Phone number is required.';
    return errs;
  };

  const handleChange = (field: keyof ContactPerson, value: string) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (!form) return;
    setSaving(true);
    try {
      await updateContact(form);
      navigate(-1);
    } catch {
      alert('Failed to update contact.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form) return;
    setDeleting(true);
    try {
      await deleteContact(form.id);
      setShowDeleteModal(false);
      navigate(-1);
    } catch {
      alert('Failed to delete contact.');
    } finally {
      setDeleting(false);
    }
  };

  if (!form) return <div className="p-6">Loading contact…</div>;

  return (
    <div className="mx-auto max-w-md space-y-6 bg-white p-6 shadow-md rounded">
      <h2 className="text-xl font-semibold">Edit Contact</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          className="w-full rounded border p-2"
          value={form.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
        />
        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}

        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full rounded border p-2"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

        <label className="block text-sm font-medium">Phone</label>
        <input
          type="tel"
          className="w-full rounded border p-2"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      <div className="flex justify-between">
        <Button onClick={() => navigate(-1)} variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>

      <hr />

      <div className="flex justify-end">
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
          Delete Contact
        </Button>
      </div>

      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600">Delete this contact?</h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone. This contact will be removed from the property.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditContactPage;
