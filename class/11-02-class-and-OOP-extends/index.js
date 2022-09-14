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

class FireMonster extends Monster {
  constructor(power) {
    super(power);
  }

  run = () => {
    console.log(`불 도망가자 ${this.power2} run!`);
  };
}

class WaterMonster extends Monster {
  constructor(power) {
    super(power);
  }

  run = () => {
    console.log(`물 도망가자 ${this.power2} run!`);
  };
}

const monster = new Monster(100);
monster.attack();
console.log(monster.power2);

const monster2 = new Monster(200);
monster2.attack();
monster2.run();

const fireMonster = new FireMonster(101);
const waterMonserer = new WaterMonster(102);
fireMonster.attack();
fireMonster.run();

waterMonserer.attack();
waterMonserer.run();
