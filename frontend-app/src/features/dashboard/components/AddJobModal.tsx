import Modal from '../../../components/Modal';
import { Property } from '../../../services/propertyService';
import AddJobForm from './AddJobForm';

interface Props {
  property: Property;
  onClose: () => void;
}

const AddJobModal = ({ property, onClose }: Props) => (
  <Modal onClose={onClose}>
    <AddJobForm property={property} onCreated={onClose} />
  </Modal>
);

export default AddJobModal;
