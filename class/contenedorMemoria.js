class ContenedorMemoria {
  constructor() {
    this.elementos = [];
  }

  listar(id) {
    const elem = this.elementos.find((elem) => elem.id == id);
    if (!elem) throw new Error(`Error listing: element not found`);
    return elem;
  }

  listarAll() {
    return [...this.elementos];
  }

  guardar(elem) {
    let newId =
      this.elementos.length == 0
        ? 1
        : this.elementos[this.elementos.length - 1].id + 1;

    const newElem = { ...elem, id: newId };
    this.elementos.push(newElem);
    return newElem;
  }

  actualizar(elem) {
    const index = this.elementos.findIndex((p) => p.id == elem.id);
    if (index == -1) throw new Error(`Update error: element not found`);
    this.elementos[index] = elem;

    return elem;
  }

  borrar(id) {
    const index = this.elementos.findIndex((elem) => elem.id == id);
    if (index == -1) throw new Error(`Delete error: element not found`);
    return this.elementos.splice(index, 1);
  }

  borrarAll() {
    this.elementos = [];
    return true;
  }
}

module.exports = ContenedorMemoria;
