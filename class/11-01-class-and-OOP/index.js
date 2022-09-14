// const d = new Date();
// console.log(d.getFullYear());
// console.log(d.getMonth() + 1);

class Monster {
  power2 = 10;
  constructor(power) {
    this.power = power;
  }

  attack() {
    console.log(`내 공격력은 ${this.power} attacked!`);
  }

  run = () => {
    console.log(`도망가자 ${this.power2} run!`);
  };
}

const monster = new Monster(100);
monster.attack();
console.log(monster.power2);

const monster2 = new Monster(200);
monster2.attack();
monster2.run();
