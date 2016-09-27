/**
 * Reduces Documents that pass an optional filter into a singular object.
 * @abstract
 */
class Reducer {

  add(doc) {
    if (this.filter(doc)) {
      this.reduce(doc);
    }
  }

  reduce(value, doc) {
    throw new Error(`You must implement reduce() on ${constructor.name}`);
  }

  filter(doc) {
    return true;
  }

}

export default Reducer;
