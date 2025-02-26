const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:password@localhost:5432/postgres');

const registerUser = async (username, password, idBytes, state) => {
    const query = `
        INSERT INTO users (username, password, id_bytes, state)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
    `;
    const result = await db.one(query, [username, password, idBytes, state]);
    return result.id;
}

const loginUser = async (username, password) => {
    const query = `
        SELECT id FROM users
        WHERE username = $1 AND password = $2;
    `;
    const result = await db.oneOrNone(query, [username, password]);
    return result ? result.id : null;
}

const getUserById = async (id) => {
    const query = `
        SELECT * FROM users
        WHERE id = $1;
    `;
    const result = await
        db.oneOrNone(query, [id]);
    return result;
}

const createCandidate = async (candidateName, state, party) => {
    const query = `
        INSERT INTO candidates (name, state, party)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const result = await db.one(query, [candidateName, state, party]);
    return result.id;
}

const listCandidatesForState = async (state) => {
    const query = `
        SELECT * FROM candidates
        WHERE state = $1;
    `;
    const result
        = await db.any(query, [state]);
    return result;
}

const voteForCandidate = async (userId, candidateId) => {
    const query = `
        INSERT INTO votes (user_id, candidate_id)
        VALUES ($1, $2);
    `;
    await db.none(query, [userId, candidateId]);
}

const getVotesForCandidate = async (candidateId) => {
    const query = `
        SELECT COUNT(*) FROM votes
        WHERE candidate_id = $1;
    `;
    const result = await db.one(query, [candidateId]);
    return parseInt(result.count, 10);
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
}