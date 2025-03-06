import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

const port = process.env.PORT || 3000;

import {
  initDb,
  registerUser,
  loginUser,
  getUserById,
  createCandidate,
  listCandidatesForState,
  getVotesForCandidate,
  editCandidate,
  deleteCandidate,
  createSession,
  getSession
} from './db.js';

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);

  initDb();
});

// Generate random secret key, useful for this PoC project (and not having to manage the secret...)
const secret = crypto.randomBytes(64).toString('hex');

const generateToken = (username, isAdmin) => {
  return jwt.sign({ username, isAdmin }, secret, { expiresIn: '1h' });
};

app.use('/api', async (req, res, next) => {
  let sessionToken = req.headers['Authorization'];
    if (!sessionToken) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    sessionToken = sessionToken.replace('Bearer ', '');
  const session = await getSession(sessionToken);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.session = session;
  next();
});

app.use('/api/admin', async (req, res, next) => {
  const { user_id } = req.session;
  const user = await getUserById(user_id);
  if (!user.admin) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  next();
});

app.post('/register', async (req, res) => {
  const { username, password, idBytes, state } = req.body;
  if (!username || !password || !idBytes || !state) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const userId = await registerUser(username, password, idBytes, state);
  if (!userId) {
    res.status(400).json({ error: 'User already exists' });
    return;
  }
  const token = generateToken(username, false);
  await createSession(userId, token);
  res.json({ token });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userId = await loginUser(username, password);
  if (!userId) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const user = await getUserById(userId);
  const token = generateToken(username, user.admin);
  await createSession(userId, token);
  res.json({ token });
});

app.get('api/user/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await getUserById(userId);
  res.json(user);
});

app.post('api/admin/candidate', async (req, res) => {
  const { candidateName, state, party } = req.body;
  const candidateId = await createCandidate(candidateName, state, party);
  res.json({ candidateId });
});

app.get('api/candidates/:state', async (req, res) => {
  const state = req.params.state;
  const candidates = await listCandidatesForState(state);
  res.json(candidates);
});

app.get('api/votes/:candidateId', async (req, res) => {
  const candidateId = parseInt(req.params.candidateId);
  const votes = await getVotesForCandidate(candidateId);
  res.json({ votes });
});

app.put('api/admin/candidate/:id', async (req, res) => {
  const candidateId = parseInt(req.params.id);
  const { candidateName, state, party } = req.body;
  await editCandidate(candidateId, candidateName, state, party);
  res.json({ success: true });
});

app.delete('api/admin/candidate/:id', async (req, res) => {
  const candidateId = parseInt(req.params.id);
  await deleteCandidate(candidateId);
  res.json({ success: true });
});
