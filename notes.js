const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

/**
 * Create a note asynchronously.
 *
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function create({ title, text, datetime } = {}) {
  /* todo útfæra */
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'INSERT INTO notes(datetime, title, text) VALUES($1, $2, $3) RETURNING id';
  const values = [datetime, title, text];

  try {
    const result = await client.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Read all notes.
 *
 * @returns {Promise} Promise representing an array of all note objects
 */
async function readAll() {
  /* todo útfæra */
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM notes');
    return result.rows;
  } catch (err) {
    console.error('Error selecting from data');
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not found
 */
async function readOne(id) {
  /* todo útfæra */
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM notes WHERE id = ($1)', [id]);
    return result.rows;
  } catch (err) {
    console.error('Error selecting from data');
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function update(id, { title, text, datetime } = {}) {
  /* todo útfæra */
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'UPDATE notes SET title = ($3), text = ($4), datetime = ($2) WHERE id = ($1)';
  const values = [id, datetime, title, text];

  try {
    const result = await client.query(query, values);
    return result.rowCount;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'DELETE FROM notes WHERE id = ($1)';
  const values = [id];

  try {
    const result = await client.query(query, values);
    return result.rowCount;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  create,
  readAll,
  readOne,
  update,
  del,
};
