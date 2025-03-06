import pgpromise from 'pg-promise';
import dotenv from 'dotenv';

const pgp = pgpromise();
const env = dotenv.config();
if (env.error) {
  throw env.error;
}

const db = pgp({
  connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_LOCATION}:5432/voting`,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDb = async () => {
  await db.none(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            id_bytes BYTEA NOT NULL,
            state TEXT NOT NULL,
            admin BOOLEAN DEFAULT FALSE
        );
    `);
  await db.none(`
        CREATE TABLE IF NOT EXISTS candidates (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            state TEXT NOT NULL,
            party TEXT NOT NULL
        );
    `);
  await db.none(`
        CREATE TABLE IF NOT EXISTS votes (
            user_id INTEGER NOT NULL,
            candidate_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (candidate_id) REFERENCES candidates(id),
            PRIMARY KEY (user_id, candidate_id)
        );
    `);
  await db.none(`
        CREATE TABLE IF NOT EXISTS sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );    
    `);
};

const registerUser = async (username, password, idBytes, state) => {
  const query = `
        INSERT INTO users (username, password, id_bytes, state, admin)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;
  const result = await db.one(query, [
    username,
    password,
    idBytes,
    state,
    username === 'admin'
  ]);
  return result.id;
};

const loginUser = async (username, password) => {
  const query = `
        SELECT id FROM users
        WHERE username = $1 AND password = $2;
    `;
  const result = await db.oneOrNone(query, [username, password]);
  return result ? result.id : null;
};

const getUserById = async (id) => {
  const query = `
        SELECT * FROM users
        WHERE id = $1;
    `;
  const result = await db.oneOrNone(query, [id]);
  return result;
};

const createCandidate = async (candidateName, state, party) => {
  const query = `
        INSERT INTO candidates (name, state, party)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
  const result = await db.one(query, [candidateName, state, party]);
  return result.id;
};

const listCandidatesForState = async (state) => {
  const query = `
        SELECT * FROM candidates
        WHERE state = $1;
    `;
  const result = await db.any(query, [state]);
  return result;
};

const voteForCandidate = async (userId, candidateId) => {
  const query = `
        INSERT INTO votes (user_id, candidate_id)
        VALUES ($1, $2);
    `;
  try { 
    await db.none(query, [userId, candidateId]);
  } catch (e) {
    return false;
  }
};

const getVotesForCandidate = async (candidateId) => {
  const query = `
        SELECT COUNT(*) FROM votes
        WHERE candidate_id = $1;
    `;
  const result = await db.one(query, [candidateId]);
  return parseInt(result.count, 10);
};

const editCandidate = async (candidateId, candidateName, state, party) => {
  const query = `
        UPDATE candidates
        SET name = $2, state = $3, party = $4
        WHERE id = $1;
    `;
  await db.none(query, [candidateId, candidateName, state, party]);
};

const deleteCandidate = async (candidateId) => {
  const query = `
        DELETE FROM candidates
        WHERE id = $1;
    `;
  await db.none(query, [candidateId]);
};

const createSession = async (user, token) => {
  const query = `
        INSERT INTO sessions (user_id, token)
        VALUES ($1, $2);
    `;
  await db.none(query, [user, token]);
};

const getSession = async (token) => {
  const query = `
        SELECT * FROM sessions
        WHERE token = $1;
    `;
  const result = await db.oneOrNone(query, [token]);
  return result;
};

export {
  initDb,
  registerUser,
  loginUser,
  getUserById,
  createCandidate,
  listCandidatesForState,
  voteForCandidate,
  getVotesForCandidate,
  editCandidate,
  deleteCandidate,
  createSession,
  getSession
};
