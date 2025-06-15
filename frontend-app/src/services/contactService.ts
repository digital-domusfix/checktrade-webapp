import http from "../api/httpClient";

export interface ContactPerson {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isPrimary?: boolean;
}

export const getContactById = async (id: string): Promise<ContactPerson> => {
  const res = await http.get(`/contacts/${id}`);
  return res.data;
};

export const updateContact = async (contact: ContactPerson): Promise<void> => {
  await http.put(`/contacts/${contact.id}`, contact);
};

export const deleteContact = async (contactId: string): Promise<void> => {
  await http.delete(`/contacts/${contactId}`);
};

export default {
  getContactById,
  updateContact,
  deleteContact,
};
