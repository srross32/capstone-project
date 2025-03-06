import { useSelector } from '../store/hooks';
import {
  useAddCandidateMutation,
  useDeleteCandidateMutation,
  useEditCandidateMutation,
  useListCandidatesForStateQuery
} from '../api';
import React from 'react';

const Admin: React.FC = () => {
  const [state, setState] = React.useState<string>('AL');
  const token = useSelector((state) => state.auth.token);
  const { data, refetch } = useListCandidatesForStateQuery(
    { state },
    {
      skip: !token
    }
  );
  const [editId, setEditId] = React.useState<number | null>(null);

  const [addMutation] = useAddCandidateMutation();
  const addCandidate = async () => {
    await addMutation({
      state,
      candidateName: 'New Candidate',
      party: 'Yes Party'
    });
    refetch();
  };

  const [deleteMutation] = useDeleteCandidateMutation();
  const deleteCandidate = async (id: number) => {
    await deleteMutation({ id });
    refetch();
  };

  const [editMutation] = useEditCandidateMutation();
  const editCandidate = async (name: string, party: string) => {
    await editMutation({
      id: editId as number,
      candidateName: name,
      party,
      state
    });
    refetch();
    setEditId(null);
  };

  return (
    <div id='admin'>
      <div className='box' style={{ minWidth: 400 }}>
        <div className='field'>
          <label className='label'>Current State</label>
          <div className='select'>
            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value='AL'>Alabama</option>
              <option value='AK'>Alaska</option>
              <option value='AZ'>Arizona</option>
              <option value='AR'>Arkansas</option>
              <option value='CA'>California</option>
              <option value='CO'>Colorado</option>
              <option value='CT'>Connecticut</option>
              <option value='DE'>Delaware</option>
              <option value='DC'>District of Columbia</option>
              <option value='FL'>Florida</option>
              <option value='GA'>Georgia</option>
              <option value='HI'>Hawaii</option>
              <option value='ID'>Idaho</option>
              <option value='IL'>Illinois</option>
              <option value='IN'>Indiana</option>
              <option value='IA'>Iowa</option>
              <option value='KS'>Kansas</option>
              <option value='KY'>Kentucky</option>
              <option value='LA'>Louisiana</option>
              <option value='ME'>Maine</option>
              <option value='MD'>Maryland</option>
              <option value='MA'>Massachusetts</option>
              <option value='MI'>Michigan</option>
              <option value='MN'>Minnesota</option>
              <option value='MS'>Mississippi</option>
              <option value='MO'>Missouri</option>
              <option value='MT'>Montana</option>
              <option value='NE'>Nebraska</option>
              <option value='NV'>Nevada</option>
              <option value='NH'>New Hampshire</option>
              <option value='NJ'>New Jersey</option>
              <option value='NM'>New Mexico</option>
              <option value='NY'>New York</option>
              <option value='NC'>North Carolina</option>
              <option value='ND'>North Dakota</option>
              <option value='OH'>Ohio</option>
              <option value='OK'>Oklahoma</option>
              <option value='OR'>Oregon</option>
              <option value='PA'>Pennsylvania</option>
              <option value='RI'>Rhode Island</option>
              <option value='SC'>South Carolina</option>
              <option value='SD'>South Dakota</option>
              <option value='TN'>Tennessee</option>
              <option value='TX'>Texas</option>
              <option value='UT'>Utah</option>
              <option value='VT'>Vermont</option>
              <option value='VA'>Virginia</option>
              <option value='WA'>Washington</option>
              <option value='WV'>West Virginia</option>
              <option value='WI'>Wisconsin</option>
              <option value='WY'>Wyoming</option>
            </select>
          </div>
          <hr />
          <h5 className='title is-5'>Candidates</h5>
          {data?.map((candidate) => (
            <div
              key={candidate.id}
              className='box'
              style={{ margin: '20px 0' }}
            >
              <h6 className='title is-6'>{candidate.name}</h6>
              <p style={{ marginTop: 10 }}>{candidate.party}</p>
              <div className='buttons' style={{ marginTop: 20 }}>
                <button
                  className='button is-warning'
                  onClick={() => setEditId(candidate.id)}
                >
                  Edit
                </button>
                <button
                  className='button is-danger'
                  onClick={() => deleteCandidate(candidate.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button className='button is-primary' onClick={addCandidate}>
            Add Candidate
          </button>
        </div>
      </div>
      {editId !== null && (
        <EditModal
          name={data?.find((candidate) => candidate.id === editId)?.name || ''}
          party={
            data?.find((candidate) => candidate.id === editId)?.party || ''
          }
          onClose={() => setEditId(null)}
          save={(name, party) => editCandidate(name, party)}
        />
      )}
    </div>
  );
};

type EditModalProps = {
  name: string;
  party: string;
  onClose: () => void;
  save: (name: string, party: string) => void;
};

const EditModal: React.FC<EditModalProps> = ({
  name,
  party,
  onClose,
  save
}) => {
  const [candidateName, setCandidateName] = React.useState<string>(name);
  const [candidateParty, setCandidateParty] = React.useState<string>(party);

  return (
    <div className='modal is-active'>
      <div className='modal-background' onClick={onClose}></div>
      <div className='modal-card'>
        <header className='modal-card-head'>
          <p className='modal-card-title'>Edit Candidate</p>
          <button
            className='delete'
            aria-label='close'
            onClick={onClose}
          ></button>
        </header>
        <section className='modal-card-body'>
          <div className='field'>
            <label className='label'>Name</label>
            <div className='control'>
              <input
                className='input'
                type='text'
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />
            </div>
          </div>
          <div className='field'>
            <label className='label'>Party</label>
            <div className='control'>
              <input
                className='input'
                type='text'
                value={candidateParty}
                onChange={(e) => setCandidateParty(e.target.value)}
              />
            </div>
          </div>
        </section>
        <footer className='modal-card-foot'>
          <button
            className='button is-success'
            onClick={() => save(candidateName, candidateParty)}
          >
            Save
          </button>
          <button className='button' onClick={onClose}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Admin;
