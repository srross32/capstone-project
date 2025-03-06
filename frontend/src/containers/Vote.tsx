import React from 'react';
import { useSelector } from '../store/hooks';
import { Link } from 'react-router-dom';
import { useListCandidatesForStateQuery, useVoteForCandidateMutation } from '../api';

const Vote: React.FC = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const state = useSelector((state) => state.auth.state);
  const token = useSelector((state) => state.auth.token);

  const { data } = useListCandidatesForStateQuery({state}, {
    skip: !token
  });

  const [voteMutation] = useVoteForCandidateMutation();
  const vote = async (candidateId: number) => {
    voteMutation({ id: candidateId }).unwrap().then((res) => {
        if (res.success) {
            alert('Voted successfully');
        } else {
            alert('Failed to vote');
        }
    })
  }

  return (
    <>
      {isAdmin && (
        <Link
          to='/admin'
          className='button is-link'
          style={{ position: 'absolute', top: 20, left: 20 }}
        >
          Admin
        </Link>
      )}
      <div className="columns is-multiline" id="vote">
        {data?.map((candidate) => (
            <div key={candidate.id} className="column is-one-third">
                <div className="card">
                    <div className="card-content">
                        <p className="title">{candidate.name}</p>
                        <p className="subtitle">{candidate.party}</p>
                        <button className="button is-primary" onClick={() => vote(candidate.id)}>Vote</button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </>
  );
};

export default Vote;
