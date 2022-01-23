const fs = require('fs');
const util = require('util');
const uniqueId = require('uuid').v4;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class DbStore {
  readNote() {
    return readFileAsync('db/db.json', 'utf-8');
  }

  writeNote(note) {
    return writeFileAsync('db/db.json', JSON.stringify(note));
  }

  getNote() {
    return this.readNote().then((notes) => {
      let newNotes;

      try {
        newNotes = [].concat(JSON.parse(notes));
      } catch (error) {
        newNotes = [];
      }

      return newNotes;
    });
  }

  addNewNote(note) {
    const { title, text } = note;

    if (!title || !text) {
      throw new Error('message');
    }

    const newNote = {
      title,
      text,
      id: uniqueId(),
    };

    return this.getNote()
      .then((notes) => [...notes, newNote])
      .then((updateNote) => this.writeNote(updateNote))
      .then(() => newNote);
  }

  deleteNote(id) {
    return this.getNote()
      .then((notes) => notes.filter((note) => note.id !== id))
      .then((noteToDelete) => this.writeNote(noteToDelete));
  }
}

module.exports = new DbStore();
