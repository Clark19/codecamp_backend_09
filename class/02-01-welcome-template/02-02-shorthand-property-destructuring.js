// 1. shorthand-property
function qqq(aaa) {
    console.log(aaa)
    console.log(aaa.name)
    console.log(aaa.age)
    console.log(aaa.school)

}

const name = "철수"
const age = 12
const school = "다람쥐초등학교"

// const profile = {
//     name: name,
//     age: age,
//     school: school
// }
// const profile = {name, age, school}
// qqq(profile)
qqq({name, age, school})

// 2. destructuring
function www({apple, banana}) {
    console.log(aaa) // {apple:3, banan: 10} ==> const aaa = basket 과 같은 얘기
    
}

const basket = {
    apple: 3,
    banana: 10
}
www(basket)