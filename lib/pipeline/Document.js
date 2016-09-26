class Document {

  constructor(meta, template) {
    this.meta = meta;
    this.template = template;
    console.log(this.meta);
  }

  render(context) {
    return this.template(context);
  }

}

export default Document;
