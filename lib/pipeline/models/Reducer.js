/**
 * Reduces Documents that pass an optional filter into a singular object.
 * @abstract
 */
class Reducer {

  constructor(cache) {
    this.cache = cache;
    this.cache.on('add', this.handleAdd.bind(this));
  }

  reduce(value, doc) {
    throw new Error(`You must implement reduce() on ${constructor.name}`);
  }

  filter(doc) {
    return true;
  }

}

export default Reducer;
