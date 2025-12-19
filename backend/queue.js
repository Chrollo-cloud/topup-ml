class Queue {
  constructor() {
    this.items = [];
  }

  // tambah order ke antrian
  enqueue(item) {
    this.items.push(item);
  }

  // ambil order paling depan
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  // lihat order paling depan
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  // cek apakah kosong
  isEmpty() {
    return this.items.length === 0;
  }

  // lihat semua isi queue
  getAll() {
    return this.items;
  }
}

module.exports = Queue;
