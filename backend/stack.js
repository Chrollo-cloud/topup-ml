class Stack {
  constructor() {
    this.items = [];
  }

  // tambah ke riwayat (paling atas)
  push(item) {
    this.items.push(item);
  }

  // ambil riwayat terakhir
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop();
  }

  // lihat item paling atas
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  // cek kosong
  isEmpty() {
    return this.items.length === 0;
  }

  // lihat semua riwayat
  getAll() {
    return this.items;
  }
}

module.exports = Stack;
