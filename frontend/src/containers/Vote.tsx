import React from 'react';
import { useSelector } from '../store/hooks';
import { Link } from 'react-router-dom';

const Vote: React.FC = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  return (
    <>
      {isAdmin && (
        <Link
          to='/admin'
          className='button is-link'
          style={{ position: 'absolute', top: 0, right: 0 }}
        >
          Admin
        </Link>
      )}
    </>
  );
};

export default Vote;
