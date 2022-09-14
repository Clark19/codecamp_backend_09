class MyCar {
  #maker;
  #model;
  #year;
  #color;
  #power;

  constructor(maker, model, year, color, power) {
    this.#maker = maker;
    this.#model = model;
    this.#year = year;
    this.#color = color;
    this.#power = power;
  }

  set maker(maker) {
    this.#maker = maker;
  }

  get maker() {
    return this.#maker;
  }

  get model() {
    return this.#model;
  }

  get year() {
    return this.#year;
  }

  get color() {
    return this.#color;
  }

  get power() {
    return this.#power;
  }

  getFullInfo() {
    return `${this.#maker} ${this.#model} ${this.#year} ${this.#color} ${
      this.#power
    }`;
  }
}

const myCar = new MyCar("BMW", "M5", 2020, "black", 700);
// myCar.#maker = "Audi";
console.log(myCar.maker);
console.log(myCar.getFullInfo());
