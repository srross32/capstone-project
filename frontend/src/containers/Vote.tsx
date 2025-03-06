import React from 'react';
import { useSelector } from '../store/hooks';
import { Link } from 'react-router-dom';
import { useListCandidatesForStateQuery } from '../api';

const Vote: React.FC = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const state = useSelector((state) => state.auth.state);
  const token = useSelector((state) => state.auth.token);

  const { data } = useListCandidatesForStateQuery({state}, {
    skip: !token
  });

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
      <div className="columns" id="vote">

      </div>
    </>
  );
};

export default Vote;
